"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ChatbotProps {
    onOpenPricing: () => void;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

const TRIGGER_WORDS = ["order", "price", "hire", "cost", "quote", "pricing", "harga", "pesan"];

// Simple markdown renderer for tables and bold text
function renderMd(text: string): ReactNode {
    const lines = text.split("\n");
    const elements: ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const processText = (t: string, key: string) => {
        // Bold
        const parts = t.split(/(\*\*[^*]+\*\*)/g);
        return (
            <span key={key}>
                {parts.map((p, i) =>
                    p.startsWith("**") && p.endsWith("**")
                        ? <strong key={i} className="font-bold">{p.slice(2, -2)}</strong>
                        : p
                )}
            </span>
        );
    };

    const flushTable = () => {
        if (tableRows.length < 2) return;
        const header = tableRows[0];
        const body = tableRows.slice(1).filter(r => !r.every(c => /^[-:]+$/.test(c.trim())));
        elements.push(
            <div key={`tbl-${elements.length}`} className="my-2 overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                <table className="w-full text-[11px]">
                    <thead><tr style={{ background: "rgba(99,102,241,0.15)" }}>{header.map((h, i) => <th key={i} className="px-2 py-1.5 text-left font-bold text-indigo-300">{h.trim()}</th>)}</tr></thead>
                    <tbody>{body.map((row, ri) => <tr key={ri} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>{row.map((c, ci) => <td key={ci} className="px-2 py-1 text-white/70">{c.trim()}</td>)}</tr>)}</tbody>
                </table>
            </div>
        );
        tableRows = [];
    };

    lines.forEach((line, li) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
            inTable = true;
            const cells = trimmed.split("|").filter(Boolean);
            tableRows.push(cells);
        } else {
            if (inTable) { flushTable(); inTable = false; }
            if (trimmed === "") {
                elements.push(<br key={`br-${li}`} />);
            } else if (trimmed.startsWith("## ")) {
                elements.push(<p key={li} className="font-bold text-xs text-indigo-300 mt-2 mb-1">{trimmed.slice(3)}</p>);
            } else if (/^\d+\.\s/.test(trimmed)) {
                elements.push(<p key={li} className="ml-2">{processText(trimmed, `li-${li}`)}</p>);
            } else if (trimmed.startsWith("- ")) {
                elements.push(<p key={li} className="ml-2">• {processText(trimmed.slice(2), `bl-${li}`)}</p>);
            } else {
                elements.push(<p key={li}>{processText(trimmed, `p-${li}`)}</p>);
            }
        }
    });
    if (inTable) flushTable();
    return <>{elements}</>;
}

export default function Chatbot({ onOpenPricing }: ChatbotProps) {
    const t = useTranslations("Chatbot");
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
            let assistantContent = data.content || t("error.processing");

            if (assistantContent.includes("[OPEN_PRICING]")) {
                assistantContent = assistantContent.replace("[OPEN_PRICING]", "").trim();
                setTimeout(() => onOpenPricing(), 500);
            }

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
                { role: "assistant", content: t("error.connection") },
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
                    <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                ) : (
                    <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                )}
                <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", animation: "glowPulse 3s ease-in-out infinite", opacity: 0.5, zIndex: -1 }} />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-[150] w-[380px] max-w-[calc(100vw-32px)] rounded-2xl overflow-hidden flex flex-col"
                    style={{ height: "520px", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", border: "1px solid var(--color-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                >
                    {/* Header */}
                    <div className="px-5 py-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))", borderBottom: "1px solid var(--color-border)" }}>
                        <div className="w-9 h-9 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-highlight))", animation: "glowPulse 3s ease-in-out infinite" }} />
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{t("title")}</p>
                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t("subtitle")}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 rounded-full mx-auto mb-3" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-highlight))", animation: "float 6s ease-in-out infinite" }} />
                                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{t("greeting")} 👋</p>
                                <p className="text-xs mt-1 mb-3" style={{ color: "var(--color-text-muted)" }}>{t("helpText")}</p>
                                {/* Quick action buttons */}
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {[t("quickActions.pricing"), t("quickActions.portfolio"), t("quickActions.track"), t("quickActions.order")].map(q => (
                                        <button key={q} onClick={() => { setInput(q.replace(/^[\u2700-\u27bf\ud800-\udbff\udc00-\udfff\u2000-\u3300\ufe0e\ufe0f\u00a9\u00ae]+\s*/, "").trim()); }} className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:scale-105" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>{q}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                    style={{
                                        background: msg.role === "user" ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "rgba(255,255,255,0.05)",
                                        color: msg.role === "user" ? "#fff" : "var(--color-text)",
                                        borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                                        borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                                    }}
                                >
                                    {msg.role === "assistant" ? renderMd(msg.content) : msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
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
                                type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={t("placeholder")}
                                className="flex-1 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", color: "var(--color-text)", outline: "none" }}
                            />
                            <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4 rounded-xl transition-all duration-300" style={{ background: input.trim() ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "rgba(255,255,255,0.05)", color: input.trim() ? "#fff" : "var(--color-text-muted)" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
