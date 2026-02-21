"use client";
import { useEffect, useState, useCallback } from "react";
import PaymentButton from "@/components/PaymentButton";
import OrderChat from "@/components/OrderChat";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Circle, Lock, MessageSquare, CreditCard, FileImage, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
    uuid_token: string;
    chat_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export default function OrderPage() {
    const params = useParams();
    const uuid = params?.uuid as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

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
            }, () => {
                fetchOrder();
            })
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

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" /></div>;
    if (error || !order) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">{error || "Order not found"}</div>;

    // Phase Logic
    const isDepositPaid = order.down_payment_status === "paid";
    const isProductionActive = isDepositPaid && order.final_payment_status !== "paid";
    const isReviewActive = isProductionActive && (order.evidence_links?.length > 0 || order.progress >= 80);
    const isFinalPaymentActive = isDepositPaid && order.final_payment_status !== "paid";
    const isCompleted = order.final_payment_status === "paid";

    const Step = ({ title, status, icon: Icon, children, active, completed }: any) => (
        <div className={`relative pl-12 pb-12 last:pb-0 ${active || completed ? "opacity-100" : "opacity-40 grayscale"}`}>
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/10" />

            {/* Icon Bubble */}
            <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${completed ? "bg-green-500 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]" :
                active ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]" :
                    "bg-[#0A0A0A] border-white/10 text-white/30"
                }`}>
                {completed ? <CheckCircle2 size={18} /> : <Icon size={18} />}
            </div>

            {/* Content Card */}
            <div className={`rounded-2xl border transition-all duration-300 ${active ? "bg-white/[0.03] border-indigo-500/30 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/10" :
                "bg-transparent border-white/5"
                }`}>
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h3 className={`font-bold text-lg ${active || completed ? "text-white" : "text-white/40"}`}>{title}</h3>
                    {status && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${status === "completed" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            status === "active" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse" :
                                "bg-white/5 text-white/30 border border-white/10"
                            }`}>
                            {status}
                        </span>
                    )}
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 bg-[#050505] text-white">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white mb-2 transition-colors">
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
                            Order #{order.order_number}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{order.service_type} Project</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <div className="flex justify-end gap-3 mb-1">
                            <button
                                onClick={() => window.open(`/public/dashboard/${order.uuid_token}`, "_blank")}
                                className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                            >
                                <FileImage size={12} />
                                Public View
                            </button>
                            <button
                                onClick={handleSyncStatus}
                                disabled={loading}
                                className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                                Sync Status
                            </button>
                        </div>
                        <div className="text-xl font-bold font-mono text-indigo-400">Rp {order.gross_amount.toLocaleString("id-ID")}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    {/* Phase 1: Deposit */}
                    <Step
                        title="Phase 1: Deposit (20%)"
                        status={isDepositPaid ? "completed" : "active"}
                        icon={CreditCard}
                        active={!isDepositPaid}
                        completed={isDepositPaid}
                    >
                        {isDepositPaid ? (
                            <div className="flex items-center gap-3 text-green-400">
                                <CheckCircle2 size={20} />
                                <span className="font-medium">Down Payment Received</span>
                                <span className="text-sm text-white/40 ml-auto">Rp {order.down_payment_amount.toLocaleString("id-ID")}</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-400">Please complete the down payment to start the project.</p>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                                    <span className="font-mono font-bold text-lg">Rp {order.down_payment_amount.toLocaleString("id-ID")}</span>
                                    <PaymentButton
                                        uuidToken={order.uuid_token}
                                        orderId={order.id}
                                        paymentType="down_payment"
                                        amount={order.down_payment_amount}
                                        onSuccess={fetchOrder}
                                    />
                                </div>
                            </div>
                        )}
                    </Step>

                    {/* Phase 2: Production */}
                    <Step
                        title="Phase 2: Production"
                        status={isCompleted ? "completed" : isDepositPaid ? "active" : "locked"}
                        icon={MessageSquare}
                        active={isDepositPaid && !isCompleted}
                        completed={isCompleted}
                    >
                        {!isDepositPaid ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Lock size={16} />
                                <span className="text-sm">Locked until deposit is paid</span>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <p className="text-sm text-gray-400">Discuss requirements and track progress directly with the admin.</p>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Completion Status</span>
                                        <span className="text-white">{order.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${order.progress}%` }} />
                                    </div>
                                </div>

                                {/* Chat Embed */}
                                <div className="h-[400px] border border-white/10 rounded-xl overflow-hidden bg-black/20">
                                    <OrderChat orderId={order.id} uuidToken={order.uuid_token} chatEnabled={order.chat_enabled} />
                                </div>
                            </div>
                        )}
                    </Step>

                    {/* Phase 3: Final Review */}
                    <Step
                        title="Phase 3: Final Review"
                        status={isCompleted ? "completed" : isReviewActive ? "active" : "pending"}
                        icon={FileImage}
                        active={isReviewActive && !isCompleted}
                        completed={isCompleted}
                    >
                        {order.evidence_links && order.evidence_links.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {order.evidence_links.map((ev, i) => (
                                    <a key={i} href={ev.url} target="_blank" rel="noopener noreferrer" className="block aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-colors relative group">
                                        <img src={ev.url} alt="Evidence" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">View</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No evidence uploaded yet. Waiting for production milestones...</p>
                        )}
                    </Step>

                    {/* Phase 4: Final Payment */}
                    <Step
                        title="Phase 4: Final Payment (80%)"
                        status={isCompleted ? "completed" : "pending"}
                        icon={CreditCard}
                        active={!isCompleted && isDepositPaid} // Always visible if deposit paid, but maybe highlight when ready?
                        completed={isCompleted}
                    >
                        {isCompleted ? (
                            <div className="flex items-center gap-3 text-green-400">
                                <CheckCircle2 size={20} />
                                <span className="font-medium">All Payments Completed</span>
                                <span className="text-sm text-white/40 ml-auto">Rp {order.final_payment_amount.toLocaleString("id-ID")}</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-400">Pay the remaining balance to receive final high-quality files.</p>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                                    <span className="font-mono font-bold text-lg">Rp {order.final_payment_amount.toLocaleString("id-ID")}</span>
                                    {isDepositPaid ? (
                                        <PaymentButton
                                            uuidToken={order.uuid_token}
                                            paymentType="final_payment"
                                            amount={order.final_payment_amount}
                                            onSuccess={fetchOrder}
                                            label="Pay Now"
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-500 flex items-center gap-1"><Lock size={12} /> Locked</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </Step>
                </div>
            </div>
        </main>
    );
}
