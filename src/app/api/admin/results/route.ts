import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const orderId = formData.get("order_id") as string;

        if (!file || !orderId) {
            return NextResponse.json({ error: "Missing file or order_id" }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Upload file to Supabase Storage
        const ext = file.name.split(".").pop() || "bin";
        const storagePath = `results/${orderId}/${Date.now()}_${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await supabase.storage
            .from("order-files")
            .upload(storagePath, buffer, {
                contentType: file.type || "application/octet-stream",
                upsert: false,
            });

        if (uploadError) {
            // If bucket doesn't exist, try creating it
            if (uploadError.message?.includes("not found") || uploadError.message?.includes("Bucket")) {
                await supabase.storage.createBucket("order-files", { public: true });
                const { error: retry } = await supabase.storage
                    .from("order-files")
                    .upload(storagePath, buffer, { contentType: file.type || "application/octet-stream" });
                if (retry) {
                    console.error("Upload retry error:", retry);
                    return NextResponse.json({ error: retry.message }, { status: 500 });
                }
            } else {
                console.error("Upload error:", uploadError);
                return NextResponse.json({ error: uploadError.message }, { status: 500 });
            }
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("order-files").getPublicUrl(storagePath);
        const publicUrl = urlData?.publicUrl || "";

        // Update order's result_files array
        const { data: order } = await supabase.from("orders").select("result_files").eq("id", orderId).single();
        const currentFiles = order?.result_files || [];
        const newFileEntry = {
            name: file.name,
            url: publicUrl,
            type: file.type || "application/octet-stream",
            size: file.size,
            uploadedAt: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
            .from("orders")
            .update({ result_files: [...currentFiles, newFileEntry] })
            .eq("id", orderId);

        if (updateError) {
            console.error("Update error:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, file: newFileEntry });
    } catch (err) {
        console.error("Result upload error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
