"use client";
import { useState, useCallback } from "react";
import PricingCalculator from "@/components/pricing/PricingCalculator";
import { usePricingStore } from "@/store/pricing-store";

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "pricing" | "details" | "review" | "success";

export default function OrderFormModal({ isOpen, onClose }: OrderFormModalProps) {
    const [step, setStep] = useState<Step>("pricing");
    const [totalUSD, setTotalUSD] = useState(0);
    const [serviceLabel, setServiceLabel] = useState("");
    const [form, setForm] = useState({ name: "", email: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderResult, setOrderResult] = useState<{ uuid_token: string; order_number: number; down_payment_amount: number } | null>(null);

    const pricing = usePricingStore();

    const handlePriceCalculated = useCallback((usd: number, label: string) => {
        setTotalUSD(usd);
        setServiceLabel(label);
    }, []);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const totalIDR = totalUSD * pricing.rate;
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_name: form.name,
                    customer_email: form.email,
                    service_type: serviceLabel,
                    description: form.description,
                    gross_amount: totalIDR,
                    estimated_days: 7, // Default estimation
                    pricing_details: usePricingStore.getState(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create order");
            setOrderResult(data.order);
            setStep("success");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
        setLoading(false);
    };

    const handleClose = () => {
        setStep("pricing");
        setForm({ name: "", email: "", description: "" });
        setError("");
        setOrderResult(null);
        pricing.reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <div
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl relative"
                style={{ background: "rgba(10,10,10,0.95)", border: "1px solid var(--color-border)", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 p-5 flex items-center justify-between" style={{ background: "rgba(10,10,10,0.98)", borderBottom: "1px solid var(--color-border)" }}>
                    <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                        {step === "pricing" && "Choose Service"}
                        {step === "details" && "Your Details"}
                        {step === "review" && "Review Order"}
                        {step === "success" && "Order Placed! 🎉"}
                    </h2>
                    <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: "var(--color-text-muted)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Step Indicator */}
                {step !== "success" && (
                    <div className="px-5 pt-4 flex gap-2">
                        {(["pricing", "details", "review"] as Step[]).map((s, i) => (
                            <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{
                                background: (["pricing", "details", "review"].indexOf(step) >= i) ? "#6366F1" : "rgba(255,255,255,0.06)",
                            }} />
                        ))}
                    </div>
                )}

                <div className="p-5">
                    {/* STEP 1: Pricing Calculator */}
                    {step === "pricing" && (
                        <>
                            <PricingCalculator onPriceCalculated={handlePriceCalculated} />
                            {(totalUSD > 0 || process.env.NEXT_PUBLIC_APP_MODE === "test") && (
                                <button
                                    onClick={() => setStep("details")}
                                    className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                                    style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
                                >
                                    Continue → Enter Details
                                </button>
                            )}
                        </>
                    )}

                    {/* STEP 2: Customer Details */}
                    {step === "details" && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Full Name</label>
                                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Email</label>
                                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--color-text-muted)" }}>Project Description</label>
                                <textarea rows={4} value={form.description} onChange={(e) => handleChange("description", e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500/30"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep("pricing")} className="px-6 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>← Back</button>
                                <button onClick={() => { if (form.name && form.email) setStep("review"); }}
                                    disabled={!form.name || !form.email}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
                                    style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>
                                    Review Order →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Review */}
                    {step === "review" && (
                        <div className="space-y-4">
                            <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border)" }}>
                                <Row label="Service" value={serviceLabel} />
                                <Row label="Estimated Price" value={pricing.formatPrice(totalUSD)} bold />
                                <Row label="Name" value={form.name} />
                                <Row label="Email" value={form.email} />
                                {form.description && <Row label="Description" value={form.description} />}
                            </div>

                            <div className="rounded-xl p-4" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
                                <div className="text-xs space-y-1" style={{ color: "var(--color-text-muted)" }}>
                                    <p>🔹 Down payment (20%): <strong style={{ color: "#6366F1" }}>{pricing.formatPrice(Math.ceil(totalUSD * 0.2))}</strong></p>
                                    <p>🔹 Final payment (80%): <strong style={{ color: "var(--color-text)" }}>{pricing.formatPrice(Math.ceil(totalUSD * 0.8))}</strong></p>
                                </div>
                            </div>

                            {error && <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>{error}</div>}

                            <div className="flex gap-3">
                                <button onClick={() => setStep("details")} className="px-6 py-3 rounded-xl text-sm font-medium" style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>← Back</button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                                    style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>
                                    {loading ? "Placing Order..." : "Place Order 🚀"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Success */}
                    {step === "success" && orderResult && (
                        <div className="text-center space-y-5 py-6">
                            <div className="text-5xl">🎉</div>
                            <div>
                                <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Order #{orderResult.order_number} Created</p>
                                <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Check your email for the receipt and payment link.</p>
                            </div>
                            <div className="rounded-xl p-4 text-left" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border)" }}>
                                <p className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Your private order link:</p>
                                <div className="flex gap-2 items-center">
                                    <code className="flex-1 text-xs p-2 rounded-lg overflow-x-auto" style={{ background: "rgba(0,0,0,0.3)", color: "#6366F1" }}>
                                        {typeof window !== "undefined" ? `${window.location.origin}/order/${orderResult.uuid_token}` : ""}
                                    </code>
                                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/order/${orderResult.uuid_token}`)}
                                        className="px-3 py-2 rounded-lg text-xs whitespace-nowrap relative z-50" style={{ background: "rgba(99,102,241,0.1)", color: "#6366F1" }}>
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => window.open(`/order/${orderResult.uuid_token}`, "_blank")}
                                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                                    style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
                                >
                                    Open Project Page ↗
                                </button>
                                <button onClick={handleClose} className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                                    style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
    return (
        <div className="flex justify-between text-sm">
            <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
            <span style={{ color: bold ? "#6366F1" : "var(--color-text)", fontWeight: bold ? 700 : 400 }}>{value}</span>
        </div>
    );
}
