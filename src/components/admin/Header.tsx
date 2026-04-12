"use client";
import React from "react";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";

interface HeaderProps {
    title: string;
    entriesCount: number;
}

export function AdminHeader({ title, entriesCount }: HeaderProps) {
    return (
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-8 flex-1">
                <h1 className="text-sm font-bold text-white tracking-widest uppercase truncate min-w-0">
                    {title}
                </h1>
                
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative max-w-md w-full">
                    <Search className="absolute left-3 w-3.5 h-3.5 text-white/20" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/10 placeholder:text-white/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 text-white/30">
                    <button className="hover:text-white transition-colors relative">
                        <MessageSquare className="w-4.5 h-4.5" />
                    </button>
                    <button className="hover:text-white transition-colors relative">
                        <Bell className="w-4.5 h-4.5" />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </button>
                </div>

                <div className="h-8 w-px bg-white/5"></div>

                <button className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-white/90">Alex R.</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Owner</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                         {/* Nickname initial as fallback */}
                         <span className="text-[10px] text-white/40">AR</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/20 group-hover:text-white/40" />
                </button>
            </div>
        </header>
    );
}
