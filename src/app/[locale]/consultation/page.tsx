"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, MessageCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ConsultationPage() {
    const router = useRouter();
    const t = useTranslations("ConsultationPage");
    const [form, setForm] = useState({ name: "", email: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_name: form.name,
                    customer_email: form.email,
                    description: form.description
                }),
            });
            const data = await res.json();

            if (data.success && data.uuid_token) {
                router.push(`/order/${data.uuid_token}`);
            } else {
                setError(data.error || "Failed to start consultation");
                setLoading(false);
            }
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#050505" }}>
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> {t("back")}
                </button>

                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-indigo-500/20 flex items-center justify-center mb-6 border border-white/[0.05]">
                        <MessageCircle className="text-pink-400" size={32} />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        {t("title")} <Sparkles className="text-yellow-400" size={20} />
                    </h1>
                    <p className="text-white/40 text-sm mb-8 leading-relaxed">
                        {t("description")}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{t("nameLabel")}</label>
                            <input
                                required
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder={t("namePlaceholder")}
                                className="w-full px-4 py-3 rounded-xl text-sm bg-black/40 border border-white/[0.08] outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 text-white placeholder:text-white/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{t("emailLabel")}</label>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder={t("emailPlaceholder")}
                                className="w-full px-4 py-3 rounded-xl text-sm bg-black/40 border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder:text-white/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{t("ideaLabel")} ({t("optional")})</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder={t("ideaPlaceholder")}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl text-sm bg-black/40 border border-white/[0.08] outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 text-white placeholder:text-white/20 transition-all resize-none"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-400 text-center animate-pulse py-2">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                            style={{ background: "linear-gradient(135deg, #EC4899, #8B5CF6)" }}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t("startChat")}
                                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
