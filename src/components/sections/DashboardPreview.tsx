"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Order {
    id: string;
    order_number: number;
    service: string;
    status: string;
    progress: number;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

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
        const styles: Record<string, { bg: string; color: string; dot: string; glow: string }> = {
            done: { bg: "rgba(34,197,94,0.1)", color: "#22C55E", dot: "#22C55E", glow: "0 0 12px rgba(34,197,94,0.4)" },
            processing: { bg: "rgba(139,92,246,0.1)", color: "#8B5CF6", dot: "#8B5CF6", glow: "0 0 12px rgba(139,92,246,0.4)" },
            pending: { bg: "rgba(234,179,8,0.1)", color: "#EAB308", dot: "#EAB308", glow: "0 0 12px rgba(234,179,8,0.4)" },
        };
        return styles[status] || styles.pending;
    };

    return (
        <div className="section-container py-28 relative overflow-hidden">
            {/* Cosmic ambient */}
            <div className="absolute bottom-[10%] right-[-5%] w-[25%] h-[30%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(80px)", animation: "nebulaPulse 14s ease-in-out infinite" }} />

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                <div className="text-center mb-16">
                    <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦ Transparency</motion.p>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fff 0%, #e0e7ff 40%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</motion.h2>
                    <motion.p variants={fadeUp} className="text-sm mt-4 max-w-md mx-auto text-white/40">Track your order status in real-time. No login required.</motion.p>
                </div>

                <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
                    <div className="rounded-2xl overflow-hidden relative" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.12)", backdropFilter: "blur(10px)" }}>
                        {/* Cosmic glow top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(99,102,241,0.3), transparent)" }} />

                        {/* Header */}
                        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(139,92,246,0.08)" }}>
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                Active Orders
                            </h3>
                            <a
                                href="/public/dashboard"
                                className="relative z-10 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #6366F1)", color: "#fff" }}
                            >
                                View Full Dashboard ✦
                            </a>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(139,92,246,0.06)" }}>
                                        {["Order", "Service", "Status", "Progress"].map(h => (
                                            <th key={h} className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-purple-300/50">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-white/30">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="text-3xl opacity-20">🌌</span>
                                                    No active orders
                                                </div>
                                            </td>
                                        </tr>
                                    ) : orders.map((order, i) => {
                                        const statusStyle = getStatusStyle(order.status);
                                        return (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                                className="transition-colors hover:bg-purple-500/[0.03] group"
                                                style={{ borderBottom: "1px solid rgba(139,92,246,0.04)" }}
                                            >
                                                <td className="px-6 py-4 text-sm font-mono font-bold text-purple-300">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-white/50">{order.service}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot, boxShadow: statusStyle.glow }} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(139,92,246,0.06)" }}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${order.progress}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                                                                className="h-full rounded-full relative"
                                                                style={{
                                                                    background: order.status === "done" ? "linear-gradient(90deg, #22C55E, #16A34A)" : "linear-gradient(90deg, #8B5CF6, #6366F1)",
                                                                    boxShadow: order.status === "done" ? "0 0 10px rgba(34,197,94,0.4)" : "0 0 10px rgba(139,92,246,0.4)",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-mono font-bold min-w-[32px] text-right text-white/40">{order.progress}%</span>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
