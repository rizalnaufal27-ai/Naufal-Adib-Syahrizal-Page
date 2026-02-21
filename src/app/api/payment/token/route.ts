import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSnapTransaction, coreApi } from "@/lib/midtrans";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uuid_token, payment_type } = body;

        if (!uuid_token || !payment_type) {
            return NextResponse.json(
                { error: "Missing uuid_token or payment_type" },
                { status: 400 }
            );
        }

        // Fetch order
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("uuid_token", uuid_token)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        let amount: number;
        let itemName: string;
        let orderId: string;

        if (payment_type === "down_payment") {
            if (order.down_payment_status === "paid") {
                return NextResponse.json({ error: "Down payment already paid" }, { status: 400 });
            }
            amount = order.down_payment_amount;
            itemName = `Down Payment (20%) - ${order.service_type} #${order.order_number}`;

            // Check if existing token was actually paid but webhook missed it
            if (order.midtrans_order_id && order.midtrans_order_id.startsWith("DP-") && order.down_payment_status === "pending") {
                try {
                    const statusRes = await coreApi.transaction.status(order.midtrans_order_id);
                    if (statusRes.transaction_status === "capture" || statusRes.transaction_status === "settlement") {
                        const newStatus = (statusRes.fraud_status === "accept" || !statusRes.fraud_status) ? "paid" : "pending";
                        if (newStatus === "paid") {
                            await supabase.from("orders").update({ down_payment_status: "paid", status: "processing", chat_enabled: true }).eq("id", order.id);
                            await sendPaymentConfirmation({ to: order.customer_email, customerName: order.customer_name, orderNumber: order.order_number, paymentType: "down_payment", amount, uuidToken: order.uuid_token });
                            return NextResponse.json({ success: true, bypass: true, redirect_url: `/order/${order.uuid_token}` });
                        }
                    }
                } catch { /* Ignore status check errors */ }
            }
            // Generate a fresh orderId to avoid midtrans duplicate ID conflicts
            orderId = `DP-${order.order_number}-${Date.now()}`;
        } else if (payment_type === "final_payment") {
            if (order.final_payment_status === "paid") {
                return NextResponse.json({ error: "Final payment already paid" }, { status: 400 });
            }
            if (order.down_payment_status !== "paid") {
                return NextResponse.json({ error: "Down payment must be paid first" }, { status: 400 });
            }
            amount = order.final_payment_amount;
            itemName = `Final Payment (80%) - ${order.service_type} #${order.order_number}`;

            // Check if existing token was actually paid but webhook missed it
            if (order.midtrans_order_id && order.midtrans_order_id.startsWith("FP-") && order.final_payment_status === "pending") {
                try {
                    const statusRes = await coreApi.transaction.status(order.midtrans_order_id);
                    if (statusRes.transaction_status === "capture" || statusRes.transaction_status === "settlement") {
                        const newStatus = (statusRes.fraud_status === "accept" || !statusRes.fraud_status) ? "paid" : "pending";
                        if (newStatus === "paid") {
                            await supabase.from("orders").update({ final_payment_status: "paid", status: "done", progress: 100, chat_enabled: false }).eq("id", order.id);
                            await sendPaymentConfirmation({ to: order.customer_email, customerName: order.customer_name, orderNumber: order.order_number, paymentType: "final_payment", amount, uuidToken: order.uuid_token });
                            return NextResponse.json({ success: true, bypass: true, redirect_url: `/order/${order.uuid_token}` });
                        }
                    }
                } catch { /* Ignore status check errors */ }
            }
            // Generate a fresh orderId to avoid duplicate conflicts
            orderId = `FP-${order.order_number}-${Date.now()}`;
        } else {
            return NextResponse.json({ error: "Invalid payment_type" }, { status: 400 });
        }

        // AUTO-COMPLETE: $0 payments bypass Midtrans entirely
        if (amount <= 0) {
            const updateField: Record<string, unknown> = payment_type === "down_payment"
                ? { down_payment_status: "paid", status: "processing", chat_enabled: true, midtrans_order_id: orderId }
                : { final_payment_status: "paid", status: "done", progress: 100, midtrans_order_id: orderId };

            await supabase
                .from("orders")
                .update(updateField)
                .eq("id", order.id);

            return NextResponse.json({
                success: true,
                bypass: true,
                redirect_url: `/order/${order.uuid_token}`
            });
        }

        // Create Midtrans Snap transaction
        const snapRes = await createSnapTransaction({
            orderId,
            amount,
            customerName: order.customer_name || "Customer",
            customerEmail: order.customer_email || "noemail@example.com",
            itemName,
        });

        // Store the midtrans_order_id and update payment status to pending
        const updateField: Record<string, unknown> = {
            midtrans_order_id: orderId,
        };

        if (payment_type === "down_payment") {
            updateField.down_payment_status = "pending";
        } else {
            updateField.final_payment_status = "pending";
        }

        const { error: updateError } = await supabase
            .from("orders")
            .update(updateField)
            .eq("id", order.id);

        if (updateError) {
            console.error("Failed to update order with midtrans_order_id:", updateError);
        }

        return NextResponse.json({
            success: true,
            token: snapRes.token,
            redirect_url: snapRes.redirect_url,
        });
    } catch (err) {
        console.error("Payment token error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
