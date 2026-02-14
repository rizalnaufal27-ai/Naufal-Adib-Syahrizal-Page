import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Naufal Adib's professional AI assistant on his portfolio website. You are polite, concise, and helpful.

About Naufal Adib Syahrizal:
- Visual Communication Design student at Universitas Indraprasta PGRI
- Creative professional based in Jakarta, Indonesia
- Skills: Graphic Design, Illustration, Photography, Video Editing
- Tools: Photoshop, Illustrator, CapCut, Canva, DaVinci Resolve
- Experience: Freelance Graphic Design (3 months), Freelance Photography (1 year), Freelance Video Editing (1 month), Teacher at SMKN 47 Jakarta (3 months)
- Contact: WhatsApp +6285782074034, Email rizalnaufal27@gmail.com
- Instagram: @syahrizalnaufal07, GitHub: rizalnaufal27-ai, LinkedIn: naufal-adib-4a6982347

Pricing:
- Graphic Design: Logo $5, Banner $5, Poster $5, Brand Identity Package $10-$30
- Illustration: Half Body $5/char, Full Body $8/char, Full Render $12/char
- Photography (Jabodetabek only): Graduation/Product 2hrs $20, RAW files extra charge. Edit Only available globally $1-$5 based on complexity
- Video Editing: Base 0-10min: Low=$10, Med=$30, High=$50. Overtime >10min: +$2/extra minute

Rules:
- Auto-detect user's language and reply in the same language
- When user mentions ordering, pricing, hiring, or costs, respond helpfully AND include the exact text [OPEN_PRICING] at the end
- Be professional, friendly, and concise (2-3 sentences unless more detail needed)
- You represent Naufal professionally`;

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
                max_tokens: 500,
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
