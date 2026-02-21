import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { order_id, enabled } = await request.json();

        if (!order_id) {
            return NextResponse.json({ error: "order_id required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("orders")
            .update({ chat_enabled: enabled ?? true })
            .eq("id", order_id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
