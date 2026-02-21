"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    customer_name: string;
    customer_email: string;
    description: string;
    gross_amount: number;
    down_payment_amount: number;
    down_payment_status: string;
    final_payment_amount: number;
    final_payment_status: string;
    evidence_links: Array<{ url: string; publicId: string; uploadedAt: string }>;
    uuid_token: string;
    chat_enabled: boolean;
    created_at: string;
    updated_at: string;
    pricing_details?: any;
}

interface ChatMsg {
    id: string;
    sender: "customer" | "admin";
    message: string;
    created_at: string;
}

interface PricingItem { id: string; service: string; label: string; price_usd: number; }
interface PortfolioItem { id: string; title: string; description: string; service_type: string; tags: string[]; image_url: string; is_published: boolean; }

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    const [adminView, setAdminView] = useState<"orders" | "pricing" | "portfolio" | "messages">("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);
    const [tab, setTab] = useState<"details" | "chat" | "evidence">("details");

    // Pricing edit
    const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
    const [pricingEditing, setPricingEditing] = useState<string | null>(null);
    const [pricingEditVal, setPricingEditVal] = useState(0);

    // Portfolio edit
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
    const [portfolioForm, setPortfolioForm] = useState<Partial<PortfolioItem>>({});
    const [showPortfolioForm, setShowPortfolioForm] = useState(false);

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatSending, setChatSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Evidence upload
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Inline edit states
    const [editProgress, setEditProgress] = useState(0);
    const [editStatus, setEditStatus] = useState("");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
        setOrders(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const storedAuth = localStorage.getItem("admin_auth");
        if (storedAuth === "true") setAuthenticated(true);
    }, []);

    useEffect(() => {
        if (authenticated) {
            fetchOrders();
            localStorage.setItem("admin_auth", "true");

            // Realtime subscription
            const channel = supabase
                .channel('admin-orders')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'orders' },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            setOrders(prev => [payload.new as Order, ...prev]);
                        } else if (payload.eventType === 'UPDATE') {
                            setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as Order : o));
                            if (selectedOrder?.id === payload.new.id) {
                                // Update selected order smoothly
                                setSelectedOrder(prev => prev ? { ...prev, ...payload.new } : null);
                            }
                        } else if (payload.eventType === 'DELETE') {
                            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
                            if (selectedOrder?.id === payload.old.id) setSelectedOrder(null);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [authenticated, fetchOrders, selectedOrder]);

    const handleLogout = () => {
        setAuthenticated(false);
        localStorage.removeItem("admin_auth");
    };

    const handleLogin = () => {
        if (password === "naufal-admin-2026") {
            setAuthenticated(true);
            setAuthError("");
        } else {
            setAuthError("Invalid password");
        }
    };

    const selectOrder = (order: Order) => {
        setSelectedOrder(order);
        setEditProgress(order.progress || 0);
        setEditStatus(order.status || "pending");
        setTab("details");
        setChatMessages([]);
    };

    // --- Order Updates ---
    const updateOrder = async (field: string, value: unknown) => {
        if (!selectedOrder) return;

        // Use the secure API
        try {
            const res = await fetch("/api/admin/orders/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedOrder.id,
                    updates: { [field]: value },
                    password: "naufal-admin-2026"
                })
            });
            const data = await res.json();

            if (data.success && data.order) {
                // Update local state
                setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
                setSelectedOrder(data.order);
            } else {
                alert("Update failed: " + (data.error || "Unknown error"));
            }
        } catch (e) {
            console.error(e);
            alert("Update failed");
        }
    };

    const handleProgressSave = () => updateOrder("progress", editProgress);
    const handleStatusSave = () => updateOrder("status", editStatus);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this order permanently?")) return;
        await supabase.from("orders").delete().eq("id", id);
        if (selectedOrder?.id === id) setSelectedOrder(null);
        fetchOrders();
    };

    // --- Chat ---
    const fetchChat = useCallback(async () => {
        try {
            const target = adminView === "messages" ? activeChatOrder : selectedOrder;
            if (!target) return;
            const res = await fetch(`/api/chat/${target.id}`);
            if (!res.ok) return;
            const data = await res.json();
            if (data.messages) setChatMessages(data.messages);
        } catch (e) {
            console.error(e);
        }
    }, [selectedOrder, activeChatOrder, adminView]);

    useEffect(() => {
        if ((tab === "chat" && selectedOrder && adminView === "orders") || (adminView === "messages" && activeChatOrder)) {
            fetchChat();
            const iv = setInterval(fetchChat, 5000);
            return () => clearInterval(iv);
        }
    }, [tab, selectedOrder, activeChatOrder, adminView, fetchChat]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const sendAdminMessage = async () => {
        const target = adminView === "messages" ? activeChatOrder : selectedOrder;
        if (!chatInput.trim() || !target || chatSending) return;
        setChatSending(true);
        await fetch(`/api/chat/${target.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: chatInput.trim(), sender: "admin", uuid_token: target.uuid_token }),
        });
        setChatInput("");
        fetchChat();
        setChatSending(false);
    };

    // --- Evidence Upload ---
    const handleEvidenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const target = adminView === "messages" ? activeChatOrder : selectedOrder;
        if (!file || !target) return;
        setUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("order_id", target.id);
        const res = await fetch("/api/admin/evidence", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success) {
            // Refresh order
            const { data: updated } = await supabase.from("orders").select("*").eq("id", target.id).single();
            if (updated) {
                if (adminView === "messages") setActiveChatOrder(updated);
                else setSelectedOrder(updated);
                fetchOrders();
            }
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getStatusColor = (status: string) => {
        const map: Record<string, string> = { pending: "#EAB308", processing: "#3B82F6", done: "#22C55E", cancelled: "#EF4444", paid: "#22C55E", unpaid: "#EF4444" };
        return map[status] || "#a3a3a3";
    };

    const formatCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

    // --- Login ---
    if (!authenticated) {
        return (
            <div
                className="flex items-center justify-center min-h-screen relative z-[100] overflow-hidden"
                style={{
                    background: "radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(236,72,153,0.1), transparent 40%), #050505"
                }}
            >
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="agency-card p-10 w-full max-w-sm relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: "var(--color-text)" }}>Admin Access</h1>
                    <p className="text-sm text-center mb-8" style={{ color: "var(--color-text-muted)" }}>Secure portfolio workspace</p>

                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            className="w-full px-4 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all relative z-30 placeholder:opacity-50"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-text)" }}
                        />
                        {authError && <p className="text-xs text-center font-medium animate-pulse" style={{ color: "#EF4444" }}>{authError}</p>}
                        <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold text-white relative z-30 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>
                            Authenticate →
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- Dashboard ---
    return (
        <div style={{ background: "#050505", minHeight: "100vh" }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Admin Dashboard</h1>
                        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                            {orders.length} orders • Last updated {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchOrders} className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                            ↻ Refresh
                        </button>
                        <a href="/" className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                            ← Home
                        </a>
                        <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Top-level View Tabs */}
                <div className="flex gap-2 mb-6">
                    {(["orders", "messages", "pricing", "portfolio"] as const).map((v) => (
                        <button key={v} onClick={() => {
                            setAdminView(v);
                            if (v === "pricing") { supabase.from("pricing_config").select("*").order("service").then(({ data }) => setPricingItems(data || [])); }
                            if (v === "portfolio") { supabase.from("portfolio_items").select("*").order("created_at", { ascending: false }).then(({ data }) => setPortfolioItems(data || [])); }
                        }}
                            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: adminView === v ? "rgba(99,102,241,0.12)" : "transparent", color: adminView === v ? "#fff" : "var(--color-text-muted)", border: adminView === v ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent" }}>
                            {v === "orders" ? "📦 Orders" : v === "messages" ? "💬 Messages" : v === "pricing" ? "💰 Pricing" : "🖼️ Portfolio"}
                        </button>
                    ))}
                </div>

                {/* MESSAGES VIEW */}
                {adminView === "messages" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                        {/* Sidebar: Chat List */}
                        <div className="lg:col-span-4 flex flex-col h-full agency-card !p-0 overflow-hidden">
                            <div className="px-4 py-3 sticky top-0 z-10" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Active Chats</p>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                {orders.filter(o => o.chat_enabled).length === 0 ? (
                                    <div className="py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No active chats</div>
                                ) : (
                                    orders.filter(o => o.chat_enabled).map((o) => (
                                        <button
                                            key={o.id}
                                            onClick={() => { setActiveChatOrder(o); setChatMessages([]); }}
                                            className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all hover:bg-white/[0.03]"
                                            style={{
                                                borderBottom: "1px solid var(--color-border)",
                                                background: activeChatOrder?.id === o.id ? "rgba(59,130,246,0.06)" : "transparent",
                                                borderLeft: activeChatOrder?.id === o.id ? "2px solid #3B82F6" : "2px solid transparent",
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff", fontSize: "14px", fontWeight: "bold" }}>
                                                {o.customer_name?.charAt(0) || "C"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-bold truncate" style={{ color: "var(--color-text)" }}>{o.customer_name || "Customer"}</span>
                                                    <span className="text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>#{o.order_number}</span>
                                                </div>
                                                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
                                                    {o.service_type}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Main: Chat Window */}
                        <div className="lg:col-span-8 h-full flex flex-col agency-card !p-0 overflow-hidden relative">
                            {!activeChatOrder ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Select a chat to start messaging</p>
                                </div>
                            ) : (
                                <>
                                    {/* Chat Header */}
                                    <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: "var(--color-border)", background: "rgba(255,255,255,0.02)" }}>
                                        <div>
                                            <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{activeChatOrder.customer_name}</h3>
                                            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Order #{activeChatOrder.order_number} • {activeChatOrder.service_type}</p>
                                        </div>
                                        <button onClick={() => { setSelectedOrder(activeChatOrder); setAdminView("orders"); selectOrder(activeChatOrder); }} className="text-xs underline" style={{ color: "#3B82F6" }}>
                                            View Order Details
                                        </button>
                                    </div>

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "rgba(0,0,0,0.2)" }}>
                                        {chatMessages.length === 0 ? (
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No messages yet</p>
                                            </div>
                                        ) : chatMessages.map((m) => (
                                            <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                                                <div className="max-w-[75%] rounded-2xl px-4 py-2.5" style={{
                                                    background: m.sender === "admin" ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "rgba(255,255,255,0.06)",
                                                    borderBottomRightRadius: m.sender === "admin" ? "6px" : "16px",
                                                    borderBottomLeftRadius: m.sender === "customer" ? "6px" : "16px",
                                                }}>
                                                    <p className="text-xs font-semibold mb-0.5" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.7)" : "var(--color-primary)" }}>
                                                        {m.sender === "admin" ? "You" : activeChatOrder.customer_name || "Customer"}
                                                    </p>
                                                    <p className="text-sm" style={{ color: m.sender === "admin" ? "#fff" : "var(--color-text)" }}>{m.message}</p>
                                                    <p className="text-[10px] mt-1" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.5)" : "var(--color-text-muted)" }}>
                                                        {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendAdminMessage())}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                                        />
                                        <button
                                            onClick={sendAdminMessage}
                                            disabled={!chatInput.trim() || chatSending}
                                            className="px-4 py-2.5 rounded-xl text-white disabled:opacity-40"
                                            style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* PRICING VIEW */}
                {adminView === "pricing" && (
                    <div className="space-y-3">
                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Edit pricing items (saved to Supabase):</p>
                        <div className="grid gap-2">
                            {pricingItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border)" }}>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{item.label}</p>
                                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.service}</p>
                                    </div>
                                    {pricingEditing === item.id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>$</span>
                                            <input type="number" value={pricingEditVal} onChange={(e) => setPricingEditVal(Number(e.target.value))} className="w-20 px-2 py-1 rounded-lg text-sm" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                                            <button onClick={async () => { await supabase.from("pricing_config").update({ price_usd: pricingEditVal }).eq("id", item.id); setPricingEditing(null); const { data } = await supabase.from("pricing_config").select("*").order("service"); setPricingItems(data || []); }} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}>Save</button>
                                            <button onClick={() => setPricingEditing(null)} className="px-3 py-1 rounded-lg text-xs" style={{ color: "var(--color-text-muted)" }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => { setPricingEditing(item.id); setPricingEditVal(item.price_usd); }} className="px-3 py-1 rounded-lg text-sm font-bold" style={{ color: "#6366F1" }}>
                                            ${item.price_usd}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PORTFOLIO VIEW */}
                {adminView === "portfolio" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Manage Portfolio</p>
                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Items here will be displayed on the Public Dashboard and your main Portfolio page.</p>
                            </div>
                            <button onClick={() => { setPortfolioForm({}); setShowPortfolioForm(true); }} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>+ Add Item</button>
                        </div>
                        {showPortfolioForm && (
                            <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border)" }}>
                                <input type="text" placeholder="Title" value={portfolioForm.title || ""} onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                                <input type="text" placeholder="Description" value={portfolioForm.description || ""} onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                                <select value={portfolioForm.service_type || ""} onChange={(e) => setPortfolioForm({ ...portfolioForm, service_type: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
                                    <option value="">Select Service Type</option>
                                    <option value="Graphic Design">Graphic Design</option>
                                    <option value="Illustration">Illustration</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Video">Video</option>
                                    <option value="Web Design">Web Design</option>
                                    <option value="App Design">App Design</option>
                                </select>
                                <input type="text" placeholder="Image URL" value={portfolioForm.image_url || ""} onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                                <div className="flex gap-2">
                                    <button onClick={async () => {
                                        if (!portfolioForm.title || !portfolioForm.service_type) return;
                                        await fetch("/api/admin/portfolio/update", {
                                            method: "POST",
                                            body: JSON.stringify({ action: "upsert", item: portfolioForm, password: "naufal-admin-2026" })
                                        });
                                        setShowPortfolioForm(false);
                                        const { data } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false });
                                        setPortfolioItems(data || []);
                                    }} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>
                                        {portfolioForm.id ? "Update" : "Create"}
                                    </button>
                                    <button onClick={() => setShowPortfolioForm(false)} className="px-4 py-2 rounded-lg text-xs" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>Cancel</button>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {portfolioItems.map((item) => (
                                <div key={item.id} className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border)" }}>
                                    {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />}
                                    <div className="p-3">
                                        <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{item.title}</p>
                                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.service_type}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => { setPortfolioForm(item); setShowPortfolioForm(true); }} className="text-xs" style={{ color: "#6366F1" }}>Edit</button>
                                            <button onClick={async () => {
                                                if (confirm("Delete?")) {
                                                    await fetch("/api/admin/portfolio/update", {
                                                        method: "POST",
                                                        body: JSON.stringify({ action: "delete", id: item.id, password: "naufal-admin-2026" })
                                                    });
                                                    const { data } = await supabase.from("portfolio_items").select("*").order("created_at", { ascending: false });
                                                    setPortfolioItems(data || []);
                                                }
                                            }} className="text-xs" style={{ color: "#EF4444" }}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {adminView === "orders" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Order List (left) */}
                        <div className="lg:col-span-5 xl:col-span-4">
                            <div className="agency-card !p-0 overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
                                <div className="px-4 py-3 sticky top-0 z-10" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Orders</p>
                                </div>
                                {loading ? (
                                    <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                                ) : orders.length === 0 ? (
                                    <div className="py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No orders yet</div>
                                ) : (
                                    orders.map((o) => (
                                        <button
                                            key={o.id}
                                            onClick={() => selectOrder(o)}
                                            className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-all hover:bg-white/[0.03]"
                                            style={{
                                                borderBottom: "1px solid var(--color-border)",
                                                background: selectedOrder?.id === o.id ? "rgba(59,130,246,0.06)" : "transparent",
                                                borderLeft: selectedOrder?.id === o.id ? "2px solid #3B82F6" : "2px solid transparent",
                                            }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold font-mono" style={{ color: "var(--color-text)" }}>#{o.order_number}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase" style={{ background: `${getStatusColor(o.status)}15`, color: getStatusColor(o.status) }}>{o.status}</span>
                                                </div>
                                                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
                                                    {o.customer_name || "No name"} • {o.service_type}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>{o.progress}%</p>
                                                <div className="w-12 h-1 rounded-full mt-1" style={{ background: "var(--color-border)" }}>
                                                    <div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: o.progress === 100 ? "#22C55E" : "#3B82F6" }} />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Detail Panel (right) */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            {!selectedOrder ? (
                                <div className="agency-card flex items-center justify-center py-32">
                                    <div className="text-center">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3" style={{ color: "var(--color-text-muted)" }}>
                                            <rect x="2" y="3" width="20" height="18" rx="2" /><path d="M8 7h8M8 11h6M8 15h4" />
                                        </svg>
                                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Select an order to manage</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Order header card */}
                                    <div className="agency-card">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Order #{selectedOrder.order_number}</h2>
                                                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                                    {selectedOrder.customer_name} • {selectedOrder.customer_email || "No email"} • {new Date(selectedOrder.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button onClick={() => handleDelete(selectedOrder.id)} className="p-2 rounded-lg transition-all hover:bg-red-500/10" style={{ color: "#EF4444" }} title="Delete order">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>

                                        {selectedOrder.description && (
                                            <p className="text-xs mt-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                                                {selectedOrder.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
                                        {(["details", "chat", "evidence"] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTab(t)}
                                                className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                                                style={{
                                                    background: tab === t ? "rgba(59,130,246,0.15)" : "transparent",
                                                    color: tab === t ? "#3B82F6" : "var(--color-text-muted)",
                                                }}
                                            >
                                                {t}
                                                {t === "chat" && selectedOrder.chat_enabled && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content */}
                                    {tab === "details" && (
                                        <div className="space-y-4">
                                            {/* Status + Progress */}
                                            <div className="agency-card space-y-5">
                                                {/* Status */}
                                                <div>
                                                    <label className="text-xs font-semibold block mb-2" style={{ color: "var(--color-text-muted)" }}>Status</label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={editStatus}
                                                            onChange={(e) => setEditStatus(e.target.value)}
                                                            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                                                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                                                        >
                                                            {["pending", "processing", "done", "cancelled"].map((s) => (
                                                                <option key={s} value={s} style={{ background: "#1a1a1a" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={handleStatusSave}
                                                            disabled={editStatus === selectedOrder.status}
                                                            className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-30"
                                                            style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Progress */}
                                                <div>
                                                    <label className="text-xs font-semibold flex justify-between mb-2" style={{ color: "var(--color-text-muted)" }}>
                                                        <span>Progress</span>
                                                        <span className="font-mono" style={{ color: "var(--color-primary)" }}>{editProgress}%</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        step="5"
                                                        value={editProgress}
                                                        onChange={(e) => setEditProgress(parseInt(e.target.value))}
                                                        className="w-full accent-blue-500 mb-2"
                                                    />
                                                    <button
                                                        onClick={handleProgressSave}
                                                        disabled={editProgress === selectedOrder.progress}
                                                        className="w-full py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-30"
                                                        style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
                                                    >
                                                        Update Progress
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Payment Overview */}
                                            <div className="agency-card relative">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Payment</h3>
                                                    <button
                                                        onClick={async () => {
                                                            if (!selectedOrder) return;
                                                            const btn = document.getElementById("sync-btn");
                                                            if (btn) btn.innerText = "Syncing...";
                                                            try {
                                                                const res = await fetch("/api/payment/check-status", {
                                                                    method: "POST",
                                                                    body: JSON.stringify({ orderId: selectedOrder.id })
                                                                });
                                                                const data = await res.json();
                                                                if (data.updated) {
                                                                    const { data: updated } = await supabase.from("orders").select("*").eq("id", selectedOrder.id).single();
                                                                    if (updated) { setSelectedOrder(updated); fetchOrders(); }
                                                                    alert("Status updated to: " + data.status);
                                                                } else {
                                                                    alert("No change. Current status: " + (data.status || data.error));
                                                                }
                                                            } catch (e) {
                                                                alert("Error syncing");
                                                            }
                                                            if (btn) btn.innerText = "Sync Status";
                                                        }}
                                                        id="sync-btn"
                                                        className="px-2 py-1 rounded text-[10px] font-medium transition-all hover:bg-white/10"
                                                        style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
                                                    >
                                                        Sync Status
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span style={{ color: "var(--color-text-muted)" }}>Total</span>
                                                        <span className="font-bold" style={{ color: "var(--color-text)" }}>{formatCurrency(selectedOrder.gross_amount)}</span>
                                                    </div>

                                                    {/* Pricing Details */}
                                                    {selectedOrder.pricing_details && typeof selectedOrder.pricing_details === 'object' && (
                                                        <div className="agency-card">
                                                            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Pricing Configuration</h3>
                                                            <div className="text-xs space-y-1 font-mono" style={{ color: "var(--color-text)" }}>
                                                                {Object.entries(selectedOrder.pricing_details || {}).filter(([k]) => k !== "rate" && k !== "currency" && k !== "service").map(([k, v]) => (
                                                                    <div key={k} className="flex justify-between border-b border-white/5 pb-1 mb-1">
                                                                        <span className="opacity-70 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                                        <span className="text-right max-w-[60%] truncate">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span style={{ color: "var(--color-text-muted)" }}>Down Payment (20%)</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold" style={{ color: "var(--color-text)" }}>{formatCurrency(selectedOrder.down_payment_amount)}</span>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase" style={{ background: `${getStatusColor(selectedOrder.down_payment_status)}15`, color: getStatusColor(selectedOrder.down_payment_status) }}>
                                                                {selectedOrder.down_payment_status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span style={{ color: "var(--color-text-muted)" }}>Final (80%)</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold" style={{ color: "var(--color-text)" }}>{formatCurrency(selectedOrder.final_payment_amount)}</span>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase" style={{ background: `${getStatusColor(selectedOrder.final_payment_status)}15`, color: getStatusColor(selectedOrder.final_payment_status) }}>
                                                                {selectedOrder.final_payment_status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Link */}
                                            <div className="agency-card">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Customer Dashboard Link</h3>
                                                <div className="flex gap-2">
                                                    <input
                                                        readOnly
                                                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/order/${selectedOrder.uuid_token}`}
                                                        className="flex-1 px-3 py-2 rounded-lg text-xs font-mono outline-none"
                                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
                                                    />
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/order/${selectedOrder.uuid_token}`)}
                                                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5"
                                                        style={{ color: "#3B82F6", border: "1px solid rgba(59,130,246,0.2)" }}
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {tab === "chat" && (
                                        <div className="agency-card !p-0 overflow-hidden">
                                            {!selectedOrder.chat_enabled ? (
                                                <div className="py-16 text-center">
                                                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Chat is disabled (awaiting down payment)</p>
                                                    <button
                                                        onClick={() => updateOrder("chat_enabled", true)}
                                                        className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                                                        style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}
                                                    >
                                                        Enable Chat Manually
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="h-72 overflow-y-auto p-4 space-y-3" style={{ background: "rgba(0,0,0,0.2)" }}>
                                                        {chatMessages.length === 0 ? (
                                                            <div className="flex items-center justify-center h-full">
                                                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No messages yet</p>
                                                            </div>
                                                        ) : chatMessages.map((m) => (
                                                            <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                                                                <div className="max-w-[75%] rounded-2xl px-4 py-2.5" style={{
                                                                    background: m.sender === "admin" ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "rgba(255,255,255,0.06)",
                                                                    borderBottomRightRadius: m.sender === "admin" ? "6px" : "16px",
                                                                    borderBottomLeftRadius: m.sender === "customer" ? "6px" : "16px",
                                                                }}>
                                                                    <p className="text-xs font-semibold mb-0.5" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.7)" : "var(--color-primary)" }}>
                                                                        {m.sender === "admin" ? "You" : selectedOrder.customer_name || "Customer"}
                                                                    </p>
                                                                    <p className="text-sm" style={{ color: m.sender === "admin" ? "#fff" : "var(--color-text)" }}>{m.message}</p>
                                                                    <p className="text-[10px] mt-1" style={{ color: m.sender === "admin" ? "rgba(255,255,255,0.5)" : "var(--color-text-muted)" }}>
                                                                        {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div ref={chatEndRef} />
                                                    </div>
                                                    <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--color-border)" }}>
                                                        <input
                                                            type="text"
                                                            value={chatInput}
                                                            onChange={(e) => setChatInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendAdminMessage())}
                                                            placeholder="Reply as admin..."
                                                            className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                                                        />
                                                        <button
                                                            onClick={sendAdminMessage}
                                                            disabled={!chatInput.trim() || chatSending}
                                                            className="px-4 py-2.5 rounded-xl text-white disabled:opacity-40"
                                                            style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {tab === "evidence" && (
                                        <div className="agency-card space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                                    Evidence ({selectedOrder.evidence_links?.length || 0})
                                                </h3>
                                                <label className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:brightness-110 text-white" style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}>
                                                    {uploading ? "Uploading..." : "+ Upload"}
                                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleEvidenceUpload} disabled={uploading} />
                                                </label>
                                            </div>

                                            {(!selectedOrder.evidence_links || selectedOrder.evidence_links.length === 0) ? (
                                                <div className="py-12 text-center">
                                                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No evidence uploaded yet</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {selectedOrder.evidence_links.map((ev, i) => (
                                                        <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden transition-all hover:scale-[1.02]" style={{ border: "1px solid var(--color-border)" }}>
                                                            <img src={ev.url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white text-xs font-semibold">View Full</span>
                                                            </div>
                                                        </a>
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
            </div>
        </div>
    );
}
