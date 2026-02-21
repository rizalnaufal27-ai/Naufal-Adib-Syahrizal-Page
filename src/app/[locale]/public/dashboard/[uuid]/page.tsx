"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Clock, Code2, Database, Layout, Palette, ShieldCheck, Zap } from "lucide-react";

interface Order {
    id: string;
    order_number: number;
    service_type: string;
    status: string;
    progress: number;
    description: string;
    created_at: string;
    updated_at: string;
    customer_name: string; // Maybe hide last name?
}

export default function PublicDashboardPage() {
    const params = useParams();
    const uuid = params?.uuid as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("id, order_number, service_type, status, progress, description, created_at, updated_at, customer_name")
                .eq("uuid_token", uuid)
                .single();

            if (data) setOrder(data);
            setLoading(false);
        };
        fetchOrder();
    }, [uuid]);

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" /></div>;
    if (!order) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Project not found or private.</div>;

    // Kanban Logic
    const phases = [
        { name: "Planning", status: order.progress > 0 ? "completed" : "active", range: [0, 20] },
        { name: "Production", status: order.progress > 20 ? (order.progress >= 80 ? "completed" : "active") : "pending", range: [21, 80] },
        { name: "Quality Control", status: order.progress > 80 ? (order.progress >= 100 ? "completed" : "active") : "pending", range: [81, 99] },
        { name: "Delivered", status: order.progress === 100 ? "completed" : "pending", range: [100, 100] },
    ];

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            {/* 1. Header Section */}
            <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Zap size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                Status: {order.service_type} Project
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Order #{order.order_number}</span>
                                <span>•</span>
                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5 mr-1">
                            {order.status !== "completed" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${order.status === "completed" ? "bg-indigo-500" : "bg-green-500"}`}></span>
                        </span>
                        <span className="text-sm font-medium text-gray-300 uppercase tracking-widest text-[10px]">
                            {order.status.replace("_", " ")}
                        </span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: Kanban & Status */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Summary */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-indigo-400" />
                            Project Overview
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {order.description || "No public description available."}
                        </p>
                    </div>

                    {/* Kanban Board */}
                    <div>
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <Layout size={18} className="text-indigo-400" />
                            Workflow Progress
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {phases.map((phase, i) => (
                                <div key={i} className={`relative p-4 rounded-xl border transition-all ${phase.status === "active" ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10" :
                                        phase.status === "completed" ? "bg-green-500/5 border-green-500/20" :
                                            "bg-white/[0.02] border-white/5 opacity-50"
                                    }`}>
                                    <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">
                                        Step 0{i + 1}
                                    </div>
                                    <div className="font-semibold text-sm mb-3">{phase.name}</div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${phase.status === "completed" ? "bg-green-500 w-full" :
                                                phase.status === "active" ? "bg-indigo-500 w-1/2 animate-pulse" : "w-0"
                                            }`} />
                                    </div>
                                    {phase.status === "completed" && (
                                        <div className="absolute top-3 right-3 text-green-500"><CheckCircle2 size={14} /></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Showcase */}
                    <div>
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <Palette size={18} className="text-indigo-400" />
                            Recent Works
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Mock Items for now */}
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="group relative aspect-video rounded-xl bg-white/5 overflow-hidden border border-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                    <div className="absolute bottom-3 left-3">
                                        <div className="text-xs text-indigo-300 font-mono mb-0.5">Showcase</div>
                                        <div className="text-sm font-bold">Project {String.fromCharCode(65 + i)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Sidebar: Tech Stack & Logs */}
                <div className="space-y-6">

                    {/* Tech Stack */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Next.js", "Tailwind", "Supabase", "Figma"].map(tech => (
                                <span key={tech} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Milestone Logs */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Milestone Logs</h3>
                        <div className="space-y-4 relative">
                            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" />

                            <div className="relative pl-5">
                                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-[#050505]" />
                                <div className="text-xs text-gray-500 mb-0.5">{new Date(order.updated_at).toLocaleTimeString()}</div>
                                <div className="text-sm text-gray-200">Latest update logged</div>
                            </div>

                            <div className="relative pl-5">
                                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-white/20 border border-[#050505]" />
                                <div className="text-xs text-gray-500 mb-0.5">{new Date(order.created_at).toLocaleTimeString()}</div>
                                <div className="text-sm text-gray-400">Project initiated</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 text-center">
                        <p className="text-sm font-medium mb-3">Like what you see?</p>
                        <a href="/" target="_blank" className="block w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
                            Start Your Project
                        </a>
                    </div>

                </div>
            </div>
        </main>
    );
}
