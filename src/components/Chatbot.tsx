"use client";
import { useState, useRef, useEffect } from "react";

interface ChatbotProps {
    onOpenPricing: () => void;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

const TRIGGER_WORDS = ["order", "price", "hire", "cost", "quote", "pricing", "harga", "pesan"];

export default function Chatbot({ onOpenPricing }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await res.json();
            let assistantContent = data.content || "Sorry, I couldn't process that. Please try again.";

            // Check for pricing trigger
            if (assistantContent.includes("[OPEN_PRICING]")) {
                assistantContent = assistantContent.replace("[OPEN_PRICING]", "").trim();
                setTimeout(() => onOpenPricing(), 500);
            }

            // Also check user input for trigger words
            const lowerInput = userMsg.content.toLowerCase();
            if (TRIGGER_WORDS.some((w) => lowerInput.includes(w))) {
                if (!assistantContent.includes("[OPEN_PRICING]")) {
                    setTimeout(() => onOpenPricing(), 1000);
                }
            }

            setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
        } catch {
            setMessages([
                ...newMessages,
                { role: "assistant", content: "I'm having trouble connecting. Please try again later." },
            ]);
        }

        setLoading(false);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group"
                style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    boxShadow: "0 4px 30px rgba(59,130,246,0.4)",
                }}
                aria-label="Open chat"
            >
                {isOpen ? (
                    <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
                {/* Glowing orb animation */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        animation: "glowPulse 3s ease-in-out infinite",
                        opacity: 0.5,
                        zIndex: -1,
                    }}
                />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-[150] w-[360px] max-w-[calc(100vw-32px)] rounded-2xl overflow-hidden flex flex-col"
                    style={{
                        height: "500px",
                        background: "rgba(10,10,10,0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-5 py-4 flex items-center gap-3"
                        style={{
                            background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
                            borderBottom: "1px solid var(--color-border)",
                        }}
                    >
                        {/* Animated orb avatar */}
                        <div
                            className="w-9 h-9 rounded-full flex-shrink-0"
                            style={{
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-highlight))",
                                animation: "glowPulse 3s ease-in-out infinite",
                            }}
                        />
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                                Naufal&apos;s Assistant
                            </p>
                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>AI-powered • Always online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-4"
                                    style={{
                                        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-highlight))",
                                        animation: "float 6s ease-in-out infinite",
                                    }}
                                />
                                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                                    Hi! How can I help you? 👋
                                </p>
                                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                    Ask about services, pricing, or portfolio
                                </p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                    style={{
                                        background:
                                            msg.role === "user"
                                                ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                                                : "rgba(255,255,255,0.05)",
                                        color: msg.role === "user" ? "#fff" : "var(--color-text)",
                                        borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                                        borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div
                                    className="px-4 py-3 rounded-2xl"
                                    style={{ background: "rgba(255,255,255,0.05)" }}
                                >
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0s" }} />
                                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3" style={{ borderTop: "1px solid var(--color-border)" }}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-3 rounded-xl text-sm"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text)",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="px-4 rounded-xl transition-all duration-300"
                                style={{
                                    background: input.trim()
                                        ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                                        : "rgba(255,255,255,0.05)",
                                    color: input.trim() ? "#fff" : "var(--color-text-muted)",
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
