"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { X, Send, Minus, ChevronUp } from 'lucide-react';

const PenguinIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2c-3.31 0-6 2.69-6 6v3.54c-.65.25-1.5.89-1.5 2.46 0 2.22 2.2 2 3.23 2h.27V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-5h.27c1.03 0 3.23.22 3.23-2 0-1.57-.85-2.21-1.5-2.46V8c0-3.31-2.69-6-6-6Z"/>
        <path d="M16 11c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4Z"/>
        <circle cx="10" cy="10" r="1" fill="currentColor"/>
        <circle cx="14" cy="10" r="1" fill="currentColor"/>
        <path d="m11 12 1 1  1-1"/>
    </svg>
);

export function NasaiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleQuickAction = (text: string) => {
        // Mocking a form event for useChat's handleSubmit
        const e = new Event('submit', { cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>;
        handleSubmit(e, { data: { message: text }}); // In basic setup, useChat doesn't let us directly set text and submit easily via API, wait, we can append instead!
    };


    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#111111] border border-white/10 shadow-2xl hover:border-emerald-500/50 hover:bg-[#1a1a1a] transition-all duration-300 group flex items-center justify-center pointer-events-auto"
            >
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <PenguinIcon className="w-7 h-7 text-white group-hover:text-emerald-400" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#111] shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <PenguinIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white/90">NASAI</h3>
                        <p className="text-[10px] text-emerald-500/80 font-mono tracking-widest uppercase">Web Instructor</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="text-center py-6 px-4">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <PenguinIcon className="w-8 h-8 text-white/40" />
                        </div>
                        <p className="text-white/80 text-sm font-medium mb-1">Hi, I'm NASAI!</p>
                        <p className="text-white/50 text-xs mb-6">Naufal's AI assistant. How can I help you today?</p>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                            {["See Pricing", "How to Order?", "View Portfolio"].map((q) => (
                                <button 
                                    key={q}
                                    onClick={() => handleInputChange({ target: { value: q } } as any)}
                                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message: Message) => (
                    <div 
                        key={message.id} 
                        className={`flex flex-col space-y-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                            message.role === 'user' 
                            ? 'bg-emerald-600 border border-emerald-500/50 text-white rounded-br-none' 
                            : 'bg-[#1a1a1a] border border-white/10 text-white/80 rounded-bl-none prose prose-invert prose-sm prose-p:leading-relaxed prose-pre:bg-black/50 overflow-hidden'
                        }`}>
                            {message.role === 'user' ? (
                                message.content
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} />
                            )}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-start">
                        <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-[#1a1a1a] border border-white/10">
                           <div className="flex space-x-1.5 items-center h-4">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#0f0f0f] shrink-0">
                <div className="relative flex items-center">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask NASAI..."
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/30"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1.5 p-1.5 rounded-full bg-emerald-600 text-white disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono">NASAI Web Instructor</p>
                </div>
            </form>
        </div>
    );
}

// Very basic markdown parsing for bold text and newlines
function formatMessageContent(content: string) {
    if (!content) return "";
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
}
