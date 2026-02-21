import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PORTFOLIO_RAG } from "@/lib/portfolio-data";

async function buildDynamicContext() {
    let pricingTable = "";
    let portfolioList = "";

    try {
        const { data: pricing } = await supabase
            .from("pricing_config")
            .select("*")
            .order("service");

        if (pricing && pricing.length > 0) {
            pricingTable = "\n## Live Pricing Table\n| Service | Package | Price (USD) |\n|---------|---------|-------------|\n";
            pricing.forEach((p: { service: string; label: string; price_usd: number }) => {
                pricingTable += `| ${p.service} | ${p.label} | $${p.price_usd} |\n`;
            });
        }
    } catch { }

    try {
        const { data: portfolio } = await supabase
            .from("portfolio_items")
            .select("title, description, service_type")
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .limit(15);

        if (portfolio && portfolio.length > 0) {
            portfolioList = "\n## Recent Portfolio Works\n";
            portfolio.forEach((p: { title: string; description: string; service_type: string }, i: number) => {
                portfolioList += `${i + 1}. **${p.title}** — ${p.description || "No description"} (${p.service_type})\n`;
            });
        }
    } catch { }

    return { pricingTable, portfolioList };
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { content: "AI assistant is not configured yet. Please contact Naufal directly!" },
                { status: 200 }
            );
        }

        // Fetch live data from DB
        const { pricingTable, portfolioList } = await buildDynamicContext();

        const SYSTEM_PROMPT = `You are Naufal Adib's professional AI assistant on his portfolio website.
You have deep knowledge of his portfolio, services, and pricing from the following data:

${PORTFOLIO_RAG}

${pricingTable}

${portfolioList}

## Your Capabilities
1. **Pricing Expert**: You can show detailed pricing tables to clients. When asked about pricing, format the pricing as a clean table and provide accurate prices from the data above.
2. **Project Tracker**: You can guide clients to track their active projects. Tell them to visit the "Track My Project" page at /track where they can enter their email to see project status, progress percentage, and payment details.
3. **Portfolio Guide**: When clients ask about relevant work or examples, reference specific portfolio pieces from the list above. Suggest related works based on the client's needs.
4. **Order Guide**: Walk clients through the ordering process:
   - Step 1: Click the "Order" button or use the pricing calculator
   - Step 2: Fill in project details (service type, description, contact info)
   - Step 3: Pay the 20% down payment to start the project
   - Step 4: Track progress and communicate via the project chat
   - Step 5: Pay the remaining 80% upon completion
   - Step 6: Download final deliverables from the order dashboard

## Response Rules
- Auto-detect user's language and reply in the same language (Indonesian or English)
- When user asks about pricing, include the FULL pricing table in your response using markdown table format
- When user mentions ordering, pricing, hiring, or costs: respond helpfully AND include [OPEN_PRICING] at the end
- Be professional, friendly, and concise (2-4 sentences unless more detail needed)
- For tracking questions, always mention /track page
- When recommending portfolio works, be specific about which pieces match the client's needs
- You represent Naufal professionally — never make things up about his work
- Use emoji sparingly but effectively to make responses engaging 🎨`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://naufaladib.com",
                "X-Title": "Naufal Adib Portfolio",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages.map((m: { role: string; content: string }) => ({
                        role: m.role,
                        content: m.content,
                    })),
                ],
                max_tokens: 1200,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter error:", errorText);
            return NextResponse.json(
                { content: "I'm having trouble right now. Please try again in a moment!" },
                { status: 200 }
            );
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

        return NextResponse.json({ content });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { content: "Something went wrong. Please try again!" },
            { status: 200 }
        );
    }
}
