import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSnapTransaction } from "@/lib/midtrans";

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
            orderId = `FP-${order.order_number}-${Date.now()}`;
        } else {
            return NextResponse.json({ error: "Invalid payment_type" }, { status: 400 });
        }

        // Create Midtrans Snap transaction
        let token = "";
        let redirect_url = "";
        let bypass = false;

        // TEST MODE BYPASS
        if (amount === 0 && process.env.NEXT_PUBLIC_APP_MODE === "test") {
            bypass = true;
            // Auto-update status
            const updateField: any = payment_type === "down_payment"
                ? { down_payment_status: "paid", status: "processing", chat_enabled: true }
                : { final_payment_status: "paid", status: "completed" };

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

        const snapRes = await createSnapTransaction({
            orderId,
            amount,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            itemName,
        });
        token = snapRes.token;
        redirect_url = snapRes.redirect_url;

        // Update order payment status to pending and store midtrans_order_id
        const updateField: any = payment_type === "down_payment"
            ? { down_payment_status: "pending" }
            : { final_payment_status: "pending" };

        updateField.midtrans_order_id = orderId;

        await supabase
            .from("orders")
            .update(updateField)
            .eq("id", order.id);

        return NextResponse.json({
            success: true,
            token,
            redirect_url,
        });
    } catch (err) {
        console.error("Payment token error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
