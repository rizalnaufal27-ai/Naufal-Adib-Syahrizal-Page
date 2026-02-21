"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface ChatMessage {
    id: string;
    sender: "customer" | "admin";
    message: string;
    created_at: string;
}

interface OrderChatProps {
    orderId: string;
    uuidToken: string;
    chatEnabled: boolean;
}

export default function OrderChat({ orderId, uuidToken, chatEnabled }: OrderChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/chat/${orderId}`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch {
            // Silently fail on polling
        }
    }, [orderId]);

    useEffect(() => {
        if (chatEnabled && isOpen) {
            fetchMessages();
            intervalRef.current = setInterval(fetchMessages, 5000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [chatEnabled, isOpen, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch(`/api/chat/${orderId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: newMessage.trim(),
                    sender: "customer",
                    uuid_token: uuidToken,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setNewMessage("");
                fetchMessages();
            }
        } catch {
            // Handle error silently
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!chatEnabled) {
        return (
            <div className="agency-card">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Chat</h3>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            Chat will be available after down payment is confirmed.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="agency-card !p-0 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: isOpen ? "1px solid var(--color-border)" : "none" }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Chat with Admin</h3>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            {messages.length} messages
                        </p>
                    </div>
                </div>
                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="transition-transform duration-300"
                    style={{
                        color: "var(--color-text-muted)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Chat body */}
            {isOpen && (
                <>
                    <div
                        className="h-64 overflow-y-auto p-4 space-y-3"
                        style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                    No messages yet. Start a conversation!
                                </p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className="max-w-[80%] rounded-2xl px-4 py-2.5"
                                        style={{
                                            background: msg.sender === "customer"
                                                ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                                                : "rgba(255,255,255,0.06)",
                                            borderBottomRightRadius: msg.sender === "customer" ? "6px" : "16px",
                                            borderBottomLeftRadius: msg.sender === "admin" ? "6px" : "16px",
                                        }}
                                    >
                                        <p className="text-sm" style={{ color: msg.sender === "customer" ? "#fff" : "var(--color-text)" }}>
                                            {msg.message}
                                        </p>
                                        <p
                                            className="text-[10px] mt-1"
                                            style={{ color: msg.sender === "customer" ? "rgba(255,255,255,0.6)" : "var(--color-text-muted)" }}
                                        >
                                            {formatTime(msg.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 flex gap-2 relative z-20" style={{ borderTop: "1px solid var(--color-border)" }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/30 relative z-50"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-text)",
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim() || sending}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40 relative z-50"
                            style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
                        >
                            {sending ? (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
