"use client";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface ChatbotProps {
    onOpenPricing: () => void;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

const TRIGGER_WORDS = ["order", "price", "hire", "cost", "quote", "pricing", "harga", "pesan", "book", "start"];

// ── Markdown Renderer ──────────────────────────────────────────
function renderMd(text: string): ReactNode {
    const lines = text.split("\n");
    const elements: ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const processText = (t: string, key: string) => {
        const parts = t.split(/(\*\*[^*]+\*\*)/g);
        return (
            <span key={key}>
                {parts.map((p, i) =>
                    p.startsWith("**") && p.endsWith("**")
                        ? <strong key={i} className="font-bold text-white">{p.slice(2, -2)}</strong>
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
            <div key={`tbl-${elements.length}`} className="my-2 overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <table className="w-full text-[11px]">
                    <thead><tr style={{ background: "rgba(255,255,255,0.04)" }}>{header.map((h, i) => <th key={i} className="px-2 py-1.5 text-left font-bold text-white/70">{h.trim()}</th>)}</tr></thead>
                    <tbody>{body.map((row, ri) => <tr key={ri} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>{row.map((c, ci) => <td key={ci} className="px-2 py-1 text-white/50">{c.trim()}</td>)}</tr>)}</tbody>
                </table>
            </div>
        );
        tableRows = [];
    };

    lines.forEach((line, li) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
            inTable = true;
            tableRows.push(trimmed.split("|").filter(Boolean));
        } else {
            if (inTable) { flushTable(); inTable = false; }
            if (trimmed === "") elements.push(<br key={`br-${li}`} />);
            else if (trimmed.startsWith("## ")) elements.push(<p key={li} className="font-bold text-xs text-white/60 mt-2 mb-1 uppercase tracking-wider">{trimmed.slice(3)}</p>);
            else if (/^\d+\.\s/.test(trimmed)) elements.push(<p key={li} className="ml-2">{processText(trimmed, `li-${li}`)}</p>);
            else if (trimmed.startsWith("- ")) elements.push(<p key={li} className="ml-2">• {processText(trimmed.slice(2), `bl-${li}`)}</p>);
            else elements.push(<p key={li}>{processText(trimmed, `p-${li}`)}</p>);
        }
    });
    if (inTable) flushTable();
    return <>{elements}</>;
}

// ── Quick Action Suggestions ───────────────────────────────────
const SUGGESTIONS = [
    { emoji: "💰", key: "pricing" },
    { emoji: "📁", key: "portfolio" },
    { emoji: "📦", key: "track" },
    { emoji: "🚀", key: "order" },
];

// ── AI Concierge Pill ──────────────────────────────────────────
export default function Chatbot({ onOpenPricing }: ChatbotProps) {
    const t = useTranslations("Chatbot");
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) { inputRef.current?.focus(); }
    }, [isOpen]);

    // Auto-greet after 8 seconds of inactivity
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen && messages.length === 0) setHasNewMessage(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, [isOpen, messages.length]);

    const sendMessage = useCallback(async (overrideInput?: string) => {
        const text = (overrideInput || input).trim();
        if (!text || loading) return;

        const userMsg: Message = { role: "user", content: text };
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
            if (!isOpen) setHasNewMessage(true);
        } catch {
            setMessages([
                ...newMessages,
                { role: "assistant", content: t("error.connection") },
            ]);
        }

        setLoading(false);
    }, [input, loading, messages, t, onOpenPricing, isOpen]);

    return (
        <>
            {/* ═══ Floating Pill Trigger ═══ */}
            <motion.button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setHasNewMessage(false);
                }}
                className="fixed z-[150] flex items-center gap-2.5 transition-all duration-300 group cursor-pointer"
                style={{
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(20,20,20,0.9)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "9999px",
                    padding: isOpen ? "10px 16px" : "10px 20px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Toggle concierge"
            >
                {/* Status Dot */}
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>

                {!isOpen && (
                    <span className="text-xs font-medium text-white/70 tracking-wide">
                        {t("pillLabel")}
                    </span>
                )}

                {isOpen ? (
                    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                ) : (
                    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                )}

                {/* New Message Indicator */}
                {hasNewMessage && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#141414]" />
                )}
            </motion.button>

            {/* ═══ Chat Panel ═══ */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="fixed z-[149] flex flex-col overflow-hidden"
                        style={{
                            bottom: "72px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "min(420px, calc(100vw - 32px))",
                            height: "520px",
                            background: "rgba(10,10,10,0.97)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "20px",
                            boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                        }}
                    >
                        {/* ── Header ── */}
                        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm" style={{ background: "rgba(255,255,255,0.06)" }}>
                                ✦
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{t("title")}</p>
                                <p className="text-[11px] text-white/30">{t("subtitle")}</p>
                            </div>
                        </div>

                        {/* ── Messages ── */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-sm text-white/60 mb-1">{t("greeting")}</p>
                                    <p className="text-[11px] text-white/30 mb-5">{t("helpText")}</p>
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {SUGGESTIONS.map((s) => (
                                            <button
                                                key={s.key}
                                                onClick={() => sendMessage(t(`quickActions.${s.key}`))}
                                                className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10"
                                                style={{
                                                    background: "rgba(255,255,255,0.04)",
                                                    color: "rgba(255,255,255,0.5)",
                                                    border: "1px solid rgba(255,255,255,0.06)",
                                                }}
                                            >
                                                {s.emoji} {t(`quickActions.${s.key}`)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className="max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed"
                                        style={{
                                            background: msg.role === "user"
                                                ? "rgba(255,255,255,0.08)"
                                                : "rgba(255,255,255,0.03)",
                                            color: "rgba(255,255,255,0.75)",
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
                                    <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                                        <div className="flex gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0s" }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0.15s" }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0.3s" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ── Input ── */}
                        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder={t("placeholder")}
                                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        color: "rgba(255,255,255,0.8)",
                                    }}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="px-4 rounded-xl transition-all duration-200"
                                    style={{
                                        background: input.trim() ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                                        color: input.trim() ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
