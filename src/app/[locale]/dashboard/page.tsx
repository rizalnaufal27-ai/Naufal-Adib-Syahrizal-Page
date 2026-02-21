"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    customer_name: string;
    customer_email: string;
    description: string;
    gross_amount: number;
    created_at: string;
    uuid_token: string;
}

export default function DashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.email) {
                router.push("/login?redirect=/dashboard");
                return;
            }
            setUserEmail(user.email);
            fetchOrders(user.email);
        };
        checkUser();
    }, [router]);

    const fetchOrders = async (email: string) => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("customer_email", email)
                .order("created_at", { ascending: false });

            if (data) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const map: Record<string, string> = {
            pending: "#EAB308",
            processing: "#3B82F6",
            done: "#22C55E",
            paid: "#22C55E",
            unpaid: "#EF4444",
        };
        return map[status] || "#a3a3a3";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: "#050505" }}>
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 relative z-10" style={{ background: "#050505" }}>
            <div className="section-container max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/60">
                            My Projects
                        </h1>
                        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                            Track your orders and collaborate.
                        </p>
                    </div>
                    <div className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60">
                        {userEmail}
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl border border-dashed" style={{ borderColor: "var(--color-border)", background: "rgba(255,255,255,0.02)" }}>
                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No active projects</h3>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">
                            Start a new project by clicking the button below or using the chat assistant.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => window.open(`/order/${order.uuid_token}`, "_blank")}
                                className="group cursor-pointer relative p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/10"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter: "blur(12px)",
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10"
                                        style={{
                                            background: `${getStatusColor(order.status)}15`,
                                            color: getStatusColor(order.status),
                                            borderColor: `${getStatusColor(order.status)}30`
                                        }}>
                                        {order.status}
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">#{order.order_number}</span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                    {order.service_type}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                    {order.description || "No description provided."}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                    <div className="text-xs text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs font-medium text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        Open Project →
                                    </div>
                                </div>

                                {/* Progress Bar Background */}
                                <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/20 w-full rounded-b-2xl overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        style={{ width: `${order.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
