"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";
import { OrderDetailPanel } from "@/components/admin/OrderDetailPanel";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import Image from "next/image";
import {
    LayoutDashboard, ShoppingBag, Calendar, Users,
    CreditCard, Megaphone, BarChart3, Settings,
    TrendingUp, Clock, CheckCircle2, AlertCircle,
    RefreshCw, Copy, Trash2, Check, Save,
    Activity, Eye
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
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
interface PricingItem { id: string; service: string; label: string; price_usd: number; }
interface PortfolioItem { id: string; title: string; description: string; service_type: string; tags: string[]; image_url: string; is_published: boolean; }

const fmt = (n: number) => `Rp ${(n || 0).toLocaleString("id-ID")}`;
const statusBadge = (s: string) => {
    const map: Record<string, string> = {
        done: "bg-emerald-500/10 text-emerald-500 border-emerald-500/15",
        processing: "bg-blue-500/10 text-blue-400 border-blue-500/15",
        pending: "bg-amber-500/10 text-amber-400 border-amber-500/15",
        cancelled: "bg-red-500/10 text-red-400 border-red-500/15",
        paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/15",
        unpaid: "bg-red-500/10 text-red-400 border-red-500/15",
    };
    return map[s] || "bg-white/5 text-white/40 border-white/5";
};
const statusDot = (s: string) => {
    const map: Record<string, string> = { done: "bg-emerald-500", processing: "bg-blue-500", pending: "bg-amber-500", cancelled: "bg-red-500" };
    return map[s] || "bg-white/20";
};

// ─── Sub-Views ─────────────────────────────────────────────

function DashboardView({ orders }: { orders: Order[] }) {
    const total = orders.reduce((s, o) => s + o.gross_amount, 0);
    const pending = orders.filter(o => o.status === "pending").length;
    const active = orders.filter(o => o.status === "processing").length;
    const done = orders.filter(o => o.status === "done").length;
    const recent = orders.slice(0, 5);

    const stats = [
        { icon: TrendingUp, label: "Total Revenue", value: fmt(total), color: "text-emerald-400" },
        { icon: ShoppingBag, label: "Total Orders", value: orders.length, color: "text-blue-400" },
        { icon: Clock, label: "Pending", value: pending, color: "text-amber-400" },
        { icon: CheckCircle2, label: "Completed", value: done, color: "text-emerald-400" },
    ];

    return (
        <div className="p-8 space-y-8 max-w-[1200px] mx-auto">
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Studio Overview</h2>
                <p className="text-2xl font-black text-white">Welcome back, Naufal 👋</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className="p-5 rounded-2xl bg-[#0c0c0c] border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{s.label}</p>
                                <Icon className={`w-4 h-4 ${s.color}`} />
                            </div>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 rounded-2xl bg-[#0c0c0c] border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Recent Activity</p>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recent.length === 0 ? (
                            <p className="py-8 text-center text-xs text-white/20">No orders yet.</p>
                        ) : recent.map(o => (
                            <div key={o.id} className="flex items-center gap-4 px-6 py-3">
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(o.status)}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white/80 truncate">{o.customer_name}</p>
                                    <p className="text-[10px] text-white/30">{o.service_type}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-mono text-white/60">{fmt(o.gross_amount)}</p>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-widest ${statusBadge(o.status)}`}>{o.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status distribution */}
                <div className="rounded-2xl bg-[#0c0c0c] border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50">Order Status</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { label: "Pending", value: pending, total: orders.length, color: "bg-amber-500" },
                            { label: "Active", value: active, total: orders.length, color: "bg-blue-500" },
                            { label: "Completed", value: done, total: orders.length, color: "bg-emerald-500" },
                        ].map((s, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-white/40 uppercase tracking-wider">{s.label}</span>
                                    <span className="text-white/60 font-mono">{s.value}</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <div className={`h-full rounded-full ${s.color}`} style={{ width: s.total > 0 ? `${(s.value / s.total) * 100}%` : "0%" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrdersView({ orders, onOrderClick, selectedOrderId, loading, onRefresh }: {
    orders: Order[]; onOrderClick: (o: Order) => void; selectedOrderId?: string; loading: boolean; onRefresh: () => void;
}) {
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30">Order Registry</p>
                    <p className="text-xl font-black text-white mt-0.5">Client Orders</p>
                </div>
                <button onClick={onRefresh} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                    <RefreshCw className="w-3 h-3" /> Sync
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            {["Order ID", "Client", "Service", "Date", "Status", "Total"].map(h => (
                                <th key={h} className="p-4 text-[9px] font-bold uppercase tracking-widest text-white/25">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {loading ? (
                            <tr><td colSpan={6} className="py-16 text-center text-xs text-white/20 animate-pulse">Syncing orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={6} className="py-16 text-center text-xs text-white/20 italic">No orders yet.</td></tr>
                        ) : orders.map(o => (
                            <tr key={o.id} onClick={() => onOrderClick(o)} className={`group hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedOrderId === o.id ? "bg-blue-500/5" : ""}`}>
                                <td className="p-4 text-xs font-mono text-white/30 group-hover:text-white/60">#CO-{o.order_number}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-[9px] font-bold text-white/40">{o.customer_name?.charAt(0)}</div>
                                        <span className="text-xs font-semibold text-white/80">{o.customer_name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-white/60">{o.service_type}</td>
                                <td className="p-4 text-xs text-white/30">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusBadge(o.status)}`}>
                                        <span className={`w-1 h-1 rounded-full ${statusDot(o.status)}`} />{o.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6">
                                    <span className="text-sm font-black text-white">{fmt(o.gross_amount)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AppointmentsView() {
    const upcoming = [
        { id: 1, client: "Rizal K.", service: "Cinematic Portrait Session", date: "Apr 15, 2026", time: "10:00 AM", status: "confirmed" },
        { id: 2, client: "Sarah M.", service: "Studio Rental (4h)", date: "Apr 17, 2026", time: "2:00 PM", status: "pending" },
        { id: 3, client: "Budi A.", service: "Graduation Photography", date: "Apr 20, 2026", time: "9:00 AM", status: "confirmed" },
    ];
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Schedule</p>
                <p className="text-xl font-black text-white mt-0.5">Appointments</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30">Upcoming Sessions</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {upcoming.map((a) => (
                        <div key={a.id} className="flex items-center gap-5 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex flex-col items-center justify-center shrink-0">
                                <span className="text-[9px] text-white/30 uppercase">{a.date.split(",")[0].split(" ")[0]}</span>
                                <span className="text-base font-black text-white/80 leading-none">{a.date.split(" ")[1].replace(",", "")}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white/80">{a.client}</p>
                                <p className="text-xs text-white/30 mt-0.5">{a.service} · {a.time}</p>
                            </div>
                            <span className={`text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest ${statusBadge(a.status === "confirmed" ? "done" : "pending")}`}>{a.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StaffView() {
    const staff = [
        { name: "Naufal Adib Syahrizal", role: "Studio Lead / Owner", projects: 12, status: "active" },
        { name: "Rizal Cooperator", role: "Photography Assistant", projects: 4, status: "active" },
    ];
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Team</p>
                <p className="text-xl font-black text-white mt-0.5">Staff Management</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map((s, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white/60">
                                {s.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/90">{s.name}</p>
                                <p className="text-xs text-white/30">{s.role}</p>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <div>
                                <p className="text-white/20 text-[10px] uppercase tracking-wider mb-0.5">Active Projects</p>
                                <p className="text-white/80 font-bold">{s.projects}</p>
                            </div>
                            <span className={`self-end text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest ${statusBadge("done")}`}>{s.status}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] text-center">
                <Users className="w-6 h-6 text-white/20 mx-auto mb-3" />
                <p className="text-xs text-white/30">Add team member functionality coming soon.</p>
            </div>
        </div>
    );
}

function PaymentsView({ orders }: { orders: Order[] }) {
    const paid = orders.filter(o => o.down_payment_status === "paid" || o.final_payment_status === "paid");
    const totalPaid = orders.reduce((s, o) => {
        let v = 0;
        if (o.down_payment_status === "paid") v += o.down_payment_amount || 0;
        if (o.final_payment_status === "paid") v += o.final_payment_amount || 0;
        return s + v;
    }, 0);
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Finance</p>
                <p className="text-xl font-black text-white mt-0.5">Payments Ledger</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Collected", value: fmt(totalPaid), color: "text-emerald-400" },
                    { label: "Orders Paid (DP)", value: orders.filter(o => o.down_payment_status === "paid").length, color: "text-blue-400" },
                    { label: "Fully Settled", value: orders.filter(o => o.final_payment_status === "paid").length, color: "text-white/80" },
                ].map((s, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#0c0c0c] border border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{s.label}</p>
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30">Transaction Log</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {orders.length === 0 ? (
                        <p className="py-12 text-center text-xs text-white/20 italic">No transactions yet.</p>
                    ) : orders.map(o => (
                        <div key={o.id} className="flex items-center gap-4 px-6 py-3.5">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white/70">{o.customer_name} · #{o.order_number}</p>
                                <p className="text-[10px] text-white/30">{o.service_type}</p>
                            </div>
                            <div className="flex items-center gap-4 text-right shrink-0">
                                <div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-wider">Down Payment</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="text-xs font-mono text-white/50">{fmt(o.down_payment_amount)}</span>
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-black uppercase ${statusBadge(o.down_payment_status)}`}>{o.down_payment_status}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-wider">Final</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="text-xs font-mono text-white/50">{fmt(o.final_payment_amount)}</span>
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-black uppercase ${statusBadge(o.final_payment_status)}`}>{o.final_payment_status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MarketingView() {
    const promos = [
        { title: "First Project Free", desc: "100% OFF for selective new clients. Limited availability.", active: true },
        { title: "Bundle Deal", desc: "Order 3+ services and get a 15% group discount.", active: false },
        { title: "Referral Bonus", desc: "Refer a friend and both get Rp 50,000 off your next order.", active: false },
    ];
    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Promotions</p>
                <p className="text-xl font-black text-white mt-0.5">Marketing Control</p>
            </div>
            <div className="space-y-3">
                {promos.map((p, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-2xl border border-white/5 bg-[#0c0c0c]">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.active ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/5 border border-white/8"}`}>
                            <Megaphone className={`w-4 h-4 ${p.active ? "text-emerald-400" : "text-white/20"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white/80">{p.title}</p>
                            <p className="text-xs text-white/30 mt-0.5">{p.desc}</p>
                        </div>
                        <button className={`shrink-0 w-11 h-6 rounded-full border transition-colors relative ${p.active ? "bg-emerald-500 border-emerald-400" : "bg-white/5 border-white/10"}`}>
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${p.active ? "left-5" : "left-0.5"}`} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-[#0c0c0c]">
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Studio Callout Text</p>
                <textarea
                    defaultValue="Naufal Adib Syahrizal — Creative Professional. Portfolio, Photography, Design & Digital Products. Based in Jakarta."
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-white/20 resize-none"
                />
                <button className="mt-3 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/90 transition-colors flex items-center gap-2">
                    <Save className="w-3 h-3" /> Save Bio
                </button>
            </div>
        </div>
    );
}

function ReportsView({ orders }: { orders: Order[] }) {
    const byService = orders.reduce((acc, o) => {
        const key = o.service_type || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalRevenue = orders.reduce((s, o) => s + o.gross_amount, 0);

    return (
        <div className="p-8 max-w-[1200px] mx-auto space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Analytics</p>
                <p className="text-xl font-black text-white mt-0.5">Reports</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-white/5 bg-[#0c0c0c] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2"><BarChart3 className="w-3.5 h-3.5" />Orders by Service</p>
                    </div>
                    <div className="p-6 space-y-3">
                        {Object.entries(byService).length === 0 ? (
                            <p className="text-xs text-white/20 text-center py-4">No data yet.</p>
                        ) : Object.entries(byService).map(([k, v]) => (
                            <div key={k}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/50 truncate">{k}</span>
                                    <span className="text-white/60 font-mono ml-2">{v}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div className="h-full rounded-full bg-white/30" style={{ width: `${(v / orders.length) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-[#0c0c0c] overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2"><Activity className="w-3.5 h-3.5" />Financial Summary</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { label: "Gross Revenue", value: fmt(totalRevenue), color: "text-emerald-400" },
                            { label: "Average Order Value", value: orders.length > 0 ? fmt(Math.round(totalRevenue / orders.length)) : "Rp 0", color: "text-blue-400" },
                            { label: "Completion Rate", value: orders.length > 0 ? `${Math.round((orders.filter(o => o.status === "done").length / orders.length) * 100)}%` : "—", color: "text-white/70" },
                        ].map((s, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-xs text-white/30 uppercase tracking-wider">{s.label}</span>
                                <span className={`text-sm font-black ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsView() {
    const [copied, setCopied] = useState(false);
    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="p-8 max-w-[800px] mx-auto space-y-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30">Configuration</p>
                <p className="text-xl font-black text-white mt-0.5">Settings</p>
            </div>
            <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">Studio Profile</p>
                    {[
                        { label: "Studio Name", value: "Naufal Adib Syahrizal Studio" },
                        { label: "Owner", value: "Naufal Adib Syahrizal" },
                        { label: "WhatsApp", value: "+62 857-8207-4034" },
                        { label: "Location", value: "Jakarta, Indonesia" },
                    ].map((f, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <p className="text-[10px] uppercase tracking-widest text-white/25">{f.label}</p>
                            <input defaultValue={f.value} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-white/20 w-full" />
                        </div>
                    ))}
                    <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/90 transition-colors flex items-center gap-2">
                        <Save className="w-3 h-3" /> Save Profile
                    </button>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">Security</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/25">Admin Password</p>
                        <input type="password" defaultValue="naufal-admin-2026" className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-white/20 w-full" />
                    </div>
                    <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                        Change Password
                    </button>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">API Status</p>
                    {[
                        { name: "OpenRouter (NASAI AI)", env: "OPENROUTER_API_KEY", status: "configured" },
                        { name: "Supabase Database", env: "NEXT_PUBLIC_SUPABASE_URL", status: "configured" },
                        { name: "Midtrans Payments", env: "MIDTRANS_SERVER_KEY", status: "configured" },
                    ].map((api, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                            <div>
                                <p className="text-xs font-semibold text-white/60">{api.name}</p>
                                <p className="text-[10px] font-mono text-white/20">{api.env}</p>
                            </div>
                            <span className={`text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-widest ${statusBadge("done")}`}>{api.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main Admin Page ─────────────────────────────────────────
export default function AdminPage() {
    const [auth, setAuth] = useState(() => {
        if (typeof window !== "undefined") return localStorage.getItem("admin_auth") === "true";
        return false;
    });
    const [pw, setPw] = useState("");
    const [authErr, setAuthErr] = useState("");

    useEffect(() => {
        if (auth) localStorage.setItem("admin_auth", "true");
        else localStorage.removeItem("admin_auth");
    }, [auth]);

    const [view, setView] = useState("dashboard");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(auth);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        setOrders(data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!auth) return;
        fetchOrders();
        const ch = supabase.channel('admin-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (p: RealtimePostgresChangesPayload<Order>) => {
            if (p.eventType === 'INSERT') setOrders(prev => [p.new as Order, ...prev]);
            else if (p.eventType === 'UPDATE') {
                setOrders(prev => prev.map(o => o.id === p.new.id ? p.new as Order : o));
                if (selectedOrder?.id === p.new.id) setSelectedOrder(p.new as Order);
            } else if (p.eventType === 'DELETE') {
                setOrders(prev => prev.filter(o => o.id !== (p.old as Order).id));
                if (selectedOrder?.id === (p.old as Order).id) { setSelectedOrder(null); setIsPanelOpen(false); }
            }
        }).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [auth, fetchOrders, selectedOrder]);

    const login = () => { if (pw === "naufal-admin-2026") { setAuth(true); setAuthErr(""); } else setAuthErr("Invalid password."); };
    const logout = () => { setAuth(false); localStorage.removeItem("admin_auth"); };

    const handleOrderClick = (o: Order) => { setSelectedOrder(o); setIsPanelOpen(true); };
    const updateOrderStatus = async (status: string) => {
        if (!selectedOrder) return;
        await supabase.from("orders").update({ status }).eq("id", selectedOrder.id);
        fetchOrders();
    };

    const viewTitles: Record<string, string> = {
        dashboard: "Dashboard", orders: "Client Orders", appointments: "Appointments",
        staff: "Staff", payments: "Payments", marketing: "Marketing", reports: "Reports", settings: "Settings"
    };

    // ─── LOGIN SCREEN ───
    if (!auth) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[120px]" />
            </div>
            <div className="p-10 w-full max-w-sm relative rounded-3xl border border-white/5 bg-[#0d0d0d]/90 backdrop-blur-3xl shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <span className="text-black font-black text-2xl tracking-tighter">S</span>
                </div>
                <h1 className="text-lg font-bold text-center text-white uppercase tracking-[0.2em] mb-1">Admin Access</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-center mb-8 text-white/20">Studio Command Center</p>
                <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
                    <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full px-5 py-4 rounded-xl text-sm outline-none focus:ring-1 focus:ring-white/20 placeholder:text-white/15 bg-white/[0.02] border border-white/5 text-white" />
                    {authErr && <p className="text-[10px] text-center font-bold uppercase tracking-widest text-red-500/80">{authErr}</p>}
                    <button type="submit" className="w-full py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold text-black bg-white hover:bg-white/90 active:scale-[0.98] transition-all">
                        Authenticate →
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#080808] text-white selection:bg-white selection:text-black overflow-hidden">
            <AdminSidebar activeView={view} onViewChange={setView} onLogout={logout} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminHeader title={viewTitles[view] || view} entriesCount={orders.length} newOrdersCount={orders.filter(o => o.status === "pending").length} />
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
                    {view === "dashboard" && <DashboardView orders={orders} />}
                    {view === "orders" && <OrdersView orders={orders} onOrderClick={handleOrderClick} selectedOrderId={selectedOrder?.id} loading={loading} onRefresh={fetchOrders} />}
                    {view === "appointments" && <AppointmentsView />}
                    {view === "staff" && <StaffView />}
                    {view === "payments" && <PaymentsView orders={orders} />}
                    {view === "marketing" && <MarketingView />}
                    {view === "reports" && <ReportsView orders={orders} />}
                    {view === "settings" && <SettingsView />}
                </main>
            </div>
            <OrderDetailPanel order={selectedOrder} isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onStatusChange={updateOrderStatus} />
        </div>
    );
}
