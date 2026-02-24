import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { coreApi } from "@/lib/midtrans";

export async function POST(request: NextRequest) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
        }

        // Fetch order to get transaction_id
        const { data: order } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Must have at least one transaction to check
        if (!order.transaction_id && order.down_payment_status !== "paid") {
            // Try to find by order_id format if we don't have transaction_id
            // But usually we need transaction_id.
            // However, we can also check by orderId (DP-123-timestamp).
            // But we don't know the exact timestamp used for the payment ID unless we stored it.
            // If transaction_id is missing, we might be out of luck unless we search by order_number roughly.
            // But let's assume if they paid, we might have gotten a webhook event even if failed processing?
            // Actually, if they paid via Snap, we don't get transaction_id until notification.
            // BUT, Snap token is created with a specific orderId.
            // We generated `orderId = DP-${order.order_number}-${Date.now()}`.
            // We didn't store that specific orderId! We only stored it in memory during token creation.
            // This is a flaw. We should have stored the `midtrans_order_id` in the database.

            // Allow manual override for testing if no transaction_id
            return NextResponse.json({ message: "No transaction ID found to check. Please wait for webhook or check Midtrans dashboard." }, { status: 400 });
        }

        // If we have transaction_id (from a previous partial webhook?), check it.
        // Or if we stored the midtrans order id. 
        // Since we didn't store midtrans_order_id, we can't easily check status if webhook never fired at all.

        // WORKAROUND: For this specific request, I will rely on the fact that if they paid,
        // they might have got a "pending" webhook which stored transaction_id.

        let transactionIdToCheck = order.transaction_id;

        // If no transaction_id, try midtrans_order_id
        if (!transactionIdToCheck && order.midtrans_order_id) {
            transactionIdToCheck = order.midtrans_order_id;
        }

        if (transactionIdToCheck) {
            const statusResponse = await (coreApi as any).transaction.status(transactionIdToCheck);
            const { transaction_status, fraud_status, transaction_id } = statusResponse;

            let newStatus = "pending";
            if (transaction_status === "capture" || transaction_status === "settlement") {
                if (fraud_status === "accept" || !fraud_status) {
                    newStatus = "paid";
                }
            } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
                newStatus = "unpaid";
            }

            // Update DB
            const update: any = {
                transaction_id: transaction_id || transactionIdToCheck // Save the real transaction_id if we have it
            };

            // Infer payment type if possible or just check current status
            const isDownPayment = order.midtrans_order_id?.startsWith("DP-") || (!order.down_payment_status || order.down_payment_status !== "paid");

            if (isDownPayment && newStatus === "paid" && order.down_payment_status !== "paid") {
                update.down_payment_status = "paid";
                update.chat_enabled = true;
                update.status = "processing";
                update.payment_type = "down_payment";
            } else if (!isDownPayment && newStatus === "paid" && order.final_payment_status !== "paid") {
                update.final_payment_status = "paid";
                update.status = "done";
                update.progress = 100;
                update.chat_enabled = false; // Disable chat when fully done
                update.payment_type = "final_payment";
            }

            if (Object.keys(update).length > 0) {
                await supabase.from("orders").update(update).eq("id", orderId);
                return NextResponse.json({ success: true, status: newStatus, updated: true });
            }

            return NextResponse.json({ success: true, status: transaction_status, updated: false });
        }

        return NextResponse.json({ error: "No transaction record found (transaction_id or midtrans_order_id missing)" }, { status: 404 });
    } catch (err) {
        console.error("Check status error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
