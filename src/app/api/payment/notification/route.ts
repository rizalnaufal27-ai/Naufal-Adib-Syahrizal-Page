import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyNotification } from "@/lib/midtrans";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Verify notification with Midtrans
        const { orderId, transactionStatus, fraudStatus, paymentType, transactionId } =
            await verifyNotification(body);

        // Determine if this is a down payment (DP-) or final payment (FP-)
        const isDownPayment = orderId.startsWith("DP-");
        const isFinalPayment = orderId.startsWith("FP-");

        if (!isDownPayment && !isFinalPayment) {
            console.warn("Unknown order ID format:", orderId);
            return NextResponse.json({ status: "ok" });
        }

        // Extract order number from orderId: "DP-123-timestamp" → 123
        const orderNumber = parseInt(orderId.split("-")[1]);

        // Fetch the order by order_number
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("order_number", orderNumber)
            .single();

        if (error || !order) {
            console.error("Order not found for notification:", orderId);
            return NextResponse.json({ status: "ok" });
        }

        // Determine new payment status based on transaction status
        let newStatus: string;
        if (transactionStatus === "capture" || transactionStatus === "settlement") {
            if (fraudStatus === "accept" || !fraudStatus) {
                newStatus = "paid";
            } else {
                newStatus = "pending";
            }
        } else if (
            transactionStatus === "cancel" ||
            transactionStatus === "deny" ||
            transactionStatus === "expire"
        ) {
            newStatus = "unpaid";
        } else if (transactionStatus === "pending") {
            newStatus = "pending";
        } else {
            newStatus = "pending";
        }

        // Build update object
        const update: Record<string, unknown> = {
            payment_type: paymentType,
            transaction_id: transactionId,
        };

        if (isDownPayment) {
            update.down_payment_status = newStatus;
            // Enable chat and set status to processing when down payment is confirmed
            if (newStatus === "paid") {
                update.chat_enabled = true;
                update.status = "processing";
            }
        } else if (isFinalPayment) {
            update.final_payment_status = newStatus;
            // Mark as done when final payment is confirmed
            if (newStatus === "paid") {
                update.status = "done";
                update.progress = 100;
                update.chat_enabled = false;
            }
        }

        // Update order in database
        await supabase
            .from("orders")
            .update(update)
            .eq("id", order.id);

        // Send payment confirmation email if paid
        if (newStatus === "paid") {
            const amount = isDownPayment ? order.down_payment_amount : order.final_payment_amount;
            await sendPaymentConfirmation({
                to: order.customer_email,
                customerName: order.customer_name,
                orderNumber: order.order_number,
                paymentType: isDownPayment ? "down_payment" : "final_payment",
                amount,
                uuidToken: order.uuid_token,
            });
        }

        return NextResponse.json({ status: "ok" });
    } catch (err) {
        console.error("Payment notification error:", err);
        // Always return 200 to Midtrans to prevent retries
        return NextResponse.json({ status: "ok" });
    }
}
