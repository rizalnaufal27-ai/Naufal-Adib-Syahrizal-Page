"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PaymentButton from "@/components/PaymentButton";
import OrderChat from "@/components/OrderChat";
import {
    CheckCircle2, CreditCard, MessageSquare, FileImage, RefreshCw, Lock,
    Layout, ShieldCheck, Zap, ChevronDown, Clock, ArrowLeft
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

    const activePhaseIndex = phases.findIndex(p => p.status === "active");

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

            {/* ============ WORKFLOW PROGRESS BAR ============ */}
            {!isConsultation && (
                <div className="border-b border-white/5 bg-white/[0.01]">
                    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {phases.map((phase, i) => {
                                const PhaseIcon = phase.icon;
                                return (
                                    <div
                                        key={i}
                                        className={`relative p-3 md:p-4 rounded-xl border transition-all duration-500 ${phase.status === "active"
                                            ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                                            : phase.status === "completed"
                                                ? "bg-green-500/5 border-green-500/20"
                                                : "bg-white/[0.01] border-white/5 opacity-40"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <PhaseIcon size={14} className={
                                                phase.status === "completed" ? "text-green-400"
                                                    : phase.status === "active" ? "text-indigo-400"
                                                        : "text-white/30"
                                            } />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                                                {t(`workflow.step${i + 1}`)}
                                            </span>
                                        </div>
                                        <div className="font-semibold text-xs md:text-sm mb-2">{phase.name}</div>
                                        <div className="text-[10px] text-white/40">{phase.detail}</div>

                                        {/* Mini progress */}
                                        <div className="h-0.5 bg-white/10 rounded-full overflow-hidden mt-2">
                                            <div className={`h-full transition-all duration-1000 rounded-full ${phase.status === "completed" ? "bg-green-500 w-full"
                                                : phase.status === "active" ? "bg-indigo-500 w-1/2 animate-pulse"
                                                    : "w-0"
                                                }`} />
                                        </div>
                                        {phase.status === "completed" && (
                                            <div className="absolute top-2 right-2 text-green-500"><CheckCircle2 size={12} /></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ============ MAIN CONTENT — 2 COLUMN ============ */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ─── LEFT COLUMN ─── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Project Overview */}
                    {!isConsultation && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                            <h2 className="text-sm font-bold flex items-center gap-2 mb-3 text-white/80">
                                <ShieldCheck size={16} className="text-indigo-400" />
                                {t("overview")}
                            </h2>
                            <p className="text-sm text-white/40 leading-relaxed">
                                {order.description || t("noDescription")}
                            </p>
                        </div>
                    )}

                    {/* ──── PAYMENT SECTION ──── */}
                    {!isConsultation && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                <h2 className="text-sm font-bold flex items-center gap-2 text-white/80">
                                    <CreditCard size={16} className="text-indigo-400" />
                                    {t("paymentStatus")}
                                </h2>
                                <span className="font-mono text-sm font-bold text-indigo-400">
                                    Rp {order.gross_amount?.toLocaleString("id-ID") || 0}
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* Down Payment Row */}
                                <div className={`p-4 rounded-xl border transition-all ${isDepositPaid
                                    ? "border-green-500/20 bg-green-500/5"
                                    : "border-indigo-500/20 bg-indigo-500/5"
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {isDepositPaid
                                                ? <CheckCircle2 size={16} className="text-green-400" />
                                                : <Clock size={16} className="text-indigo-400 animate-pulse" />
                                            }
                                            <span className="font-semibold text-sm">{t("downPayment")}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isDepositPaid
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                            }`}>
                                            {isDepositPaid ? t("phases.paid") : t("unpaid")}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-mono text-sm text-white/60">
                                            Rp {order.down_payment_amount?.toLocaleString("id-ID") || 0}
                                        </span>
                                        {!isDepositPaid && (
                                            <PaymentButton
                                                uuidToken={order.uuid_token}
                                                orderId={order.id}
                                                paymentType="down_payment"
                                                amount={order.down_payment_amount}
                                                onSuccess={fetchOrder}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Final Payment Row */}
                                <div className={`p-4 rounded-xl border transition-all ${isCompleted
                                    ? "border-green-500/20 bg-green-500/5"
                                    : !isDepositPaid
                                        ? "border-white/5 bg-white/[0.01] opacity-40"
                                        : "border-indigo-500/20 bg-indigo-500/5"
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {isCompleted
                                                ? <CheckCircle2 size={16} className="text-green-400" />
                                                : !isDepositPaid
                                                    ? <Lock size={16} className="text-white/30" />
                                                    : <Clock size={16} className="text-indigo-400" />
                                            }
                                            <span className="font-semibold text-sm">{t("finalPaymentStatus")}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isCompleted
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : !isDepositPaid
                                                ? "bg-white/5 text-white/30 border border-white/10"
                                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                            }`}>
                                            {isCompleted ? t("phases.paid") : !isDepositPaid ? t("phases.locked") : t("unpaid")}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="font-mono text-sm text-white/60">
                                            Rp {order.final_payment_amount?.toLocaleString("id-ID") || 0}
                                        </span>
                                        {isDepositPaid && !isCompleted && (
                                            <PaymentButton
                                                uuidToken={order.uuid_token}
                                                paymentType="final_payment"
                                                amount={order.final_payment_amount}
                                                onSuccess={fetchOrder}
                                                label="Pay Now"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──── PROGRESS + CHAT ──── */}
                    {!isConsultation && isDepositPaid && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                                <h2 className="text-sm font-bold flex items-center gap-2 text-white/80">
                                    <MessageSquare size={16} className="text-indigo-400" />
                                    {t("productionProgress")}
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Progress bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-white/40">
                                        <span>{t("completionStatus")}</span>
                                        <span className="text-white font-mono font-bold">{order.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${order.progress}%`,
                                                background: order.progress >= 100
                                                    ? "#22C55E"
                                                    : "linear-gradient(90deg, #6366f1, #06b6d4)",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Evidence Gallery */}
                                {order.evidence_links && order.evidence_links.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                                            {t("evidence")} ({order.evidence_links.length})
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {order.evidence_links.map((ev, i) => (
                                                <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer"
                                                    className="block aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-colors relative group"
                                                >
                                                    <img src={ev.url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white uppercase">{t("view")}</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Chat Accordion */}
                                <div className="border border-white/10 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setChatOpen(!chatOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={14} className="text-indigo-400" />
                                            <span className="text-sm font-semibold">{t("chatWithAdmin")}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${chatOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {chatOpen && (
                                        <div className="h-[350px] border-t border-white/5 bg-black/20">
                                            <OrderChat orderId={order.id} uuidToken={order.uuid_token} chatEnabled={order.chat_enabled} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isConsultation && (
                        <div className="rounded-2xl border border-pink-500/20 bg-white/[0.02] overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.05)]">
                            <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 backdrop-blur-md">
                                <h2 className="text-sm font-bold flex items-center gap-2 text-white">
                                    <MessageSquare size={16} className="text-pink-400" />
                                    {t("privateConsultation")}
                                </h2>
                                <p className="text-[10px] text-white/50 mt-1">
                                    {t("consultationDesc")}
                                </p>
                            </div>
                            <div className="h-[500px] border-t border-white/5 bg-[#0a0a0a]">
                                <OrderChat orderId={order.id} uuidToken={order.uuid_token} chatEnabled={true} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── RIGHT SIDEBAR ─── */}
                <div className="space-y-6">

                    {/* Quick Info Card */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">{t("projectDetails")}</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("client")}</p>
                                <p className="text-sm font-medium">{order.customer_name || "—"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("service")}</p>
                                <p className="text-sm font-medium">{order.service_type}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("totalValue")}</p>
                                <p className="text-sm font-mono font-bold text-indigo-400">
                                    Rp {order.gross_amount?.toLocaleString("id-ID") || 0}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{t("started")}</p>
                                <p className="text-sm">{new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Result Files Download */}
                    {order.result_files && order.result_files.length > 0 && (
                        <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-6">
                            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                {t("projectResults")} ({order.result_files.length} files)
                            </h3>
                            <div className="space-y-2">
                                {order.result_files.map((f: { name: string; url: string; type: string; size: number; uploadedAt: string }, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/[0.04]">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-lg bg-green-500/10">
                                            {f.type?.includes("image") ? "🖼️" : f.type?.includes("video") ? "🎬" : f.type?.includes("pdf") ? "📄" : f.type?.includes("zip") || f.type?.includes("rar") ? "📦" : "📎"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{f.name}</p>
                                            <p className="text-[10px] text-white/30">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <a href={f.url} target="_blank" rel="noopener noreferrer" download className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}>
                                            {t("download")}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Milestone Logs */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">{t("activityLog")}</h3>
                        <div className="space-y-4 relative">
                            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" />

                            {isCompleted && (
                                <div className="relative pl-5">
                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#050505]" />
                                    <div className="text-[10px] text-white/30 mb-0.5">{t("completed")}</div>
                                    <div className="text-xs text-green-400 font-medium">{t("allPaymentsSettled")}</div>
                                </div>
                            )}

                            <div className="relative pl-5">
                                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#050505]" />
                                <div className="text-[10px] text-white/30 mb-0.5">
                                    {new Date(order.updated_at).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                                </div>
                                <div className="text-xs text-white/70">{t("latestUpdateLogged")}</div>
                            </div>

                            {isDepositPaid && (
                                <div className="relative pl-5">
                                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-green-500/60 border-2 border-[#050505]" />
                                    <div className="text-[10px] text-white/30 mb-0.5">{t("payment")}</div>
                                    <div className="text-xs text-white/50">{t("downPaymentReceived")}</div>
                                </div>
                            )}

                            <div className="relative pl-5">
                                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-[#050505]" />
                                <div className="text-[10px] text-white/30 mb-0.5">
                                    {new Date(order.created_at).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                                </div>
                                <div className="text-xs text-white/50">{t("projectInitiated")}</div>
                            </div>
                        </div>
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
            </div>
        </main>
    );
}
