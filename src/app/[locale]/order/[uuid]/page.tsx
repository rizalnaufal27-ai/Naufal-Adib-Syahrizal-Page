"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PaymentButton from "@/components/PaymentButton";
import OrderChat from "@/components/OrderChat";
import {
    CheckCircle2, CreditCard, MessageSquare, FileImage, RefreshCw, Lock,
    Layout, ShieldCheck, ChevronDown, Clock, ArrowLeft
} from "lucide-react";
import { useTranslations } from "next-intl";

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
    down_payment_amount: number;
    down_payment_status: string;
    final_payment_amount: number;
    final_payment_status: string;
    evidence_links: Array<{ url: string; publicId: string; uploadedAt: string }>;
    result_files: Array<{ name: string; url: string; type: string; size: number; uploadedAt: string }>;
    uuid_token: string;
    chat_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export default function UnifiedOrderPage() {
    const params = useParams();
    const uuid = params?.uuid as string;
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const t = useTranslations("OrderPage");

    const fetchOrder = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders/${uuid}`);
            const data = await res.json();
            if (data.order) {
                setOrder(data.order);
            } else {
                setError("Order not found");
            }
        } catch {
            setError("Failed to load order");
        } finally {
            setLoading(false);
        }
    }, [uuid]);

    useEffect(() => {
        if (uuid) fetchOrder();
    }, [uuid, fetchOrder]);

    // Real-time updates
    useEffect(() => {
        if (!order?.id) return;
        const channel = supabase
            .channel(`order-${order.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${order.id}`
            }, () => { fetchOrder(); })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [order?.id, fetchOrder]);

    const handleSyncStatus = async () => {
        if (!order) return;
        setLoading(true);
        try {
            await fetch("/api/payment/check-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: order.id }),
            });
            await fetchOrder();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" />
                <span className="text-xs text-white/30">Loading project...</span>
            </div>
        </div>
    );
    if (error || !order) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <span className="text-2xl">!</span>
                </div>
                <p className="text-white/60 text-sm">{error || "Order not found"}</p>
                <button onClick={() => router.push("/track")} className="mt-4 text-xs text-indigo-400 hover:text-indigo-300">
                    {t("backToTrack")}
                </button>
            </div>
        </div>
    );

    // === Phase Logic ===
    const isConsultation = order.service_type === "Consultation";
    const isDepositPaid = order.down_payment_status === "paid";
    const isCompleted = order.final_payment_status === "paid";

    // Workflow kanban phases
    const phases = [
        {
            name: t("phases.deposit"),
            icon: CreditCard,
            status: isDepositPaid ? "completed" : "active",
            detail: isDepositPaid ? t("phases.paid") : t("phases.awaitingPayment"),
        },
        {
            name: t("phases.production"),
            icon: Layout,
            status: isDepositPaid
                ? (order.progress >= 80 ? "completed" : "active")
                : "locked",
            detail: isDepositPaid ? `${order.progress}%` : t("phases.locked"),
        },
        {
            name: t("phases.review"),
            icon: FileImage,
            status: order.progress >= 80
                ? (order.progress >= 100 ? "completed" : "active")
                : "locked",
            detail: order.evidence_links?.length > 0 ? `${order.evidence_links.length} files` : t("phases.pending"),
        },
        {
            name: t("phases.delivered"),
            icon: CheckCircle2,
            status: isCompleted ? "completed" : "locked",
            detail: isCompleted ? t("phases.complete") : t("phases.finalPayment"),
        },
    ];


    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            {/* ============ STICKY HEADER ============ */}
            <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => router.push("/track")}
                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={16} className="text-white/60" />
                        </button>
                        <div>
                            <h1 className="text-base md:text-lg font-bold text-white">
                                {order.service_type} Project
                            </h1>
                            <div className="flex items-center gap-2 text-[11px] text-white/40">
                                <span className="font-mono">#{order.order_number}</span>
                                <span>•</span>
                                <span>{new Date(order.created_at).toLocaleDateString("id-ID")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSyncStatus}
                            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                        >
                            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                            <span className="hidden sm:inline">{t("sync")}</span>
                        </button>
                        {/* Status badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <span className="relative flex h-2 w-2">
                                {!isCompleted && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isCompleted ? "bg-indigo-500" : "bg-green-500"}`} />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                                {order.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ============ MOCKUP 3: HORIZONTAL TRACKER ============ */}
            {!isConsultation && (
                <div className="pt-10 pb-6 px-4 md:px-6 max-w-5xl mx-auto">
                    <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto mb-10">
                        {/* Background connecting line */}
                        <div className="absolute left-[10%] right-[10%] h-[2px] bg-white/10 top-6 -z-10" />

                        {phases.map((phase, i) => {
                            const PhaseIcon = phase.icon;
                            const isActive = phase.status === "active";
                            const isCompleted = phase.status === "completed";
                            return (
                                <div key={i} className="flex flex-col items-center gap-3 relative z-10 w-1/4">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isCompleted ? "bg-[#1A2E26] text-[#22C55E] ring-1 ring-[#22C55E]/20" : isActive ? "bg-[#1E293B] text-white ring-2 ring-white/50" : "bg-[#0A0A0A] text-white/30 border border-white/10"}`}>
                                        <PhaseIcon size={18} />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className={`text-xs font-medium ${isCompleted || isActive ? "text-white" : "text-white/40"}`}>{phase.name}</span>
                                        {isActive && <div className="absolute -bottom-4 w-1.5 h-1.5 bg-[#22C55E] rounded-full shadow-[0_0_8px_#22c55e]" />}
                                        {(isCompleted) && <div className="absolute -bottom-4 w-1.5 h-1.5 bg-[#22C55E]/50 rounded-full" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ============ MAIN CONTENT — 2 COLUMN ============ */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 pb-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

                {/* ─── LEFT COLUMN: Order Details Card ─── */}
                <div className="bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    
                    <h2 className="text-2xl font-semibold text-white/90 mb-8 relative z-10">Order Details: #{order.order_number}</h2>

                    <div className="grid grid-cols-2 gap-y-8 gap-x-6 relative z-10 mb-8">
                        <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Project Name</p>
                            <p className="text-lg font-medium text-white/90">{order.service_type}</p>
                            <p className="text-xs text-white/50 mt-1 line-clamp-2">{order.description || "Website Design & Development"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Order Date</p>
                            <p className="text-lg font-medium text-white/90">{new Date(order.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric"})}</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Client Contact</p>
                            <p className="text-lg font-medium text-white/90">{order.customer_name || "Client"}</p>
                            <p className="text-sm text-white/50 mt-1">{order.customer_email}</p>
                        </div>
                        
                        <div className="row-span-2 flex flex-col gap-4">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                <p className="text-white/80 font-medium text-sm mb-1">{order.service_type}</p>
                                <p className="text-xs text-white/40">Rp {order.gross_amount.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                <p className="text-xs text-white/40 mb-1">Current Status</p>
                                <p className="text-white/80 text-sm">{order.progress >= 100 ? "Completed and delivered." : `Your order is currently in the ${order.status.replace("_", " ")} phase. We are crafting it with premium quality.`}</p>
                            </div>
                        </div>
                    </div>

                    {/* ──── PAYMENT SECTION (Integrated inside the card) ──── */}
                    {!isConsultation && (
                        <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                                <CreditCard size={14} /> Payments
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${isDepositPaid ? "border-[#22C55E]/30 bg-[#22C55E]/5" : "border-white/10 bg-white/5"}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-semibold text-white/60">Down Payment</span>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isDepositPaid ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-white/10 text-white/40"}`}>{isDepositPaid ? "Paid" : "Pending"}</span>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-mono text-sm">Rp {order.down_payment_amount.toLocaleString("id-ID")}</span>
                                        {!isDepositPaid && <PaymentButton uuidToken={order.uuid_token} orderId={order.id} paymentType="down_payment" amount={order.down_payment_amount} onSuccess={fetchOrder} />}
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl border ${isCompleted ? "border-[#22C55E]/30 bg-[#22C55E]/5" : "border-white/10 bg-white/5"}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-semibold text-white/60">Final Payment</span>
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isCompleted ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-white/10 text-white/40"}`}>{isCompleted ? "Paid" : "Pending"}</span>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-mono text-sm">Rp {order.final_payment_amount.toLocaleString("id-ID")}</span>
                                        {isDepositPaid && !isCompleted && <PaymentButton uuidToken={order.uuid_token} paymentType="final_payment" amount={order.final_payment_amount} onSuccess={fetchOrder} label="Pay" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── RIGHT SIDEBAR: Updates Timeline ─── */}
                <div className="pl-4">
                    <h3 className="text-lg font-medium text-white/90 mb-6">Updates</h3>
                    
                    <div className="space-y-4 relative">
                        <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-white/10" />

                        {/* Event: Completion */}
                        {isCompleted && (
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#10B981] border-4 border-[#050505]" />
                                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                                    <div className="text-xs font-semibold text-white/80">Project Delivered</div>
                                    <div className="text-[10px] text-white/40 mt-1">All final files handed over.</div>
                                </div>
                            </div>
                        )}

                        {/* Event: Working */}
                        {isDepositPaid && (
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white/20 border-4 border-[#050505]" />
                                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                                    <div className="text-xs font-semibold text-white/80">Design Phase Progress</div>
                                    <div className="text-[10px] text-white/40 mt-1">Currently at {order.progress}%.</div>
                                </div>
                            </div>
                        )}

                        {/* Event: Order Confirmed */}
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#10B981] border-4 border-[#050505]" />
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                                <div className="text-xs font-semibold text-white/80">Order Confirmed</div>
                                <div className="text-[10px] text-white/40 mt-1">Order #{order.order_number} received.</div>
                            </div>
                        </div>

                    </div>
                    
                    {/* Result Files Download placed here if exists */}
                    {order.result_files && order.result_files.length > 0 && (
                        <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/[0.03] p-4">
                            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">
                                Results
                            </h3>
                            <div className="space-y-2">
                                {order.result_files.map((f: any, i: number) => (
                                    <a key={i} href={f.url} download target="_blank" className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 transition-colors text-xs font-medium text-white truncate max-w-full block">
                                        📎 {f.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Chat CTA below */}
                    {order.chat_enabled && isDepositPaid && (
                        <div className="mt-8 border border-white/10 rounded-xl overflow-hidden bg-white/5">
                            <button onClick={() => setChatOpen(!chatOpen)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02]">
                                <span className="text-sm font-semibold">Project Chat</span>
                                <ChevronDown size={14} className={`${chatOpen ? "rotate-180" : ""}`} />
                            </button>
                            {chatOpen && (
                                <div className="h-[350px] border-t border-white/5 bg-black/40">
                                    <OrderChat orderId={order.id} uuidToken={order.uuid_token} chatEnabled={true} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                    {/* Public View Link */}
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 text-center">
                        <p className="text-xs text-white/50 mb-3">{t("sharePublicly")}</p>
                        <button
                            onClick={() => {
                                const url = `${window.location.origin}/public/dashboard/${order.uuid_token}`;
                                navigator.clipboard.writeText(url);
                            }}
                            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            {t("copyPublicLink")}
                        </button>
                    </div>

                    {/* Need Help CTA */}
                    <a
                        href="https://wa.me/6285782074034"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-2xl border border-green-500/20 bg-green-500/5 p-5 text-center hover:bg-green-500/10 transition-colors"
                    >
                        <p className="text-xs text-white/50 mb-1">{t("needHelp")}</p>
                        <p className="text-sm font-semibold text-green-400">{t("contactViaWhatsapp")}</p>
                    </a>
                </div>
        </main>
    );
}

