import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendOrderReceipt } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customer_name, customer_email, service_type, description, gross_amount, estimated_days } = body;

        // Validate required fields
        if (!customer_name || !customer_email || !service_type || gross_amount === undefined || gross_amount === null) {
            return NextResponse.json(
                { error: "Missing required fields: customer_name, customer_email, service_type, gross_amount" },
                { status: 400 }
            );
        }

        // Calculate payment split
        const downPaymentAmount = Math.round(gross_amount * 0.2);
        const finalPaymentAmount = gross_amount - downPaymentAmount;

        // Insert order
        const { data, error } = await supabase
            .from("orders")
            .insert({
                customer_name,
                customer_email,
                service_type,
                description: description || "",
                gross_amount,
                down_payment_amount: downPaymentAmount,
                final_payment_amount: finalPaymentAmount,
                estimated_days: estimated_days || null,
                status: "pending",
                progress: 0,
                down_payment_status: "unpaid",
                final_payment_status: "unpaid",
                chat_enabled: false,
                pricing_details: body.pricing_details || null,
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        // Send receipt email
        await sendOrderReceipt({
            to: customer_email,
            customerName: customer_name,
            orderNumber: data.order_number,
            serviceType: service_type,
            grossAmount: gross_amount,
            uuidToken: data.uuid_token,
        });

        return NextResponse.json({
            success: true,
            order: {
                id: data.id,
                order_number: data.order_number,
                uuid_token: data.uuid_token,
                down_payment_amount: downPaymentAmount,
                final_payment_amount: finalPaymentAmount,
            },
        });
    } catch (err) {
        console.error("Create order error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
