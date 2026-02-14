"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    order_number: number;
    service: string; // mapped from service_type
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

    return (
        <div className="section-container py-24">
            <div className="text-center mb-16">
                <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "var(--color-highlight)" }}>
                    Transparency
                </p>
                <h2 className="text-3xl md:text-5xl font-bold gradient-text">Dashboard</h2>
                <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                    Track your order status in real-time. No login required.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="glass-card overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                            Active Orders
                        </h3>
                        <a
                            href="/dashboard"
                            className="text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
                            style={{
                                background: "rgba(59,130,246,0.1)",
                                color: "var(--color-primary)",
                                border: "1px solid rgba(59,130,246,0.2)",
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
                                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Order
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Service
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
                                            Loading latest orders...
                                        </td>
                                    </tr>
                                ) : orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        style={{ borderBottom: "1px solid var(--color-border)" }}
                                    >
                                        <td className="px-6 py-4 text-sm font-mono font-semibold" style={{ color: "var(--color-text)" }}>
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
                                            {order.service}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`status-badge status-${order.status}`}>
                                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{
                                                    background: order.status === "done" ? "#22C55E" : order.status === "processing" ? "#3B82F6" : "#EAB308"
                                                }} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${order.progress}%`,
                                                            background: order.status === "done"
                                                                ? "#22C55E"
                                                                : "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                                                    {order.progress}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
