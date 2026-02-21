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

export default function FullPublicDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase
                .from("orders")
                .select("id, order_number, service_type, status, progress, created_at, uuid_token")
                .order("created_at", { ascending: false });

            if (data) {
                setOrders(data);
            }
            setLoading(false);
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
        <main className="min-h-screen pt-24 pb-12 px-4 relative z-10" style={{ background: "#050505" }}>
            <Navbar />
            <div className="section-container max-w-5xl mx-auto mt-10">
                <div className="text-center mb-12">
                    <p className="section-label">Transparency</p>
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/60 mb-4">
                        Public Dashboard
                    </h1>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        A real-time view of all active and past projects. No login required.
                    </p>
                </div>

                <div className="agency-card overflow-hidden">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                            Order ID
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                            Service Type
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                            Date
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                            Progress
                                        </th>
                                        <th className="px-4 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
                                                No projects found.
                                            </td>
                                        </tr>
                                    ) : orders.map((order) => {
                                        const statusStyle = getStatusStyle(order.status);
                                        return (
                                            <tr
                                                key={order.id}
                                                className="transition-colors hover:bg-white/[0.04] cursor-pointer group"
                                                style={{ borderBottom: "1px solid var(--color-border)" }}
                                                onClick={() => router.push(`/public/dashboard/${order.uuid_token}`)}
                                            >
                                                <td className="px-6 py-5 text-sm font-mono font-semibold" style={{ color: "var(--color-text)" }}>
                                                    #{order.order_number}
                                                </td>
                                                <td className="px-6 py-5 text-sm" style={{ color: "var(--color-text-muted)" }}>
                                                    {order.service_type}
                                                </td>
                                                <td className="px-6 py-5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-5">
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
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-1.5 rounded-full min-w-[100px]" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                            <div
                                                                className="h-full rounded-full transition-all duration-700"
                                                                style={{
                                                                    width: `${order.progress}%`,
                                                                    background: order.status === "done" || order.progress === 100
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
                                                <td className="px-4 py-5">
                                                    <span className="text-xs text-indigo-400/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        View →
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
