import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, item, id, password } = body;

        // Simple Auth Check
        if (password !== "naufal-admin-2026") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Use Service Role Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        if (action === "upsert") {
            if (!item) return NextResponse.json({ error: "Missing item" }, { status: 400 });

            const { data, error } = await supabaseAdmin
                .from("portfolio_items")
                .upsert(item)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, data });
        }

        if (action === "delete") {
            if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

            const { error } = await supabaseAdmin
                .from("portfolio_items")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (err: any) {
        console.error("Admin portfolio error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
