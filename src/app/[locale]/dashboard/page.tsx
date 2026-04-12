"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    customer_name: string;
    customer_email: string;
    created_at: string;
    uuid_token: string;
}

export default function ClientDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState<string>("Client");
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !user.email) {
                router.push("/login?redirect=/dashboard");
                return;
            }
            // Safely get name from metadata or fallback to email local part
            const name = user.user_metadata?.full_name || user.email.split("@")[0];
            setUserName(name);
            fetchOrders(user.email);
        };
        checkUser();
    }, [router]);

    const fetchOrders = async (email: string) => {
        try {
            const { data } = await supabase
                .from("orders")
                .select("*")
                .eq("customer_email", email)
                .order("created_at", { ascending: false });

            if (data) setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const activeOrders = orders.filter((o) => o.status !== "done");
    const completedOrders = orders.filter((o) => o.status === "done");
    const avgProgress = orders.length > 0 
        ? Math.round(orders.reduce((acc, o) => acc + (o.progress || 0), 0) / orders.length) 
        : 0;

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getStatusStyle = (status: string) => {
        const map: Record<string, { bg: string; text: string }> = {
            done: { bg: "rgba(16, 185, 129, 0.1)", text: "#10B981" },
            processing: { bg: "rgba(255,255,255,0.05)", text: "#FFFFFF" },
            pending: { bg: "rgba(255,255,255,0.02)", text: "#A3A3A3" },
        };
        return map[status] || map.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex p-3">
            {/* Sidebar (Mockup 2 Style) */}
            <aside className="w-56 bg-[#0E0E0E] rounded-2xl border border-white/5 flex flex-col p-4">
                <div className="flex items-center gap-3 mb-10 pl-2 mt-2">
                    <div className="w-7 h-7 bg-white/10 rounded-md backdrop-blur-sm shadow-inner flex items-center justify-center">
                        <div className="w-3 h-3 bg-white/40 rounded-sm" />
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/10 rounded-lg text-sm font-medium text-white shadow-sm border border-white/5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                        Dashboard
                    </button>
                    {["Projects", "Invoices", "Files", "Communication", "Team", "Settings"].map((item) => (
                        <button key={item} disabled className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors cursor-not-allowed">
                            <div className="w-4 h-4 bg-neutral-700/50 rounded-sm" />
                            {item}
                        </button>
                    ))}
                </nav>
                <div className="pt-4 border-t border-white/5 mt-auto">
                    <button 
                        onClick={() => { supabase.auth.signOut(); router.push("/"); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col px-8 py-6 max-h-screen overflow-y-auto">
                
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-medium tracking-tight text-white/90">
                            Welcome Back, <span className="capitalize">{userName}</span>!
                        </h1>
                        <p className="text-xs text-neutral-500 mt-1 capitalize">
                            Client Portal
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                className="pl-9 pr-4 py-1.5 bg-[#0E0E0E] border border-white/5 rounded-full text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20 w-64"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center relative cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                            <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-800 border border-white/10" />
                    </div>
                </header>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight mb-1">Client Overview</h2>
                    <p className="text-xs text-neutral-500">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric"})}</p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-[#0E0E0E] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-xs text-neutral-400 font-medium">Active Projects</span>
                            <span className="text-neutral-600 text-lg group-hover:text-white transition-colors">+</span>
                        </div>
                        <span className="text-3xl font-semibold opacity-90 relative z-10">{activeOrders.length}</span>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    </div>

                    <div className="bg-[#0E0E0E] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-xs text-neutral-400 font-medium">Completed</span>
                            <svg className="text-neutral-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <span className="text-3xl font-semibold opacity-90 relative z-10">{completedOrders.length}</span>
                    </div>

                    <div className="bg-[#0E0E0E] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-xs text-neutral-400 font-medium">Total Services</span>
                            <svg className="text-neutral-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <span className="text-3xl font-semibold opacity-90 relative z-10">{orders.length}</span>
                    </div>

                    <div className="bg-[#0E0E0E] border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-xs text-neutral-400 font-medium">Avg Completion</span>
                            <svg className="text-neutral-600" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                        </div>
                        <span className="text-3xl font-semibold opacity-90 relative z-10">{avgProgress}%</span>
                    </div>
                </div>

                {/* Main Table Panel */}
                <div className="flex-1 bg-[#0E0E0E] border border-white/5 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center p-5 border-b border-white/5">
                        <h3 className="text-sm font-semibold tracking-wide">Project Timeline</h3>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                        </div>
                    </div>

                    <div className="p-3 flex-1 overflow-y-auto">
                        {orders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
                                No active projects right now.
                            </div>
                        ) : (
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-neutral-500 border-b border-white/5">
                                        <th className="pb-3 px-3 font-medium">Name</th>
                                        <th className="pb-3 px-3 font-medium">Progress Bar</th>
                                        <th className="pb-3 px-3 font-medium">Status</th>
                                        <th className="pb-3 px-3 font-medium text-right">Date Started</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((o) => {
                                        const statusColor = getStatusStyle(o.status);
                                        return (
                                            <tr 
                                                key={o.id} 
                                                onClick={() => window.location.href = `/order/${o.uuid_token}`}
                                                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                            >
                                                <td className="py-4 px-3 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] uppercase font-bold text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                                                            {o.service_type.substring(0,2)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white/90">{o.service_type}</div>
                                                            <div className="text-[10px] text-neutral-500">#{o.order_number}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3 align-middle w-1/4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex-1">
                                                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${o.progress}%`, background: o.progress === 100 ? "#10B981" : "#FFFFFF" }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-3 align-middle">
                                                    <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold" style={{ background: statusColor.bg, color: statusColor.text }}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3 align-middle text-right text-neutral-400 font-mono">
                                                    {formatDate(o.created_at)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
