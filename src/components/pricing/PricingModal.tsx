"use client";
import { useState, useEffect } from "react";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = "design" | "illustration" | "photo" | "video";

function useCurrency() {
    const [currency, setCurrency] = useState<"USD" | "IDR">("USD");
    const [rate, setRate] = useState(1);

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz && tz.toLowerCase().includes("jakarta")) {
                setCurrency("IDR");
                setRate(15500);
            }
        } catch { /* fallback USD */ }
    }, []);

    const format = (usd: number) => {
        if (currency === "IDR") {
            return `Rp ${(usd * rate).toLocaleString("id-ID")}`;
        }
        return `$${usd}`;
    };

    return { currency, format };
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [tab, setTab] = useState<Tab>("design");
    const { format } = useCurrency();

    // Graphic Design state
    const [selectedDesign, setSelectedDesign] = useState<string[]>([]);

    // Illustration state
    const [charCount, setCharCount] = useState(1);
    const [illusType, setIllusType] = useState<"half" | "full" | "render">("half");

    // Photography state
    const [location, setLocation] = useState("");
    const [isJabodetabek, setIsJabodetabek] = useState<boolean | null>(null);
    const [addRaw, setAddRaw] = useState(false);
    const [editComplexity, setEditComplexity] = useState(3);
    const [photoMode, setPhotoMode] = useState<"package" | "edit">("package");

    // Video state
    const [videoDuration, setVideoDuration] = useState(5);
    const [videoComplexity, setVideoComplexity] = useState<"low" | "med" | "high">("low");
    const [gdriveLink, setGdriveLink] = useState("");
    const [videoBrief, setVideoBrief] = useState("");

    const jabodetabekAreas = ["jakarta", "bogor", "depok", "tangerang", "bekasi", "jabodetabek"];

    const checkLocation = (loc: string) => {
        setLocation(loc);
        const lower = loc.toLowerCase();
        setIsJabodetabek(jabodetabekAreas.some((a) => lower.includes(a)));
    };

    const toggleDesign = (item: string) => {
        setSelectedDesign((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const getDesignTotal = () => {
        let total = 0;
        if (selectedDesign.includes("logo")) total += 5;
        if (selectedDesign.includes("banner")) total += 5;
        if (selectedDesign.includes("poster")) total += 5;
        if (selectedDesign.includes("brand")) total += 20;
        return total;
    };

    const illusPrices = { half: 5, full: 8, render: 12 };
    const getIllusTotal = () => illusPrices[illusType] * charCount;

    const getVideoBase = () => {
        const base = { low: 10, med: 30, high: 50 };
        return base[videoComplexity];
    };
    const getVideoTotal = () => {
        const base = getVideoBase();
        const overtime = Math.max(0, videoDuration - 10) * 2;
        return base + overtime;
    };

    if (!isOpen) return null;

    const tabs: { key: Tab; label: string }[] = [
        { key: "design", label: "Graphic Design" },
        { key: "illustration", label: "Illustration" },
        { key: "photo", label: "Photography" },
        { key: "video", label: "Video Editing" },
    ];

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                style={{
                    background: "rgba(10,10,10,0.98)",
                    border: "1px solid var(--color-border)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                        <span className="gradient-text">Pricing Calculator</span>
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full" style={{ color: "var(--color-text-muted)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-2 mx-6 mt-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className="flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all duration-300"
                            style={{
                                background: tab === t.key ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "transparent",
                                color: tab === t.key ? "#fff" : "var(--color-text-muted)",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* GRAPHIC DESIGN */}
                    {tab === "design" && (
                        <div className="space-y-4">
                            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Select services:</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: "logo", label: "Logo Design", price: 5 },
                                    { id: "bookCover", label: "Book Cover", price: 5 },
                                    { id: "banner", label: "Banner Design", price: 5 },
                                    { id: "poster", label: "Poster Design", price: 5 },
                                    { id: "brand", label: "Brand Identity Package", price: 20 },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => toggleDesign(item.id)}
                                        className="glass-card p-4 text-left transition-all duration-300"
                                        style={{
                                            borderColor: selectedDesign.includes(item.id)
                                                ? "var(--color-primary)"
                                                : "var(--color-border)",
                                            background: selectedDesign.includes(item.id)
                                                ? "rgba(59,130,246,0.08)"
                                                : "var(--color-bg-glass)",
                                        }}
                                    >
                                        <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{item.label}</p>
                                        <p className="text-xs mt-1" style={{ color: "var(--color-primary)" }}>{format(item.price)}</p>
                                    </button>
                                ))}
                            </div>
                            {selectedDesign.length > 0 && (
                                <div className="glass-card p-4 flex justify-between items-center">
                                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Total</span>
                                    <span className="text-lg font-bold gradient-text">{format(getDesignTotal())}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ILLUSTRATION */}
                    {tab === "illustration" && (
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>Type</label>
                                <div className="flex gap-2">
                                    {([
                                        { key: "half" as const, label: "Half Body", price: 5 },
                                        { key: "full" as const, label: "Full Body", price: 8 },
                                        { key: "render" as const, label: "Full Render", price: 12 },
                                    ]).map((t) => (
                                        <button
                                            key={t.key}
                                            onClick={() => setIllusType(t.key)}
                                            className="flex-1 py-3 rounded-xl text-xs font-medium transition-all duration-300"
                                            style={{
                                                background: illusType === t.key ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "var(--color-bg-glass)",
                                                color: illusType === t.key ? "#fff" : "var(--color-text-muted)",
                                                border: `1px solid ${illusType === t.key ? "var(--color-primary)" : "var(--color-border)"}`,
                                            }}
                                        >
                                            {t.label}<br />{format(t.price)}/char
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                                    Number of Characters: <strong style={{ color: "var(--color-text)" }}>{charCount}</strong>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={charCount}
                                    onChange={(e) => setCharCount(Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                            <div className="glass-card p-4 flex justify-between items-center">
                                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Total ({charCount} characters)</span>
                                <span className="text-lg font-bold gradient-text">{format(getIllusTotal())}</span>
                            </div>
                        </div>
                    )}

                    {/* PHOTOGRAPHY */}
                    {tab === "photo" && (
                        <div className="space-y-5">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPhotoMode("package")}
                                    className="flex-1 py-3 rounded-xl text-xs font-medium transition-all"
                                    style={{
                                        background: photoMode === "package" ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "var(--color-bg-glass)",
                                        color: photoMode === "package" ? "#fff" : "var(--color-text-muted)",
                                        border: `1px solid ${photoMode === "package" ? "var(--color-primary)" : "var(--color-border)"}`,
                                    }}
                                >
                                    📸 Photography Package
                                </button>
                                <button
                                    onClick={() => setPhotoMode("edit")}
                                    className="flex-1 py-3 rounded-xl text-xs font-medium transition-all"
                                    style={{
                                        background: photoMode === "edit" ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "var(--color-bg-glass)",
                                        color: photoMode === "edit" ? "#fff" : "var(--color-text-muted)",
                                        border: `1px solid ${photoMode === "edit" ? "var(--color-primary)" : "var(--color-border)"}`,
                                    }}
                                >
                                    🖌️ Edit Photo Only
                                </button>
                            </div>

                            {photoMode === "package" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>Your Location</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => checkLocation(e.target.value)}
                                            placeholder="e.g. Jakarta, Depok, Tangerang..."
                                            className="w-full px-4 py-3 rounded-xl text-sm"
                                            style={{
                                                background: "var(--color-bg-glass)",
                                                border: "1px solid var(--color-border)",
                                                color: "var(--color-text)",
                                                outline: "none",
                                            }}
                                        />
                                    </div>
                                    {isJabodetabek === true && (
                                        <div className="space-y-3">
                                            <div className="glass-card p-4" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                                                <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>✓ Service available in your area!</p>
                                                <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Free consultation included.</p>
                                            </div>
                                            <div className="glass-card p-4">
                                                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Graduation / Product Package</p>
                                                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>2 Hours Session</p>
                                                <p className="text-lg font-bold gradient-text mt-2">{format(20)}</p>
                                            </div>
                                            <label className="flex items-center gap-3 glass-card p-4 cursor-pointer">
                                                <input type="checkbox" checked={addRaw} onChange={(e) => setAddRaw(e.target.checked)} className="accent-blue-500" />
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Add RAW Files</p>
                                                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>+{format(5)} extra</p>
                                                </div>
                                            </label>
                                            <div className="glass-card p-4 flex justify-between items-center">
                                                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Total</span>
                                                <span className="text-lg font-bold gradient-text">{format(20 + (addRaw ? 5 : 0))}</span>
                                            </div>
                                        </div>
                                    )}
                                    {isJabodetabek === false && (
                                        <div className="glass-card p-6 text-center" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                                            <p className="text-3xl mb-3">🚫</p>
                                            <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>Service Unavailable in Your Area</p>
                                            <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                                                Photography packages are only available in the Jabodetabek region.
                                                Try our &quot;Edit Photo Only&quot; service instead!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {photoMode === "edit" && (
                                <div className="space-y-4">
                                    <div className="glass-card p-4" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                                        <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>🌍 Available Globally</p>
                                    </div>
                                    <div>
                                        <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                                            Edit Complexity: <strong style={{ color: "var(--color-text)" }}>{format(editComplexity)}</strong>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={editComplexity}
                                            onChange={(e) => setEditComplexity(Number(e.target.value))}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                                            <span>Simple</span><span>Complex</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIDEO EDITING */}
                    {tab === "video" && (
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>
                                    Final Duration: <strong style={{ color: "var(--color-text)" }}>{videoDuration} min</strong>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    value={videoDuration}
                                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>Complexity</label>
                                <div className="flex gap-2">
                                    {([
                                        { key: "low" as const, label: "Low", price: "$10" },
                                        { key: "med" as const, label: "Medium", price: "$30" },
                                        { key: "high" as const, label: "High", price: "$50" },
                                    ]).map((c) => (
                                        <button
                                            key={c.key}
                                            onClick={() => setVideoComplexity(c.key)}
                                            className="flex-1 py-3 rounded-xl text-xs font-medium transition-all"
                                            style={{
                                                background: videoComplexity === c.key ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" : "var(--color-bg-glass)",
                                                color: videoComplexity === c.key ? "#fff" : "var(--color-text-muted)",
                                                border: `1px solid ${videoComplexity === c.key ? "var(--color-primary)" : "var(--color-border)"}`,
                                            }}
                                        >
                                            {c.label}<br /><span className="opacity-70">{c.price} base</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>Google Drive Link (Source Material)</label>
                                <input
                                    type="url"
                                    value={gdriveLink}
                                    onChange={(e) => setGdriveLink(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-4 py-3 rounded-xl text-sm"
                                    style={{ background: "var(--color-bg-glass)", border: "1px solid var(--color-border)", color: "var(--color-text)", outline: "none" }}
                                />
                            </div>
                            <div>
                                <label className="text-sm mb-2 block" style={{ color: "var(--color-text-muted)" }}>Brief / Description</label>
                                <textarea
                                    value={videoBrief}
                                    onChange={(e) => setVideoBrief(e.target.value)}
                                    placeholder="Describe your video project..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                    style={{ background: "var(--color-bg-glass)", border: "1px solid var(--color-border)", color: "var(--color-text)", outline: "none" }}
                                />
                            </div>
                            <div className="glass-card p-4 space-y-2">
                                <div className="flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
                                    <span>Base ({videoComplexity})</span><span>{format(getVideoBase())}</span>
                                </div>
                                {videoDuration > 10 && (
                                    <div className="flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
                                        <span>Overtime ({videoDuration - 10} min × $2)</span><span>{format((videoDuration - 10) * 2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2" style={{ borderTop: "1px solid var(--color-border)" }}>
                                    <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Total</span>
                                    <span className="text-lg font-bold gradient-text">{format(getVideoTotal())}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact CTA */}
                    <div className="mt-6 flex gap-3">
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary flex-1 text-center"
                        >
                            Order via WhatsApp
                        </a>
                        <a
                            href="mailto:naufaladib@gmail.com"
                            className="btn-outline flex-1 text-center"
                        >
                            Email Quote
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
