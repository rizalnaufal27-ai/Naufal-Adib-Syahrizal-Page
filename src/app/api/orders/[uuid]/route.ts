import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("uuid_token", uuid)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ order: data });
    } catch (err) {
        console.error("Fetch order error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
