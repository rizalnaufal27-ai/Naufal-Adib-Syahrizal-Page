"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import PricingCalculator from "@/components/pricing/PricingCalculator";

// ─── Interfaces ───
interface Order {
    id: string; order_number: number; service_type: string; status: string; progress: number;
    customer_name: string; customer_email: string; description: string;
    gross_amount: number; down_payment_amount: number; down_payment_status: string;
    final_payment_amount: number; final_payment_status: string;
    evidence_links: Array<{ url: string; publicId: string; uploadedAt: string }>;
    result_files: Array<{ name: string; url: string; type: string; size: number; uploadedAt: string }>;
    uuid_token: string; chat_enabled: boolean; created_at: string; updated_at: string;
    pricing_details?: any;
}
interface ResultFile { name: string; url: string; type: string; size: number; uploadedAt: string; }
interface ChatMsg { id: string; sender: "customer" | "admin"; message: string; created_at: string; }
interface PricingItem { id: string; service: string; label: string; price_usd: number; }
interface PortfolioItem { id: string; title: string; description: string; service_type: string; tags: string[]; image_url: string; is_published: boolean; }

type AdminView = "orders" | "messages" | "pricing" | "portfolio";

// ─── Icons (inline SVG) ───
const Icons = {
    orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M8 7h8M8 11h6M8 15h4" /></svg>,
    messages: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    pricing: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    portfolio: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    copy: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    refresh: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    upload: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
};

// ─── Colors ───
const statusColor = (s: string) => ({ pending: "#EAB308", processing: "#3B82F6", done: "#22C55E", cancelled: "#EF4444", paid: "#22C55E", unpaid: "#EF4444" }[s] || "#6B7280");
const fmt = (n: number) => `Rp ${(n || 0).toLocaleString("id-ID")}`;

// ═══════════════════════════════════════════
//  CHAT BUBBLE COMPONENT
// ═══════════════════════════════════════════
const ChatBubble = ({ m, name }: { m: ChatMsg; name: string }) => (
    <div className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[75%] rounded-2xl px-4 py-2.5" style={{
            background: m.sender === "admin" ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "rgba(255,255,255,0.06)",
            borderBottomRightRadius: m.sender === "admin" ? "6px" : "16px",
            borderBottomLeftRadius: m.sender === "customer" ? "6px" : "16px",
        }}>
            <p className="text-[10px] font-semibold mb-0.5" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.7)" : "#6366F1" }}>
                {m.sender === "admin" ? "You" : name}
            </p>
            {m.message.startsWith("[FILE]") ? (
                <a href={m.message.split("|").slice(1).join("|")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg mt-0.5 hover:brightness-110 transition-all shadow-sm" style={{ background: m.sender === "admin" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)" }}>
                    <div className="p-1.5 rounded-md" style={{ background: "rgba(255,255,255,0.1)" }}>{Icons.copy}</div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold truncate max-w-[140px]" style={{ color: m.sender === "admin" ? "#fff" : "var(--color-text)" }}>{m.message.slice(6).split("|")[0]}</span>
                        <span className="text-[9px]" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.6)" : "var(--color-text-muted)" }}>Attachment Click to view</span>
                    </div>
                </a>
            ) : (
                <p className="text-sm" style={{ color: m.sender === "admin" ? "#fff" : "#e5e7eb" }}>{m.message}</p>
            )}
            <p className="text-[10px] mt-1" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
                {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
        </div>
    </div>
);

export default function AdminPage() {
    // ─── Auth ───
    const [auth, setAuth] = useState(false);
    const [pw, setPw] = useState("");
    const [authErr, setAuthErr] = useState("");

    // ─── Core State ───
    const [view, setView] = useState<AdminView>("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Order | null>(null);
    const [activeChat, setActiveChat] = useState<Order | null>(null);
    const [tab, setTab] = useState<"details" | "chat" | "evidence" | "results">("details");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // ─── Pricing ───
    const [pricing, setPricing] = useState<PricingItem[]>([]);
    const [editingPrice, setEditingPrice] = useState<string | null>(null);
    const [editPriceVal, setEditPriceVal] = useState(0);
    const [calcResult, setCalcResult] = useState({ usd: 0, label: "" });

    // ─── Portfolio ───
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [pfForm, setPfForm] = useState<Partial<PortfolioItem>>({});
    const [showPfForm, setShowPfForm] = useState(false);

    // ─── Chat ───
    const [msgs, setMsgs] = useState<ChatMsg[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [sending, setSending] = useState(false);
    const chatEnd = useRef<HTMLDivElement>(null);
    const [chatUploading, setChatUploading] = useState(false);
    const chatFileRef = useRef<HTMLInputElement>(null);

    // ─── Evidence & Results ───
    const [uploading, setUploading] = useState(false);
    const [resultUploading, setResultUploading] = useState(false);
    const resultFileRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // ─── Inline Edit ───
    const [editProg, setEditProg] = useState(0);
    const [editStat, setEditStat] = useState("");

    // ─── Fetch ───
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        setOrders(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { if (localStorage.getItem("admin_auth") === "true") setAuth(true); }, []);

    useEffect(() => {
        if (!auth) return;
        fetchOrders();
        localStorage.setItem("admin_auth", "true");
        const ch = supabase.channel('admin-orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (p) => {
            if (p.eventType === 'INSERT') setOrders(prev => [p.new as Order, ...prev]);
            else if (p.eventType === 'UPDATE') {
                setOrders(prev => prev.map(o => o.id === p.new.id ? p.new as Order : o));
                setSelected(prev => prev?.id === p.new.id ? { ...prev, ...p.new } as Order : prev);
            } else if (p.eventType === 'DELETE') {
                setOrders(prev => prev.filter(o => o.id !== p.old.id));
                setSelected(prev => prev?.id === p.old.id ? null : prev);
            }
        }).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [auth, fetchOrders]);

    const login = () => { if (pw === "naufal-admin-2026") { setAuth(true); setAuthErr(""); } else setAuthErr("Invalid password"); };
    const logout = () => { setAuth(false); localStorage.removeItem("admin_auth"); };

    const selectOrder = (o: Order) => { setSelected(o); setEditProg(o.progress || 0); setEditStat(o.status || "pending"); setTab("details"); setMsgs([]); };

    const updateOrder = async (field: string, value: unknown) => {
        if (!selected) return;
        try {
            const res = await fetch("/api/admin/orders/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, updates: { [field]: value }, password: "naufal-admin-2026" }) });
            const data = await res.json();
            if (data.success && data.order) { setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o)); setSelected(data.order); }
            else alert("Update failed: " + (data.error || "Unknown error"));
        } catch { alert("Update failed"); }
    };

    const deleteOrder = async (id: string) => { if (!confirm("Delete this order permanently?")) return; await supabase.from("orders").delete().eq("id", id); if (selected?.id === id) setSelected(null); fetchOrders(); };

    // ─── Chat ───
    const fetchChat = useCallback(async () => {
        const target = view === "messages" ? activeChat : selected;
        if (!target) return;
        try { const res = await fetch(`/api/chat/${target.id}`); if (!res.ok) return; const d = await res.json(); if (d.messages) setMsgs(d.messages); } catch { }
    }, [selected, activeChat, view]);

    useEffect(() => {
        if ((tab === "chat" && selected && view === "orders") || (view === "messages" && activeChat)) {
            fetchChat(); const iv = setInterval(fetchChat, 5000); return () => clearInterval(iv);
        }
    }, [tab, selected, activeChat, view, fetchChat]);

    useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

    const sendMsg = async () => {
        const target = view === "messages" ? activeChat : selected;
        if (!chatInput.trim() || !target || sending) return;
        setSending(true);
        await fetch(`/api/chat/${target.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: chatInput.trim(), sender: "admin", uuid_token: target.uuid_token }) });
        setChatInput(""); fetchChat(); setSending(false);
    };

    const handleChatUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; const target = view === "messages" ? activeChat : selected;
        if (!file || !target || chatUploading) return;
        setChatUploading(true);
        const fd = new FormData(); fd.append("file", file); fd.append("sender", "admin");
        try {
            const res = await fetch(`/api/chat/${target.id}/upload`, { method: "POST", body: fd });
            const data = await res.json();
            if (data.success) fetchChat();
            else alert("Upload failed: " + data.error);
        } catch { alert("Failed to upload file"); }
        setChatUploading(false);
        if (chatFileRef.current) chatFileRef.current.value = "";
    };

    // ─── Evidence Upload ───
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; const target = view === "messages" ? activeChat : selected;
        if (!file || !target) return; setUploading(true);
        const fd = new FormData(); fd.append("file", file); fd.append("order_id", target.id);
        const res = await fetch("/api/admin/evidence", { method: "POST", body: fd }); const data = await res.json();
        if (data.success) { const { data: u } = await supabase.from("orders").select("*").eq("id", target.id).single(); if (u) { if (view === "messages") setActiveChat(u); else setSelected(u); fetchOrders(); } }
        setUploading(false); if (fileRef.current) fileRef.current.value = "";
    };

    // ═══════════════════════════════════════════
    //  LOGIN SCREEN
    // ═══════════════════════════════════════════
    if (!auth) return (
        <div className="flex items-center justify-center min-h-screen relative z-[100] overflow-hidden" style={{ background: "radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(236,72,153,0.1), transparent 40%), #050505" }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="p-10 w-full max-w-sm relative z-20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl" style={{ background: "rgba(10,10,10,0.8)" }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-center text-white">Admin Access</h1>
                <p className="text-sm text-center mb-8 text-white/40">Secure portfolio workspace</p>
                <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-5">
                    <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter admin password" className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20 bg-white/[0.03] border border-white/10 text-white" />
                    {authErr && <p className="text-xs text-center font-medium text-red-400 animate-pulse">{authErr}</p>}
                    <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>Authenticate →</button>
                </form>
            </div>
        </div>
    );

    // ═══════════════════════════════════════════
    //  SIDEBAR NAV ITEMS
    // ═══════════════════════════════════════════
    const navItems: { key: AdminView; label: string; icon: React.ReactNode; count?: number; section?: string }[] = [
        { key: "orders", label: "Orders", icon: Icons.orders, count: orders.length, section: "Management" },
        { key: "pricing", label: "Pricing", icon: Icons.pricing, section: "Management" },
        { key: "portfolio", label: "Portfolio", icon: Icons.portfolio, count: portfolio.length, section: "Management" },
        { key: "messages", label: "Chat Log", icon: Icons.messages, count: orders.filter(o => o.chat_enabled).length, section: "History" },
    ];

    const switchView = (v: AdminView) => {
        setView(v);
        if (v === "pricing") supabase.from("pricing_config").select("*").order("service").then(({ data }) => setPricing(data || []));
        if (v === "portfolio") supabase.from("portfolio_items").select("*").order("created_at", { ascending: false }).then(({ data }) => setPortfolio(data || []));
    };

    // ═══════════════════════════════════════════
    //  STATUS BADGE
    // ═══════════════════════════════════════════
    const Badge = ({ status }: { status: string }) => (
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide" style={{ background: `${statusColor(status)}15`, color: statusColor(status) }}>{status}</span>
    );

    // ═══════════════════════════════════════════
    //  MAIN LAYOUT
    // ═══════════════════════════════════════════
    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "#050505" }}>
            {/* ═══ SIDEBAR ═══ */}
            <aside className={`${sidebarCollapsed ? "w-16" : "w-60"} shrink-0 h-screen flex flex-col border-r border-white/[0.06] transition-all duration-300`} style={{ background: "#0A0A0A" }}>
                {/* Logo */}
                <div className="px-4 py-5 flex items-center gap-3 border-b border-white/[0.06]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-black text-sm">N</span>
                    </div>
                    {!sidebarCollapsed && <span className="text-sm font-bold text-white truncate">Dashboard</span>}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto text-white/30 hover:text-white/60 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={sidebarCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} /></svg>
                    </button>
                </div>

                {/* Search */}
                {!sidebarCollapsed && (
                    <div className="px-3 py-3">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 text-xs">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <span>Search...</span>
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06]">⌘K</span>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                    {navItems.reduce((acc, item, i) => {
                        if (i === 0 || item.section !== navItems[i - 1].section) {
                            if (!sidebarCollapsed) acc.push(
                                <p key={`sec-${item.section}`} className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 pt-4 pb-1">{item.section}</p>
                            );
                        }
                        acc.push(
                            <button key={item.key} onClick={() => switchView(item.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${view === item.key ? "bg-white/[0.08] text-white font-medium" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"}`}
                                title={sidebarCollapsed ? item.label : undefined}>
                                <span className={view === item.key ? "text-blue-400" : "text-white/40"}>{item.icon}</span>
                                {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                                {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-white/40 font-mono">{item.count}</span>
                                )}
                            </button>
                        );
                        return acc;
                    }, [] as React.ReactNode[])}
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-white/[0.06] p-2 space-y-1">
                    <a href="/" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all`}>
                        {Icons.home}{!sidebarCollapsed && <span>Back to Site</span>}
                    </a>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06] transition-all">
                        {Icons.logout}{!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="shrink-0 px-6 py-4 flex items-center justify-between border-b border-white/[0.06]" style={{ background: "#0A0A0A" }}>
                    <div>
                        <h1 className="text-lg font-bold text-white capitalize">{view === "messages" ? "Chat Log History" : view}</h1>
                        <p className="text-[11px] text-white/30 mt-0.5">{orders.length} orders • {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <button onClick={fetchOrders} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/[0.04] border border-white/[0.06] transition-all">
                        {Icons.refresh} Refresh
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* ═══ ORDERS VIEW ═══ */}
                    {view === "orders" && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                            {/* Order List */}
                            <div className="lg:col-span-4 xl:col-span-4 border-r border-white/[0.06] overflow-y-auto">
                                <div className="px-4 py-3 sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/[0.06]">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">All Orders</p>
                                </div>
                                {loading ? (
                                    <div className="py-16 flex justify-center"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="py-16 text-center text-sm text-white/30">No orders yet</div>
                                ) : orders.map((o) => (
                                    <button key={o.id} onClick={() => selectOrder(o)} className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all hover:bg-white/[0.03]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: selected?.id === o.id ? "rgba(59,130,246,0.06)" : "transparent", borderLeft: selected?.id === o.id ? "2px solid #3B82F6" : "2px solid transparent" }}>
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: `${statusColor(o.status)}15`, color: statusColor(o.status) }}>
                                            #{o.order_number}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-white truncate">{o.customer_name || "No name"}</span>
                                                <Badge status={o.status} />
                                            </div>
                                            <p className="text-[11px] text-white/30 truncate mt-0.5">{o.service_type} • {fmt(o.gross_amount)}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] font-mono text-white/30">{o.progress}%</p>
                                            <div className="w-10 h-1 rounded-full mt-1 bg-white/[0.06]"><div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: o.progress === 100 ? "#22C55E" : "#3B82F6" }} /></div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Detail Panel */}
                            <div className="lg:col-span-8 xl:col-span-8 overflow-y-auto">
                                {!selected ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center text-white/20">
                                            <div className="mx-auto mb-3 opacity-40">{Icons.orders}</div>
                                            <p className="text-sm">Select an order to manage</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 space-y-5 max-w-3xl mx-auto">
                                        {/* Order Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-xl font-bold text-white">Order #{selected.order_number}</h2>
                                                    <Badge status={selected.status} />
                                                </div>
                                                <p className="text-xs text-white/30 mt-1">{selected.customer_name} • {selected.customer_email || "No email"} • {new Date(selected.created_at).toLocaleDateString("id-ID")}</p>
                                            </div>
                                            <button onClick={() => deleteOrder(selected.id)} className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all">{Icons.trash}</button>
                                        </div>

                                        {selected.description && (
                                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/40">{selected.description}</div>
                                        )}

                                        {/* Tabs */}
                                        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            {(["details", "chat", "evidence", "results"] as const).map((t) => (
                                                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t ? "bg-blue-500/15 text-blue-400" : "text-white/30 hover:text-white/50"}`}>
                                                    {t}{t === "chat" && selected.chat_enabled && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
                                                    {t === "results" && (selected.result_files?.length || 0) > 0 && <span className="ml-1 text-[9px] px-1 rounded bg-green-500/20 text-green-400">{selected.result_files.length}</span>}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tab: Details */}
                                        {tab === "details" && (
                                            <div className="space-y-4">
                                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 space-y-5">
                                                    {/* Status */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-2">Status</label>
                                                        <div className="flex gap-2">
                                                            <select value={editStat} onChange={(e) => setEditStat(e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/[0.04] border border-white/[0.06] text-white outline-none">
                                                                {["pending", "processing", "done", "cancelled"].map(s => <option key={s} value={s} style={{ background: "#111" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                                            </select>
                                                            <button onClick={() => updateOrder("status", editStat)} disabled={editStat === selected.status} className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-20" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>Save</button>
                                                        </div>
                                                    </div>
                                                    {/* Progress */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex justify-between mb-2"><span>Progress</span><span className="text-blue-400 font-mono">{editProg}%</span></label>
                                                        <input type="range" min="0" max="100" step="5" value={editProg} onChange={(e) => setEditProg(parseInt(e.target.value))} className="w-full accent-blue-500 mb-2" />
                                                        <button onClick={() => updateOrder("progress", editProg)} disabled={editProg === selected.progress} className="w-full py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-20" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>Update Progress</button>
                                                    </div>
                                                </div>

                                                {/* Payment */}
                                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 space-y-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Payment</h3>
                                                        <button onClick={async () => { try { const res = await fetch("/api/payment/check-status", { method: "POST", body: JSON.stringify({ orderId: selected.id }) }); const data = await res.json(); if (data.updated) { const { data: u } = await supabase.from("orders").select("*").eq("id", selected.id).single(); if (u) { setSelected(u); fetchOrders(); } alert("Synced: " + data.status); } else alert("No change: " + (data.status || data.error)); } catch { alert("Error"); } }} className="text-[10px] px-2 py-1 rounded text-white/30 hover:text-white/60 border border-white/[0.06] transition-all">Sync</button>
                                                    </div>
                                                    <div className="flex justify-between text-sm"><span className="text-white/40">Total</span><span className="font-bold text-white">{fmt(selected.gross_amount)}</span></div>
                                                    {selected.pricing_details && typeof selected.pricing_details === 'object' && (
                                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Pricing Config</h4>
                                                            <div className="text-xs space-y-1 font-mono text-white/60">
                                                                {Object.entries(selected.pricing_details || {}).filter(([k]) => k !== "rate" && k !== "currency" && k !== "service").map(([k, v]) => (
                                                                    <div key={k} className="flex justify-between border-b border-white/[0.03] pb-1"><span className="opacity-50 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span><span className="text-right max-w-[60%] truncate">{Array.isArray(v) ? (v as string[]).join(", ") : String(v)}</span></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center text-sm"><span className="text-white/40">DP (20%)</span><div className="flex items-center gap-2"><span className="font-semibold text-white/70">{fmt(selected.down_payment_amount)}</span><Badge status={selected.down_payment_status} /></div></div>
                                                    <div className="flex justify-between items-center text-sm"><span className="text-white/40">Final (80%)</span><div className="flex items-center gap-2"><span className="font-semibold text-white/70">{fmt(selected.final_payment_amount)}</span><Badge status={selected.final_payment_status} /></div></div>
                                                </div>

                                                {/* Customer Link */}
                                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
                                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Customer Dashboard Link</h3>
                                                    <div className="flex gap-2">
                                                        <input readOnly value={`${typeof window !== "undefined" ? window.location.origin : ""}/order/${selected.uuid_token}`} className="flex-1 px-3 py-2 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/[0.06] text-white/40 outline-none" />
                                                        <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/order/${selected.uuid_token}`)} className="px-3 py-2 rounded-lg text-xs font-semibold text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 transition-all flex items-center gap-1.5">{Icons.copy} Copy</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tab: Chat */}
                                        {tab === "chat" && (
                                            <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                                                {!selected.chat_enabled ? (
                                                    <div className="py-16 text-center">
                                                        <p className="text-sm text-white/30">Chat disabled (awaiting DP)</p>
                                                        <button onClick={() => updateOrder("chat_enabled", true)} className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}>Enable Chat</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="h-72 overflow-y-auto p-4 space-y-3 bg-black/20">
                                                            {msgs.length === 0 ? <div className="flex items-center justify-center h-full"><p className="text-xs text-white/20">No messages yet</p></div>
                                                                : msgs.map(m => <ChatBubble key={m.id} m={m} name={selected.customer_name || "Customer"} />)}
                                                            <div ref={chatEnd} />
                                                        </div>
                                                        <div className="p-3 flex gap-2 border-t border-white/[0.06] bg-[#0a0a0a] items-center">
                                                            <input type="file" className="hidden" ref={chatFileRef} onChange={handleChatUpload} />
                                                            <button onClick={() => chatFileRef.current?.click()} disabled={chatUploading} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Attach Document">
                                                                {chatUploading ? <div className="animate-spin">{Icons.refresh}</div> : Icons.upload}
                                                            </button>
                                                            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMsg())} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20" />
                                                            <button onClick={sendMsg} disabled={!chatInput.trim() || sending} className="px-4 py-2.5 rounded-xl text-white disabled:opacity-40 transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>{Icons.send}</button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Tab: Evidence */}
                                        {tab === "evidence" && (
                                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Evidence ({selected.evidence_links?.length || 0})</h3>
                                                    <label className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white flex items-center gap-1.5 hover:brightness-110" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>
                                                        {Icons.upload} {uploading ? "Uploading..." : "Upload"}
                                                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                                                    </label>
                                                </div>
                                                {(!selected.evidence_links || selected.evidence_links.length === 0) ? (
                                                    <div className="py-12 text-center text-sm text-white/20">No evidence uploaded yet</div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {selected.evidence_links.map((ev, i) => (
                                                            <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-white/[0.06] hover:border-blue-500/30 transition-all">
                                                                <img src={ev.url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><span className="text-white text-xs font-semibold">View</span></div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Tab: Results */}
                                        {tab === "results" && (
                                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Project Results ({selected.result_files?.length || 0})</h3>
                                                        <p className="text-[10px] text-white/20 mt-0.5">Upload deliverables for client download</p>
                                                    </div>
                                                    <label className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer text-white flex items-center gap-1.5 hover:brightness-110" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}>
                                                        {Icons.upload} {resultUploading ? "Uploading..." : "Upload File"}
                                                        <input ref={resultFileRef} type="file" className="hidden" onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file || !selected) return;
                                                            setResultUploading(true);
                                                            const fd = new FormData(); fd.append("file", file); fd.append("order_id", selected.id);
                                                            const res = await fetch("/api/admin/results", { method: "POST", body: fd });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                const { data: u } = await supabase.from("orders").select("*").eq("id", selected.id).single();
                                                                if (u) { setSelected(u); fetchOrders(); }
                                                            } else { alert("Upload failed: " + (data.error || "Unknown")); }
                                                            setResultUploading(false);
                                                            if (resultFileRef.current) resultFileRef.current.value = "";
                                                        }} disabled={resultUploading} />
                                                    </label>
                                                </div>
                                                {(!selected.result_files || selected.result_files.length === 0) ? (
                                                    <div className="py-12 text-center">
                                                        <div className="text-3xl mb-2 opacity-20">📦</div>
                                                        <p className="text-sm text-white/20">No result files uploaded yet</p>
                                                        <p className="text-[10px] text-white/10 mt-1">Upload deliverables for your client to download</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {(selected.result_files as ResultFile[]).map((f, i) => (
                                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg" style={{ background: "rgba(34,197,94,0.1)" }}>
                                                                    {f.type?.includes("image") ? "🖼️" : f.type?.includes("video") ? "🎬" : f.type?.includes("pdf") ? "📄" : f.type?.includes("zip") || f.type?.includes("rar") ? "📦" : "📎"}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-white truncate">{f.name}</p>
                                                                    <p className="text-[10px] text-white/30">
                                                                        {(f.size / 1024 / 1024).toFixed(2)} MB • {new Date(f.uploadedAt).toLocaleDateString("id-ID")}
                                                                    </p>
                                                                </div>
                                                                <a href={f.url} target="_blank" rel="noopener noreferrer" download className="px-3 py-1.5 rounded-lg text-xs font-semibold text-green-400 border border-green-500/20 hover:bg-green-500/10 transition-all">
                                                                    Download
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══ CHAT LOG VIEW ═══ */}
                    {view === "messages" && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                            {/* Chat List */}
                            <div className="lg:col-span-4 border-r border-white/[0.06] overflow-y-auto">
                                <div className="px-4 py-3 sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/[0.06]">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">All Chat Logs</p>
                                </div>
                                {orders.filter(o => o.chat_enabled).length === 0 ? (
                                    <div className="py-16 text-center text-sm text-white/30">No chat history</div>
                                ) : orders.filter(o => o.chat_enabled).map(o => (
                                    <button key={o.id} onClick={() => { setActiveChat(o); setMsgs([]); }} className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all hover:bg-white/[0.03]" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: activeChat?.id === o.id ? "rgba(59,130,246,0.06)" : "transparent", borderLeft: activeChat?.id === o.id ? "2px solid #3B82F6" : "2px solid transparent" }}>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff" }}>{o.customer_name?.charAt(0) || "C"}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between"><span className="text-sm font-semibold text-white truncate">{o.customer_name || "Customer"}</span><span className="text-[10px] font-mono text-white/20">#{o.order_number}</span></div>
                                            <p className="text-[11px] text-white/30 truncate mt-0.5">{o.service_type} • <Badge status={o.status} /></p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Chat Window */}
                            <div className="lg:col-span-8 h-full flex flex-col overflow-hidden">
                                {!activeChat ? (
                                    <div className="flex-1 flex items-center justify-center"><p className="text-sm text-white/20">Select a chat to view history</p></div>
                                ) : (
                                    <>
                                        <div className="px-5 py-3 border-b border-white/[0.06] bg-[#0a0a0a] flex justify-between items-center shrink-0">
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{activeChat.customer_name || "Customer"}</h3>
                                                <p className="text-[11px] text-white/30">Order #{activeChat.order_number} • {activeChat.service_type}</p>
                                            </div>
                                            <button onClick={() => { selectOrder(activeChat); setView("orders"); }} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View Order →</button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
                                            {msgs.length === 0 ? <div className="flex items-center justify-center h-full"><p className="text-xs text-white/20">No messages yet</p></div>
                                                : msgs.map(m => <ChatBubble key={m.id} m={m} name={activeChat.customer_name || "Customer"} />)}
                                            <div ref={chatEnd} />
                                        </div>
                                        <div className="p-3 flex gap-2 border-t border-white/[0.06] bg-[#0a0a0a] items-center">
                                            <input type="file" className="hidden" ref={chatFileRef} onChange={handleChatUpload} />
                                            <button onClick={() => chatFileRef.current?.click()} disabled={chatUploading} className="p-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Attach Document">
                                                {chatUploading ? <div className="animate-spin">{Icons.refresh}</div> : Icons.upload}
                                            </button>
                                            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMsg())} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20" />
                                            <button onClick={sendMsg} disabled={!chatInput.trim() || sending} className="px-4 py-2.5 rounded-xl text-white disabled:opacity-40 transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>{Icons.send}</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══ PRICING VIEW ═══ */}
                    {view === "pricing" && (
                        <div className="p-6 max-w-5xl mx-auto space-y-8">

                            {/* Calculator Section */}
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 lg:flex gap-8">
                                <div className="lg:w-full">
                                    <h2 className="text-lg font-bold text-white mb-2">Price Estimator</h2>
                                    <p className="text-xs text-white/40 mb-6">Quickly calculate prices for client inquiries using the public calculator.</p>
                                    <div className="bg-black/20 p-4 rounded-xl border border-white/[0.04]">
                                        <PricingCalculator onPriceCalculated={(usd, label) => setCalcResult({ usd, label })} />
                                    </div>
                                    {calcResult.usd > 0 && (
                                        <div className="mt-4 flex gap-2">
                                            <button onClick={() => navigator.clipboard.writeText(`Estimated price for ${calcResult.label}: $${calcResult.usd} (Rp ${(calcResult.usd * 16000).toLocaleString("id-ID")})`)} className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2">
                                                {Icons.copy} Copy Quote Text
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div><p className="text-sm font-semibold text-white">Database Base Rates</p><p className="text-xs text-white/30">Click any price to edit • All prices in USD</p></div>
                            </div>
                            <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr style={{ background: "rgba(99,102,241,0.08)" }}>
                                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-300">Service</th>
                                            <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-300">Package / Tier</th>
                                            <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-300">Price (USD)</th>
                                            <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-300">Calculated (IDR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pricing.map((item, i) => {
                                            const prevService = i > 0 ? pricing[i - 1].service : null;
                                            const isNewGroup = item.service !== prevService;
                                            return (
                                                <tr key={item.id} className="transition-colors hover:bg-white/[0.02]" style={{ borderTop: isNewGroup && i > 0 ? "2px solid rgba(99,102,241,0.15)" : "1px solid rgba(255,255,255,0.03)" }}>
                                                    <td className="px-5 py-3">{isNewGroup ? <span className="text-xs font-bold text-white">{item.service}</span> : <span className="text-xs text-white/20">↳</span>}</td>
                                                    <td className="px-5 py-3 text-sm text-white/70">{item.label}</td>
                                                    <td className="px-5 py-3 text-right">
                                                        {editingPrice === item.id ? (
                                                            <div className="flex items-center justify-end gap-1">
                                                                <span className="text-xs text-white/30">$</span>
                                                                <input type="number" value={editPriceVal} onChange={e => setEditPriceVal(Number(e.target.value))} className="w-16 px-2 py-1 rounded text-sm bg-black/30 border border-white/[0.06] text-white text-right" autoFocus />
                                                                <button onClick={async () => { await supabase.from("pricing_config").update({ price_usd: editPriceVal }).eq("id", item.id); setEditingPrice(null); const { data } = await supabase.from("pricing_config").select("*").order("service"); setPricing(data || []); }} className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/15 text-green-400">✓</button>
                                                                <button onClick={() => setEditingPrice(null)} className="px-2 py-1 rounded text-[10px] text-white/30">✕</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => { setEditingPrice(item.id); setEditPriceVal(item.price_usd); }} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">${item.price_usd}</button>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3 text-right text-xs font-mono text-white/30">Rp {(item.price_usd * 16000).toLocaleString("id-ID")}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Array.from(new Set(pricing.map(p => p.service))).map(svc => {
                                    const items = pricing.filter(p => p.service === svc);
                                    const avgPrice = items.reduce((a, b) => a + b.price_usd, 0) / items.length;
                                    return (
                                        <div key={svc} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{svc}</p>
                                            <p className="text-lg font-bold text-white">${items[0].price_usd}<span className="text-xs text-white/30 ml-1">min</span></p>
                                            <p className="text-[10px] text-white/20">{items.length} tiers • avg ${avgPrice.toFixed(0)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ═══ PORTFOLIO VIEW ═══ */}
                    {view === "portfolio" && (
                        <div className="p-6 max-w-5xl mx-auto space-y-5">
                            <div className="flex justify-between items-center">
                                <div><p className="text-sm font-semibold text-white">Manage Portfolio</p><p className="text-xs text-white/30">Items displayed on Public Dashboard & Portfolio page.</p></div>
                                <button onClick={() => { setPfForm({}); setShowPfForm(true); }} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>+ Add Item</button>
                            </div>
                            {showPfForm && (
                                <div className="p-5 rounded-2xl space-y-3 bg-white/[0.015] border border-white/[0.06]">
                                    <input type="text" placeholder="Title" value={pfForm.title || ""} onChange={e => setPfForm({ ...pfForm, title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm bg-black/30 border border-white/[0.06] text-white placeholder:text-white/20" />
                                    <input type="text" placeholder="Description" value={pfForm.description || ""} onChange={e => setPfForm({ ...pfForm, description: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm bg-black/30 border border-white/[0.06] text-white placeholder:text-white/20" />
                                    <select value={pfForm.service_type || ""} onChange={e => setPfForm({ ...pfForm, service_type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm bg-black/30 border border-white/[0.06] text-white">
                                        <option value="">Select Service Type</option>
                                        {["Graphic Design", "Illustration", "Photography", "Video", "Web Design", "App Design"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <input type="text" placeholder="Image URL" value={pfForm.image_url || ""} onChange={e => setPfForm({ ...pfForm, image_url: e.target.value })} className="w-full px-3 py-2.5 rounded-lg text-sm bg-black/30 border border-white/[0.06] text-white placeholder:text-white/20" />
                                    <div className="flex gap-2">
                                        <button onClick={async () => { if (!pfForm.title || !pfForm.service_type) return; await fetch("/api/admin/portfolio/update", { method: "POST", body: JSON.stringify({ action: "upsert", item: pfForm, password: "naufal-admin-2026" }) }); setShowPfForm(false); const { data } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false }); setPortfolio(data || []); }} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>{pfForm.id ? "Update" : "Create"}</button>
                                        <button onClick={() => setShowPfForm(false)} className="px-4 py-2 rounded-lg text-xs text-white/30 border border-white/[0.06]">Cancel</button>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {portfolio.map(item => (
                                    <div key={item.id} className="rounded-2xl overflow-hidden bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                                        {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />}
                                        <div className="p-4">
                                            <p className="text-sm font-semibold text-white">{item.title}</p>
                                            <p className="text-xs text-white/30 mt-0.5">{item.service_type}</p>
                                            <div className="flex gap-3 mt-3">
                                                <button onClick={() => { setPfForm(item); setShowPfForm(true); }} className="text-xs text-indigo-400 hover:text-indigo-300">Edit</button>
                                                <button onClick={async () => { if (confirm("Delete?")) { await fetch("/api/admin/portfolio/update", { method: "POST", body: JSON.stringify({ action: "delete", id: item.id, password: "naufal-admin-2026" }) }); const { data } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false }); setPortfolio(data || []); } }} className="text-xs text-red-400/60 hover:text-red-400">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
