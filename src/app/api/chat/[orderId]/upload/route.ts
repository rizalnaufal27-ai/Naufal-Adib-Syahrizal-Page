import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const sender = formData.get("sender") as string;
        const uuid_token = formData.get("uuid_token") as string;

        if (!file || !sender) {
            return NextResponse.json({ error: "Missing file or sender" }, { status: 400 });
        }

        // Verify order exists and chat enabled
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("id, chat_enabled, uuid_token")
            .eq("id", orderId)
            .single();

        if (orderError || !order || !order.chat_enabled) {
            return NextResponse.json({ error: "Order not found or chat disabled" }, { status: 403 });
        }

        if (sender === "customer" && uuid_token !== order.uuid_token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Upload to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const { url } = await uploadToCloudinary(buffer, `chat/${orderId}`);

        // Insert message as a special format [FILE]
        const messageText = `[FILE]${file.name}|${url}`;

        const { data, error } = await supabase
            .from("order_chats")
            .insert({
                order_id: orderId,
                sender,
                message: messageText,
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "Failed to send file message" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: data });
    } catch (err) {
        console.error("Chat upload error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
