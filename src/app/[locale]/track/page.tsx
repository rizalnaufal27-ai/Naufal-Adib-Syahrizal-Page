"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    description: string;
    created_at: string;
    uuid_token: string;
}

export default function TrackProjectPage() {
    const [email, setEmail] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setSearched(true);

        const { data } = await supabase
            .from("orders")
            .select("id, order_number, service_type, status, progress, description, created_at, uuid_token")
            .eq("customer_email", email.trim().toLowerCase())
            .order("created_at", { ascending: false });

        setOrders(data || []);
        setLoading(false);
    };

    const getStatusStyle = (status: string) => {
        const map: Record<string, { bg: string; color: string; dot: string }> = {
            done: { bg: "rgba(34,197,94,0.1)", color: "#22C55E", dot: "#22C55E" },
            processing: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", dot: "#3B82F6" },
            pending: { bg: "rgba(234,179,8,0.1)", color: "#EAB308", dot: "#EAB308" },
        };
        return map[status] || map.pending;
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 relative z-10" style={{ background: "#050505" }}>
            <Navbar />
            <div className="section-container max-w-3xl mx-auto mt-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/60 mb-3">
                        Track My Project
                    </h1>
                    <p className="text-sm text-white/40 max-w-md mx-auto">
                        Enter the email you used when placing your order to view your project status and details.
                    </p>
                </motion.div>

                {/* Search Form */}
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSearch}
                    className="flex gap-3 mb-10"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#fff",
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                        style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                Search
                            </>
                        )}
                    </button>
                </motion.form>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {searched && !loading && (
                        <motion.div
                            key={orders.length > 0 ? "results" : "empty"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {orders.length === 0 ? (
                                <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                                    <p className="text-white/40 text-sm mb-2">No projects found for this email.</p>
                                    <p className="text-white/20 text-xs">Make sure you&apos;re using the same email from your order.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-4">
                                        {orders.length} project{orders.length > 1 ? "s" : ""} found
                                    </p>
                                    {orders.map((order, i) => {
                                        const ss = getStatusStyle(order.status);
                                        const isActive = order.status !== "done";
                                        return (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="group relative p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                                                style={{
                                                    background: "rgba(255,255,255,0.02)",
                                                    border: `1px solid ${isActive ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.06)"}`,
                                                }}
                                                onClick={() => window.open(`/public/dashboard/${order.uuid_token}`, "_blank")}
                                            >
                                                {/* Active indicator */}
                                                {isActive && (
                                                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                                                        </span>
                                                        <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">Active</span>
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-xs font-mono text-white/40">#{order.order_number}</span>
                                                            <span
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                                                                style={{ background: ss.bg, color: ss.color }}
                                                            >
                                                                <span className="w-1 h-1 rounded-full" style={{ background: ss.dot }} />
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                                            {order.service_type}
                                                        </h3>
                                                        <p className="text-sm text-white/30 line-clamp-1 mb-3">
                                                            {order.description || "No description"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{
                                                                width: `${order.progress}%`,
                                                                background: order.progress === 100
                                                                    ? "#22C55E"
                                                                    : "linear-gradient(90deg, #6366f1, #06b6d4)",
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono font-semibold text-white/40 min-w-[32px] text-right">
                                                        {order.progress}%
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center mt-3 text-xs text-white/20">
                                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1 text-indigo-400/70 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </main>
    );
}
