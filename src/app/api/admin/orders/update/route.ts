import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, updates, password } = body;

        // Simple Auth Check
        if (password !== "naufal-admin-2026") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Use Service Role Client for Admin actions
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );


        if (!id || !updates) {
            return NextResponse.json({ error: "Missing id or updates" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from("orders")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Admin update error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: data });
    } catch (err) {
        console.error("Admin update error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
