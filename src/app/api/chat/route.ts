import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { supabase } from "@/lib/supabase";
import { PORTFOLIO_RAG } from "@/lib/portfolio-data";

async function buildDynamicContext() {
    let portfolioList = "";

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
    } catch { /* ignore */ }

    return { portfolioList };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const messages = body.messages;
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "AI assistant is not configured." }),
                { status: 503, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "No messages provided." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Fetch live data from DB (graceful, non-blocking)
        const { portfolioList } = await buildDynamicContext();

        const SYSTEM_PROMPT = `You are NASAI (Naufal Adib Syahrizal Artificial Intelligence), the exclusive AI concierge for Naufal's creative studio website.
Your personality is professional, highly structured, helpful, compact, and friendly. You represent a premium "Matte Dark Studio" aesthetic.
Answer in the language the user speaks (Indonesian or English).

### KEY RULES:
1. **No Hallucination**: Only refer to the data below. If unsure, tell the user to contact Naufal at +62 857-8207-4034.
2. **Compact Responses**: 2-3 sentences per point. Use bullet points for lists.
3. **Tone**: Premium Concierge - professional, calm, and reliable.

### ABOUT NAUFAL:
- **Full Name**: Naufal Adib Syahrizal.
- **Background**: Final year VCD (Visual Communication Design) student at Indraprasta PGRI University.
- **Specialization**: Visual storytelling, concept-based design, and digital experiences.
- **Contact**: WhatsApp +62 857-8207-4034

### SERVICES & PRICING (IDR):
1. **Graphic Design**: Starting Rp 75,000 (Logo, Banner, Poster). Full Brand Identity up to Rp 775,000+.
2. **Illustration**: Starting Rp 75,000/character (Half Body). Full render Rp 300,000 - Rp 620,000+.
3. **Studio & Photography (Cinematic)**: Session Rp 300,000+. Studio Rental from Rp 150,000/hr. Jabodetabek only.
4. **Video Production**: Starting Rp 150,000. Color-graded cinematic: Rp 300,000 - Rp 700,000+.
5. **UI/UX & Web Design (Professional)**: Landing Page from Rp 1,500,000. SaaS/Dashboard Rp 2,500,000 - Rp 5,000,000+.

${PORTFOLIO_RAG}

${portfolioList}

### HOW TO ORDER:
- Step 1: Click the "Start a Project" or "Order Now" button and use the pricing calculator.
- Step 2: Fill in project details and submit.
- Step 3: You'll receive a private link to track your project at /track.
- Step 4: Pay 20% down payment to start.
- Step 5: Track progress via the /track page.
- Step 6: Pay remaining 80% on completion and download deliverables.

When user asks about pricing, respond with a clear summary and mention the pricing calculator.
When user mentions ordering, include [OPEN_PRICING] at the end of your response.
`;

        const openrouter = createOpenRouter({ apiKey });

        const result = streamText({
            model: openrouter("google/gemini-2.0-flash-001"),
            system: SYSTEM_PROMPT,
            messages,
            temperature: 0.7,
        });

        return result.toDataStreamResponse();
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Chat API error:", errMsg);
        return new Response(
            JSON.stringify({ error: "Something went wrong. Please try again." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
