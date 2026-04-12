"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, MessageSquare, ChevronDown, X, Check, Clock } from "lucide-react";

interface HeaderProps {
    title: string;
    entriesCount: number;
    newOrdersCount?: number;
}

interface Notification {
    id: string;
    title: string;
    desc: string;
    time: string;
    read: boolean;
    type: "order" | "payment" | "system";
}

interface DM {
    id: string;
    from: string;
    preview: string;
    time: string;
    unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: "1", title: "New Order Received", desc: "Client Rizal placed a new Studio Session order.", time: "5m ago", read: false, type: "order" },
    { id: "2", title: "Payment Confirmed", desc: "Down payment for Order #CO-042 has been verified.", time: "2h ago", read: false, type: "payment" },
    { id: "3", title: "Portfolio Updated", desc: "3 new items published to your portfolio.", time: "Yesterday", read: true, type: "system" },
];

const MOCK_DMS: DM[] = [
    { id: "1", from: "Rizal K.", preview: "Halo, kapan kira-kira project selesai?", time: "10m ago", unread: true },
    { id: "2", from: "Sarah M.", preview: "Thanks for the delivery! Sudah saya cek.", time: "3h ago", unread: false },
];

export function AdminHeader({ title }: HeaderProps) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [msgOpen, setMsgOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [dms] = useState(MOCK_DMS);
    const notifRef = useRef<HTMLDivElement>(null);
    const msgRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;
    const unreadMsgCount = dms.filter(d => d.unread).length;

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
            if (msgRef.current && !msgRef.current.contains(e.target as Node)) setMsgOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    const typeColor = (t: string) => ({ order: "text-blue-400", payment: "text-emerald-400", system: "text-white/40" }[t] || "text-white/40");
    const typeDot = (t: string) => ({ order: "bg-blue-500", payment: "bg-emerald-500", system: "bg-white/20" }[t] || "bg-white/20");

    return (
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0 relative z-40">
            <div className="flex items-center gap-8 flex-1">
                <h1 className="text-sm font-bold text-white tracking-widest uppercase truncate min-w-0">{title}</h1>
                <div className="hidden md:flex items-center relative max-w-md w-full">
                    <Search className="absolute left-3 w-3.5 h-3.5 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-white/10 placeholder:text-white/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Messages */}
                <div className="relative" ref={msgRef}>
                    <button
                        onClick={() => { setMsgOpen(!msgOpen); setNotifOpen(false); }}
                        className="relative p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        <MessageSquare className="w-4.5 h-4.5" />
                        {unreadMsgCount > 0 && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                    </button>
                    {msgOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Messages</p>
                                <button onClick={() => setMsgOpen(false)}><X className="w-3 h-3 text-white/30" /></button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {dms.map(dm => (
                                    <div key={dm.id} className="px-4 py-3 hover:bg-white/[0.02] cursor-pointer flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                                            {dm.from.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <p className={`text-xs font-semibold ${dm.unread ? "text-white" : "text-white/60"}`}>{dm.from}</p>
                                                <p className="text-[9px] text-white/20">{dm.time}</p>
                                            </div>
                                            <p className="text-[11px] text-white/40 truncate mt-0.5">{dm.preview}</p>
                                        </div>
                                        {dm.unread && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2.5 border-t border-white/5 text-center">
                                <button className="text-[10px] text-white/30 hover:text-white uppercase tracking-widest transition-colors">View All in Orders →</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setNotifOpen(!notifOpen); setMsgOpen(false); }}
                        className="relative p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    >
                        <Bell className="w-4.5 h-4.5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] text-[8px] font-black bg-red-500 text-white rounded-full flex items-center justify-center px-0.5">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Notifications</p>
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[9px] text-white/30 hover:text-white uppercase tracking-widest flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Mark all read
                                        </button>
                                    )}
                                    <button onClick={() => setNotifOpen(false)}><X className="w-3 h-3 text-white/30" /></button>
                                </div>
                            </div>
                            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="py-8 text-center text-xs text-white/20">No notifications</p>
                                ) : notifications.map(n => (
                                    <div key={n.id} className={`px-4 py-3 hover:bg-white/[0.02] cursor-pointer flex gap-3 items-start transition-colors ${!n.read ? "bg-white/[0.01]" : ""}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? typeDot(n.type) : "bg-white/10"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline gap-2">
                                                <p className={`text-xs font-semibold truncate ${!n.read ? typeColor(n.type) : "text-white/40"}`}>{n.title}</p>
                                                <p className="text-[9px] text-white/20 shrink-0 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{n.time}</p>
                                            </div>
                                            <p className="text-[11px] text-white/30 mt-0.5 leading-relaxed">{n.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-white/5" />

                {/* Profile */}
                <button className="flex items-center gap-2.5 group">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white/90 tracking-tight">Naufal</p>
                        <p className="text-[9px] text-white/25 uppercase tracking-widest">Studio Owner</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white/50">NAS</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/20 group-hover:text-white/40" />
                </button>
            </div>
        </header>
    );
}
