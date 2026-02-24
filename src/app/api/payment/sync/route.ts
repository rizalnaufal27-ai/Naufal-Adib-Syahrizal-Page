import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { coreApi } from "@/lib/midtrans";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { order_id, uuid_token, payment_type } = body;

        if (!order_id || !uuid_token || !payment_type) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("uuid_token", uuid_token)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Verify status with Midtrans
        const statusRes = await (coreApi as any).transaction.status(order_id);

        const transactionStatus = statusRes.transaction_status;
        const fraudStatus = statusRes.fraud_status;

        let newStatus = "pending";
        if (transactionStatus === "capture" || transactionStatus === "settlement") {
            if (fraudStatus === "accept" || !fraudStatus) {
                newStatus = "paid";
            }
        }

        if (newStatus !== "paid") {
            return NextResponse.json({ success: true, status: newStatus });
        }

        let isUpdated = false;

        if (payment_type === "down_payment" && order.down_payment_status !== "paid") {
            await supabase.from("orders").update({
                down_payment_status: "paid",
                status: "processing",
                chat_enabled: true,
                midtrans_order_id: order_id
            }).eq("id", order.id);

            await sendPaymentConfirmation({
                to: order.customer_email,
                customerName: order.customer_name,
                orderNumber: order.order_number,
                paymentType: "down_payment",
                amount: order.down_payment_amount,
                uuidToken: order.uuid_token
            });
            isUpdated = true;
        } else if (payment_type === "final_payment" && order.final_payment_status !== "paid") {
            await supabase.from("orders").update({
                final_payment_status: "paid",
                status: "done",
                progress: 100,
                chat_enabled: false,
                midtrans_order_id: order_id
            }).eq("id", order.id);

            await sendPaymentConfirmation({
                to: order.customer_email,
                customerName: order.customer_name,
                orderNumber: order.order_number,
                paymentType: "final_payment",
                amount: order.final_payment_amount,
                uuidToken: order.uuid_token
            });

            // auto-create portfolio
            try {
                const { data: existing } = await supabase.from("portfolio_items").select("id").eq("title", `${order.service_type} — #${order.order_number}`).maybeSingle();
                if (!existing) {
                    await supabase.from("portfolio_items").insert({
                        title: `${order.service_type} — #${order.order_number}`,
                        description: order.description || `Completed ${order.service_type} project for ${order.customer_name}`,
                        service_type: order.service_type,
                        tags: [order.service_type.toLowerCase().replace(/\s+/g, "-")],
                        image_url: order.evidence_links?.[0]?.url || "",
                        is_published: true,
                    });
                }
            } catch (e) {
                console.error("Auto-portfolio err:", e);
            }
            isUpdated = true;
        }

        return NextResponse.json({ success: true, status: "paid", updated: isUpdated });

    } catch (err) {
        console.error("Sync payment error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
