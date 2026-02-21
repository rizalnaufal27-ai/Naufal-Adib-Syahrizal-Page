"use client";
import { useState } from "react";

declare global {
    interface Window {
        snap?: {
            pay: (token: string, options: {
                onSuccess?: (result: Record<string, unknown>) => void;
                onPending?: (result: Record<string, unknown>) => void;
                onError?: (result: Record<string, unknown>) => void;
                onClose?: () => void;
            }) => void;
        };
    }
}

interface PaymentButtonProps {
    uuidToken: string;
    orderId?: string;
    paymentType: "down_payment" | "final_payment";
    amount: number;
    disabled?: boolean;
    onSuccess?: () => void;
    label?: string;
}

export default function PaymentButton({
    uuidToken,
    orderId,
    paymentType,
    amount,
    disabled = false,
    onSuccess,
    label,
}: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payment/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uuid_token: uuidToken, payment_type: paymentType }),
            });

            const data = await res.json();

            if (!data.success || !data.token) {
                alert(data.error || "Failed to create payment");
                return;
            }

            if (data.bypass) {
                if (paymentType === "down_payment" && orderId) {
                    try {
                        await fetch("/api/orders/toggle-chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ order_id: orderId, enabled: true }),
                        });
                    } catch { /* ignore */ }
                }
                onSuccess?.();
                if (data.redirect_url) window.location.href = data.redirect_url;
                return;
            }

            // Try Snap popup first, fall back to redirect
            if (window.snap) {
                window.snap.pay(data.token, {
                    onSuccess: async () => {
                        // Auto-enable chat on successful down payment
                        if (paymentType === "down_payment" && orderId) {
                            try {
                                await fetch("/api/orders/toggle-chat", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ order_id: orderId, enabled: true }),
                                });
                            } catch { /* ignore */ }
                        }
                        onSuccess?.();
                    },
                    onPending: () => {
                        alert("Payment pending. Please complete your payment.");
                    },
                    onError: () => {
                        alert("Payment failed. Please try again.");
                    },
                    onClose: () => {
                        // User closed without completing
                    },
                });
            } else if (data.redirect_url) {
                // Fallback: Snap.js not loaded (deployed host), redirect instead
                window.location.href = data.redirect_url;
            } else {
                alert("Payment system is loading. Please try again in a moment.");
            }
        } catch {
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isDown = paymentType === "down_payment";
    const buttonLabel = label || (isDown ? `Pay Down Payment — Rp ${amount.toLocaleString("id-ID")}` : `Pay Final — Rp ${amount.toLocaleString("id-ID")}`);

    return (
        <button
            onClick={handlePay}
            disabled={disabled || loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 relative z-50"
            style={{
                background: isDown
                    ? "linear-gradient(135deg, #22C55E, #16A34A)"
                    : "linear-gradient(135deg, #3B82F6, #2563EB)",
                boxShadow: disabled ? "none" : isDown
                    ? "0 8px 24px rgba(34,197,94,0.2)"
                    : "0 8px 24px rgba(37,99,235,0.2)",
            }}
        >
            {loading ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
            ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
            )}
            {loading ? "Processing..." : buttonLabel}
        </button>
    );
}
