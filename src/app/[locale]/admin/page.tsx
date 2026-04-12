"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { OrderDetailPanel } from "@/components/admin/OrderDetailPanel";
import { BadgeCheck, MoreHorizontal, ChevronDown, ShoppingBag } from "lucide-react";

// ─── Interfaces ───
interface Order {
    id: string; order_number: number; service_type: string; status: string; progress: number;
    customer_name: string; customer_email: string; description: string;
    gross_amount: number; down_payment_amount: number; down_payment_status: string;
    final_payment_amount: number; final_payment_status: string;
    evidence_links: Array<{ url: string; publicId: string; uploadedAt: string }>;
    result_files: Array<{ name: string; url: string; type: string; size: number; uploadedAt: string }>;
    uuid_token: string; chat_enabled: boolean; created_at: string; updated_at: string;
    pricing_details?: Record<string, unknown>;
    admin_notes?: string;
}

const fmt = (n: number) => `Rp ${(n || 0).toLocaleString("id-ID")}`;

export default function AdminPage() {
    // ─── Auth (Keeping original logic as requested) ───
    const [auth, setAuth] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("admin_auth") === "true";
        }
        return false;
    });
    const [pw, setPw] = useState("");
    const [authErr, setAuthErr] = useState("");

    useEffect(() => {
        if (auth) localStorage.setItem("admin_auth", "true");
        else localStorage.removeItem("admin_auth");
    }, [auth]);

    // ─── Core State ───
    const [view, setView] = useState("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(auth);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // ─── Fetch Orders ───
    const fetchOrders = useCallback(async () => {
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        setOrders(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!auth) return;
        fetchOrders();
        const ch = supabase.channel('admin-orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (p: RealtimePostgresChangesPayload<Order>) => {
            if (p.eventType === 'INSERT') setOrders(prev => [p.new as Order, ...prev]);
            else if (p.eventType === 'UPDATE') {
                setOrders(prev => prev.map(o => o.id === p.new.id ? p.new as Order : o));
                if (selectedOrder?.id === p.new.id) setSelectedOrder(p.new as Order);
            } else if (p.eventType === 'DELETE') {
                setOrders(prev => prev.filter(o => o.id !== p.old.id));
                if (selectedOrder?.id === p.old.id) { setSelectedOrder(null); setIsPanelOpen(false); }
            }
        }).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [auth, fetchOrders, selectedOrder]);

    const login = () => { if (pw === "naufal-admin-2026") { setAuth(true); setAuthErr(""); } else setAuthErr("Invalid password"); };
    const logout = () => { setAuth(false); localStorage.removeItem("admin_auth"); };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setIsPanelOpen(true);
    };

    const updateOrderStatus = async (status: string) => {
        if (!selectedOrder) return;
        const { error } = await supabase.from("orders").update({ status }).eq("id", selectedOrder.id);
        if (error) alert("Failed to update status");
        else fetchOrders();
    };

    if (!auth) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
            <div className="p-10 w-full max-w-sm relative z-20 rounded-3xl border border-white/5 bg-[#0d0d0d]/80 backdrop-blur-3xl shadow-2xl scale-100 hover:scale-[1.01] transition-transform duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <span className="text-black font-black text-2xl tracking-tighter">S</span>
                </div>
                <h1 className="text-xl font-bold mb-1 text-center text-white uppercase tracking-widest">Admin Access</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-center mb-10 text-white/20">Studio Command Center</p>
                <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
                    <input 
                        type="password" 
                        autoComplete="current-password" 
                        value={pw} 
                        onChange={(e) => setPw(e.target.value)} 
                        placeholder="Enter admin password" 
                        className="w-full px-5 py-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/10 bg-white/[0.02] border border-white/5 text-white" 
                    />
                    {authErr && <p className="text-[10px] text-center font-bold uppercase tracking-widest text-red-500/80 animate-pulse">{authErr}</p>}
                    <button type="submit" className="w-full py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold text-black bg-white transition-all hover:bg-white/90 active:scale-[0.98]">Authenticate →</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#080808] text-white selection:bg-white selection:text-black overflow-hidden">
            <AdminSidebar activeView={view} onViewChange={setView} onLogout={logout} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader title="Client Orders" entriesCount={orders.length} />
                
                <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-[1200px] mx-auto space-y-8">
                        {/* Summary Cards (Mockup Style) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Total Revenue", value: fmt(orders.reduce((acc, o) => acc + o.gross_amount, 0)), trend: "+12.5%" },
                                { label: "Active Projects", value: orders.filter(o => o.status === "processing").length, trend: "Stable" },
                                { label: "Completed", value: orders.filter(o => o.status === "done").length, trend: "+4 this week" }
                            ].map((stat, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</p>
                                    <div className="flex items-baseline justify-between">
                                        <p className="text-2xl font-black">{stat.value}</p>
                                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded">{stat.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Orders Table */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Order Registry</h2>
                                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                                    Select Order
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className="p-4 px-6 w-12"><input type="checkbox" className="rounded bg-white/5 border-white/10 accent-white" /></th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Order ID</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Client</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Service / Category</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Date</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/30">Status</th>
                                            <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-white/30 text-right pr-8">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="p-12 text-center text-white/20 text-xs animate-pulse">Syncing with secure server...</td>
                                            </tr>
                                        ) : orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-12 text-center text-white/20 text-xs italic">Registry empty</td>
                                            </tr>
                                        ) : orders.map((o) => (
                                            <tr 
                                                key={o.id} 
                                                onClick={() => handleOrderClick(o)}
                                                className="group hover:bg-white/[0.02] cursor-pointer transition-colors"
                                            >
                                                <td className="p-4 px-6"><input type="checkbox" className="rounded bg-white/5 border-white/10 accent-white" onClick={e => e.stopPropagation()} /></td>
                                                <td className="p-4 text-xs font-mono text-white/40 group-hover:text-white/80">#CO-{o.order_number}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                                                            {o.customer_name?.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-semibold text-white/90">{o.customer_name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-white/80">{o.service_type || "Photography"}</span>
                                                        <span className="text-[9px] text-white/20 uppercase tracking-tight">Studio Session</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs text-white/30">
                                                    {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                                                </td>
                                                <td className="p-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 ${
                                                        o.status === "done" ? "bg-emerald-500/10 text-emerald-500" :
                                                        o.status === "processing" ? "bg-blue-500/10 text-blue-500" :
                                                        "bg-amber-500/10 text-amber-500"
                                                    }`}>
                                                        <span className={`w-1 h-1 rounded-full ${
                                                            o.status === "done" ? "bg-emerald-500" :
                                                            o.status === "processing" ? "bg-blue-500" :
                                                            "bg-amber-500"
                                                        }`} />
                                                        {o.status}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right pr-8">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-black text-white">{fmt(o.gross_amount)}</span>
                                                        <span className="text-[9px] text-emerald-500/60 font-bold uppercase tracking-tighter">Paid Full</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <OrderDetailPanel 
                order={selectedOrder} 
                isOpen={isPanelOpen} 
                onClose={() => setIsPanelOpen(false)} 
                onStatusChange={updateOrderStatus}
            />
        </div>
    );
}
