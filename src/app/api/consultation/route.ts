import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendOrderReceipt } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customer_name, customer_email, description } = body;

        if (!customer_name || !customer_email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("orders")
            .insert({
                customer_name,
                customer_email,
                service_type: "Consultation",
                description: description || "Consultation Request",
                gross_amount: 0,
                down_payment_amount: 0,
                final_payment_amount: 0,
                estimated_days: 1,
                status: "processing", // auto-processing
                progress: 0,
                down_payment_status: "paid", // skip DP
                final_payment_status: "paid", // skip FP
                chat_enabled: true, // enable chat immediately
                pricing_details: null,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        // Send email receipt
        await sendOrderReceipt({
            to: customer_email,
            customerName: customer_name,
            orderNumber: data.order_number,
            serviceType: "Consultation",
            grossAmount: 0,
            uuidToken: data.uuid_token,
        });

        return NextResponse.json({
            success: true,
            uuid_token: data.uuid_token,
            order: data
        });
    } catch (err) {
        console.error("Create consultation error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
