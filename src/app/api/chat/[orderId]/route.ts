import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAdminChatNotification } from "@/lib/email";

// GET: Fetch chat messages for an order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

        // Verify order exists and chat is enabled
        const { data: order } = await supabase
            .from("orders")
            .select("id, chat_enabled, uuid_token")
            .eq("id", orderId)
            .single();

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Fetch messages
        const { data: messages, error } = await supabase
            .from("order_chats")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: true });

        if (error) {
            return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
        }

        return NextResponse.json({
            messages: messages || [],
            chat_enabled: order.chat_enabled,
        });
    } catch (err) {
        console.error("Chat GET error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: Send a chat message
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const body = await request.json();
        const { message, sender, uuid_token } = body;

        if (!message || !sender) {
            return NextResponse.json({ error: "Missing message or sender" }, { status: 400 });
        }

        if (!["customer", "admin"].includes(sender)) {
            return NextResponse.json({ error: "Invalid sender type" }, { status: 400 });
        }

        // Verify order exists and chat is enabled
        const { data: order } = await supabase
            .from("orders")
            .select("id, chat_enabled, uuid_token")
            .eq("id", orderId)
            .single();

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (!order.chat_enabled) {
            return NextResponse.json({ error: "Chat is not enabled for this order" }, { status: 403 });
        }

        // For customer messages, verify UUID token
        if (sender === "customer" && uuid_token !== order.uuid_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Insert message
        const { data, error } = await supabase
            .from("order_chats")
            .insert({
                order_id: orderId,
                sender,
                message,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
        }

        // Send email notification to admin if client sent the message
        if (sender === "customer") {
            try {
                const { data: orderDetails } = await supabase
                    .from("orders")
                    .select("customer_name, order_number, service_type")
                    .eq("id", orderId)
                    .single();

                if (orderDetails) {
                    await sendAdminChatNotification({
                        customerName: orderDetails.customer_name,
                        orderNumber: orderDetails.order_number,
                        message,
                        serviceType: orderDetails.service_type,
                    });
                }
            } catch (emailErr) {
                console.error("Failed to send admin chat notification:", emailErr);
            }
        }

        return NextResponse.json({ success: true, message: data });
    } catch (err) {
        console.error("Chat POST error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
