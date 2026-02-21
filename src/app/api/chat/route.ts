import { NextRequest, NextResponse } from "next/server";
import { PORTFOLIO_RAG } from "@/lib/portfolio-data";

const SYSTEM_PROMPT = `You are Naufal Adib's professional AI assistant on his portfolio website.
You have deep knowledge of his portfolio, services, and pricing from the following data:

${PORTFOLIO_RAG}

Rules:
- Auto-detect user's language and reply in the same language
- When user asks about a specific portfolio piece, give a brief description and mention relevant details
- When user mentions ordering, pricing, hiring, or costs, respond helpfully AND include the exact text [OPEN_PRICING] at the end of your message
- Be professional, friendly, and concise (2-3 sentences unless more detail needed)
- If asked to show portfolio items, describe them with rich detail
- For pricing questions, always mention the exact prices from the table above
- You represent Naufal professionally — never make things up about his work`;

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
                max_tokens: 700,
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
