"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, X } from 'lucide-react';

const PenguinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-3.31 0-6 2.69-6 6v3.54c-.65.25-1.5.89-1.5 2.46 0 2.22 2.2 2 3.23 2h.27V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-5h.27c1.03 0 3.23.22 3.23-2 0-1.57-.85-2.21-1.5-2.46V8c0-3.31-2.69-6-6-6Z" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
        <circle cx="14" cy="10" r="1" fill="currentColor" />
    </svg>
);

function renderMarkdown(text: string) {
    if (!text) return "";
    let r = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    r = r.replace(/\*(.*?)\*/g, '<em>$1</em>');
    r = r.replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[11px]">$1</code>');
    r = r.replace(/^#{1,3}\s(.+)$/gm, '<p class="font-bold text-white/90 mt-1">$1</p>');
    r = r.replace(/^[\*\-]\s(.+)$/gm, '<li class="ml-3 list-disc text-white/70">$1</li>');
    r = r.replace(/\n/g, '<br/>');
    return r;
}

export function NasaiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
        api: '/api/chat',
        onError: (err) => {
            console.error("NASAI error:", err);
            setErrorMsg("NASAI tidak dapat diakses saat ini. Coba lagi sebentar.");
        },
        onResponse: () => {
            setErrorMsg(null);
        },
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const quickSend = (text: string) => {
        setInput(text);
        // Allow React to re-render with the new input before pseudo-submitting
        setTimeout(() => {
            const form = document.getElementById('nasai-form') as HTMLFormElement | null;
            if (form) form.requestSubmit();
        }, 50);
    };

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#111111] border border-white/10 shadow-2xl hover:border-emerald-500/40 hover:bg-[#1a1a1a] transition-all duration-300 group flex items-center justify-center pointer-events-auto"
        >
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <PenguinIcon className="w-7 h-7 text-white group-hover:text-emerald-400 relative" />
        </button>
    );

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] sm:w-[400px] h-[580px] max-h-[80vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0f0f0f] shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/25">
                        <PenguinIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/90">NASAI</p>
                        <p className="text-[9px] text-emerald-500/70 font-mono uppercase tracking-widest">Studio Web Instructor</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="text-center py-6 px-2">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <PenguinIcon className="w-7 h-7 text-white/30" />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Hi, I&apos;m NASAI!</p>
                        <p className="text-white/40 text-xs mb-5">Naufal&apos;s AI Studio assistant. What can I help you with?</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {["Lihat Harga", "Cara Order?", "Layanan Apa Saja?"].map((q) => (
                                <button
                                    key={q}
                                    onClick={() => quickSend(q)}
                                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl max-w-[88%] text-sm leading-relaxed ${
                            m.role === 'user'
                                ? 'bg-emerald-600/80 border border-emerald-500/30 text-white rounded-br-sm'
                                : 'bg-white/[0.06] border border-white/8 text-white/80 rounded-bl-sm'
                        }`}>
                            {m.role === 'user' ? (
                                m.content
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start">
                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/8">
                            <div className="flex gap-1.5 items-center h-3">
                                {['-0.3s', '-0.15s', '0s'].map((d, i) => (
                                    <div key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: d }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                        {errorMsg}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form id="nasai-form" onSubmit={handleSubmit} className="p-3 border-t border-white/8 bg-[#0d0d0d] shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask NASAI anything..."
                        className="flex-1 bg-white/[0.04] border border-white/8 rounded-full py-2.5 px-4 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-white/20"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 rounded-full bg-emerald-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-center text-[9px] text-white/20 uppercase tracking-widest mt-2 font-mono">NASAI Studio Assistant</p>
            </form>
        </div>
    );
}
