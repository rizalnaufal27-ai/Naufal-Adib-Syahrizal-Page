"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    order_number: number;
    service: string;
    status: string;
    progress: number;
}

export default function DashboardPreview() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(4);

            if (data) {
                setOrders(data.map(o => ({
                    id: `#${o.order_number}`,
                    order_number: o.order_number,
                    service: o.service_type,
                    status: o.status,
                    progress: o.progress
                })));
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; color: string; dot: string }> = {
            done: { bg: "rgba(34,197,94,0.1)", color: "#22C55E", dot: "#22C55E" },
            processing: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", dot: "#3B82F6" },
            pending: { bg: "rgba(234,179,8,0.1)", color: "#EAB308", dot: "#EAB308" },
        };
        return styles[status] || styles.pending;
    };

    return (
        <div className="section-container py-28">
            <div className="text-center mb-16">
                <p className="section-label">Transparency</p>
                <h2 className="section-title gradient-text">Dashboard</h2>
                <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                    Track your order status in real-time. No login required.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="agency-card !p-0 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                            Active Orders
                        </h3>
                        <a
                            href="/public/dashboard"
                            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-[1px]"
                            style={{
                                background: "rgba(59,130,246,0.1)",
                                color: "var(--color-primary)",
                                border: "1px solid rgba(59,130,246,0.15)",
                            }}
                        >
                            View Full Dashboard →
                        </a>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Order
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Service
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
                                            <div className="flex flex-col items-center gap-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
                                                    <rect x="2" y="3" width="20" height="18" rx="2" />
                                                    <line x1="8" y1="10" x2="16" y2="10" />
                                                    <line x1="8" y1="14" x2="12" y2="14" />
                                                </svg>
                                                No active orders
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.map((order) => {
                                    const statusStyle = getStatusStyle(order.status);
                                    return (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-white/[0.02]"
                                            style={{ borderBottom: "1px solid var(--color-border)" }}
                                        >
                                            <td className="px-6 py-4 text-sm font-mono font-semibold" style={{ color: "var(--color-text)" }}>
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
                                                {order.service}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase"
                                                    style={{
                                                        background: statusStyle.bg,
                                                        color: statusStyle.color,
                                                    }}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{
                                                                width: `${order.progress}%`,
                                                                background: order.status === "done"
                                                                    ? "#22C55E"
                                                                    : "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono font-semibold min-w-[32px] text-right" style={{ color: "var(--color-text-muted)" }}>
                                                        {order.progress}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
