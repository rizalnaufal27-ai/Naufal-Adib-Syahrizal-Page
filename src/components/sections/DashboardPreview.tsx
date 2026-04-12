"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
    const t = useTranslations("Dashboard");

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
            done: { bg: "rgba(16, 185, 129, 0.1)", color: "#10B981", dot: "#10B981", glow: "none" },
            processing: { bg: "rgba(255,255,255,0.08)", color: "#FFFFFF", dot: "#FFFFFF", glow: "none" },
            pending: { bg: "rgba(255,255,255,0.03)", color: "#A3A3A3", dot: "#A3A3A3", glow: "none" },
        };
        return styles[status] || styles.pending;
    };

    return (
        <div className="section-container py-28 relative overflow-hidden bg-[#0A0A0A]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                <div className="text-center mb-16">
                    <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-neutral-500">
                        ✦ {t("label")}
                    </motion.p>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight text-white/90">
                        {t("title")}
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-sm mt-4 max-w-md mx-auto text-neutral-400">
                        {t("desc")}
                    </motion.p>
                </div>

                <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
                    <div className="rounded-2xl overflow-hidden relative bg-[#111111]" style={{ border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
                        {/* Header */}
                        <div className="px-6 py-5 flex items-center justify-between border-b border-white/[0.05]">
                            <h3 className="text-sm font-semibold flex items-center gap-2 text-white/90">
                                <span className="w-2 h-2 rounded-full bg-white/70" />
                                {t("active_orders")}
                            </h3>
                            <Link href="/public/dashboard" className="relative z-10 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                {t("view_full")}
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/[0.02]">
                                        {[t("columns.order"), t("columns.service"), t("columns.status"), t("columns.progress")].map(h => (
                                            <th key={h} className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-neutral-500">
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="text-3xl opacity-20 filter grayscale">🌌</span>
                                                    {t("no_active")}
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
                                                className="transition-colors hover:bg-white/[0.02] group border-b border-white/[0.02] last:border-b-0"
                                            >
                                                <td className="px-6 py-4 text-sm font-mono font-bold text-white/80">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-neutral-300">{order.service}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border border-white/[0.03]" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-1.5 rounded-full bg-neutral-900 border border-white/[0.02]">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${order.progress}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                                                                className="h-full rounded-full relative"
                                                                style={{
                                                                    background: order.status === "done" ? "#10B981" : "#E5E7EB",
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-mono font-bold min-w-[32px] text-right text-neutral-400">{order.progress}%</span>
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
