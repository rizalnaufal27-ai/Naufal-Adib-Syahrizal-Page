"use client";
import { useState, useEffect } from "react";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    created_at: string;
}

// Sample data for demo (will be replaced with real Supabase data)
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    created_at: string;
}

export default function DashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [lookupId, setLookupId] = useState("");
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);
    const [lookupError, setLookupError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
            if (data) setOrders(data);
        };
        fetchOrders();
    }, []);

    const handleLookup = () => {
        setLookupError("");
        setFoundOrder(null);
        const order = orders.find(
            (o) => o.id === lookupId.trim() || `#${o.order_number}` === lookupId.trim() || String(o.order_number) === lookupId.trim()
        );
        if (order) {
            setFoundOrder(order);
        } else {
            setLookupError("Order not found. Please check your Order ID and try again.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "done": return "#22C55E";
            case "processing": return "#3B82F6";
            case "pending": return "#EAB308";
            case "rejected": return "#EF4444";
            default: return "#A3A3A3";
        }
    };

    return (
        <div style={{ background: "#050505", minHeight: "100vh" }}>
            {/* Noise overlay */}
            <div className="noise-overlay" />

            {/* Back nav */}
            <div className="section-container pt-8">
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-sm transition-colors duration-300"
                    style={{ color: "var(--color-text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </a>
            </div>

            <div className="section-container py-16">
                <div className="text-center mb-12">
                    <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "var(--color-highlight)" }}>
                        Order Tracking
                    </p>
                    <h1 className="text-3xl md:text-5xl font-bold gradient-text" style={{ fontFamily: "var(--font-heading)" }}>
                        Dashboard
                    </h1>
                    <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                        Track your order status. No login required — search by Order ID.
                    </p>
                </div>

                {/* Order Lookup */}
                <div className="max-w-lg mx-auto mb-12">
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text)" }}>
                            🔍 Look Up Your Order
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={lookupId}
                                onChange={(e) => setLookupId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                                placeholder="Enter Order ID or #number"
                                className="flex-1 px-4 py-3 rounded-xl text-sm"
                                style={{
                                    background: "var(--color-bg-glass)",
                                    border: "1px solid var(--color-border)",
                                    color: "var(--color-text)",
                                    outline: "none",
                                }}
                            />
                            <button onClick={handleLookup} className="btn-primary px-6">
                                Search
                            </button>
                        </div>

                        {lookupError && (
                            <p className="text-xs mt-3" style={{ color: "#EF4444" }}>{lookupError}</p>
                        )}

                        {foundOrder && (
                            <div className="mt-4 glass-card p-5 space-y-4" style={{ borderColor: "rgba(59,130,246,0.3)" }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                                            Order #{foundOrder.order_number}
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                            {foundOrder.service_type}
                                        </p>
                                    </div>
                                    <span className={`status-badge status-${foundOrder.status}`}>
                                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: getStatusColor(foundOrder.status) }} />
                                        {foundOrder.status}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: "var(--color-text-muted)" }}>Progress</span>
                                        <span style={{ color: "var(--color-primary)" }}>{foundOrder.progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${foundOrder.progress}%`,
                                                background: foundOrder.status === "done"
                                                    ? "#22C55E"
                                                    : "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <a
                                        href="https://wa.me/6285782074034"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary flex-1 text-center text-xs py-2.5"
                                    >
                                        💬 WhatsApp
                                    </a>
                                    <a
                                        href="mailto:rizalnaufal27@gmail.com"
                                        className="btn-outline flex-1 text-center text-xs py-2.5"
                                    >
                                        📧 Email
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Public Queue */}
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card overflow-hidden">
                        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                                Active Order Queue
                            </h3>
                            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                All orders are anonymized for privacy
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                        {["Order", "Service", "Status", "Progress", "Date"].map((h) => (
                                            <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                            <td className="px-6 py-4 text-sm font-mono font-semibold" style={{ color: "var(--color-text)" }}>
                                                #{order.order_number}
                                            </td>
                                            <td className="px-6 py-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
                                                {order.service_type}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`status-badge status-${order.status}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: getStatusColor(order.status) }} />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", minWidth: "80px" }}>
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
                                            <td className="px-6 py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
