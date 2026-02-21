import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const orderId = formData.get("order_id") as string | null;

        if (!file || !orderId) {
            return NextResponse.json({ error: "Missing file or order_id" }, { status: 400 });
        }

        // Verify order exists
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("id, evidence_links")
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Upload to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const { url, publicId } = await uploadToCloudinary(buffer, `orders/${orderId}`);

        // Append to evidence_links
        const existingLinks = (order.evidence_links as Array<{ url: string; publicId: string; uploadedAt: string }>) || [];
        const updatedLinks = [
            ...existingLinks,
            { url, publicId, uploadedAt: new Date().toISOString() },
        ];

        const { error: updateError } = await supabase
            .from("orders")
            .update({ evidence_links: updatedLinks })
            .eq("id", orderId);

        if (updateError) {
            return NextResponse.json({ error: "Failed to update evidence" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            evidence: { url, publicId },
        });
    } catch (err) {
        console.error("Evidence upload error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
