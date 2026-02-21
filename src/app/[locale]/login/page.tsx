"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const { signIn, signUp } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (mode === "login") {
                await signIn(email, password);
                router.push("/");
            } else {
                await signUp(email, password, fullName);
                setSuccess("Account created! Check your email to verify, then login.");
                setMode("login");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <div style={{ background: "#050505", minHeight: "100vh" }} className="flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => router.push("/")} className="text-2xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">
                        Naufal Adib<span className="text-white/40">.</span>
                    </button>
                    <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
                        {mode === "login" ? "Sign in to your account" : "Create a new account"}
                    </p>
                </div>

                {/* Form Card */}
                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--color-border)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === "register" && (
                            <div>
                                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.2)" }}>
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                            style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
                        >
                            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
                            className="text-xs font-medium transition-colors hover:text-indigo-400"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            {mode === "login" ? "Don't have an account? Register" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <button onClick={() => router.push("/")} className="text-xs hover:text-white transition-colors" style={{ color: "var(--color-text-muted)" }}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
