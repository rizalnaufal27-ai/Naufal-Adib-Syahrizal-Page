"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    created_at: string;
    uuid_token: string;
}

const statusColor = (s: string) => ({
    done: { bg: "rgba(34,197,94,0.1)", color: "#22C55E" },
    processing: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6" },
    pending: { bg: "rgba(234,179,8,0.1)", color: "#EAB308" },
    cancelled: { bg: "rgba(239,68,68,0.1)", color: "#EF4444" },
}[s] || { bg: "rgba(255,255,255,0.05)", color: "#6B7280" });

export default function FullPublicDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase
            .from("orders")
            .select("id, order_number, service_type, status, progress, created_at, uuid_token")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
                setOrders(data || []);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <Navbar />
            <main className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24">

                {/* Header */}
                <div className="mb-16 border-b border-white/[0.06] pb-8">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium mb-4">PUBLIC DASHBOARD · TRANSPARENCY</p>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                        Dashboard
                    </h1>
                    <p className="text-sm text-neutral-500 mt-4">All active projects — publicly visible for full transparency.</p>
                </div>

                {/* Table */}
                <div className="border border-white/[0.06]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                        <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">Order ID</p>
                        <p className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-neutral-600">Service</p>
                        <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">Date</p>
                        <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">Status</p>
                        <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">Progress</p>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-6 h-6 border border-neutral-600 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-neutral-600 text-sm uppercase tracking-widest">No active projects at the moment.</p>
                        </div>
                    ) : orders.map((order) => {
                        const sc = statusColor(order.status);
                        return (
                            <div
                                key={order.id}
                                onClick={() => router.push(`/public/dashboard/${order.uuid_token}`)}
                                className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer group transition-colors"
                            >
                                <div className="col-span-2">
                                    <span className="text-sm font-mono font-semibold text-white">#{order.order_number}</span>
                                </div>
                                <div className="col-span-4">
                                    <span className="text-sm text-neutral-300">{order.service_type}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-xs text-neutral-600">{new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}</span>
                                </div>
                                <div className="col-span-2">
                                    <span
                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 uppercase tracking-wider"
                                        style={{ background: sc.bg, color: sc.color }}
                                    >
                                        <span className="w-1 h-1 rounded-full block" style={{ background: sc.color }} />
                                        {order.status}
                                    </span>
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <div className="flex-1 h-px bg-white/[0.08]">
                                        <div
                                            className="h-full transition-all duration-700"
                                            style={{
                                                width: `${order.progress}%`,
                                                background: order.progress >= 100 ? "#22C55E" : "rgba(255,255,255,0.3)"
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-neutral-600 w-8 text-right">{order.progress}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </main>
            <Footer />
        </div>
    );
}
