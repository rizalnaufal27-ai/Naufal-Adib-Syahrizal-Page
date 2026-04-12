"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = "design" | "illustration" | "web" | "photo" | "video";

function useCurrency() {
    const [currency] = useState<"USD" | "IDR">("USD");
    const [rate] = useState(15500);

    const format = (usd: number) => {
        if (currency === "IDR") return `Rp ${(usd * rate).toLocaleString("id-ID")}`;
        return `$${usd}`;
    };

    return { currency, format };
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    const [tab, setTab] = useState<Tab>("design");
    const { format } = useCurrency();

    // Graphic Design state
    const [selectedDesign, setSelectedDesign] = useState<string[]>([]);
    const toggleDesign = (item: string) => setSelectedDesign((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
    const getDesignTotal = () => {
        let total = 0;
        if (selectedDesign.includes("logo")) total += 15;
        if (selectedDesign.includes("banner")) total += 10;
        if (selectedDesign.includes("poster")) total += 10;
        if (selectedDesign.includes("brand")) total += 50;
        return total;
    };

    // Illustration state
    const [charCount, setCharCount] = useState(1);
    const [illusType, setIllusType] = useState<"half" | "full" | "render">("half");
    const illusPrices = { half: 15, full: 25, render: 40 };
    const getIllusTotal = () => illusPrices[illusType] * charCount;

    // Web UI/UX state
    const [webScale, setWebScale] = useState<"small" | "medium" | "large">("small");
    const webPrices = { small: 50, medium: 150, large: 300 }; // small = LP, medium = Dashboard, large = Full profile/complex
    const [webWireframeOnly, setWebWireframeOnly] = useState(false);
    const getWebTotal = () => {
        const base = webPrices[webScale];
        return webWireframeOnly ? Math.floor(base * 0.4) : base;
    };

    // Photography state
    const [addRaw, setAddRaw] = useState(false);
    const [photoHours, setPhotoHours] = useState(2);
    const getPhotoTotal = () => (photoHours * 15) + (addRaw ? 20 : 0);

    // Video state
    const [vidDuration, setVidDuration] = useState(1);
    const [vidGrade, setVidGrade] = useState<"standard" | "color_graded">("standard");
    const getVidTotal = () => (vidDuration * 20) + (vidGrade === "color_graded" ? 30 : 0);

    if (!isOpen) return null;

    const tabs: { key: Tab; label: string }[] = [
        { key: "design", label: "Graphic" },
        { key: "illustration", label: "Illustration" },
        { key: "web", label: "UI/UX" },
        { key: "photo", label: "Photo" },
        { key: "video", label: "Video" },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/[0.05] shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/[0.05] px-8 py-5 flex items-center justify-between z-10">
                        <h2 className="text-xl font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            A-La-Carte Pricing
                        </h2>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/[0.05] overflow-x-auto hide-scrollbar">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-6 py-4 text-sm font-medium tracking-wide transition-colors whitespace-nowrap border-b-2 ${tab === t.key ? "text-white border-white" : "text-neutral-500 border-transparent hover:text-neutral-300"}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Body */}
                    <div className="p-8">
                        {/* GRAPHIC DESIGN */}
                        {tab === "design" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { id: "logo", label: "Logo Design", price: 15 },
                                        { id: "banner", label: "Banner / Social Media", price: 10 },
                                        { id: "poster", label: "Poster / Print", price: 10 },
                                        { id: "brand", label: "Full Brand Identity", price: 50 },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleDesign(item.id)}
                                            className={`p-5 text-left border transition-all ${selectedDesign.includes(item.id) ? "border-white bg-white/5" : "border-white/[0.05] bg-transparent hover:border-white/20"}`}
                                        >
                                            <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                                            <p className="text-xs text-neutral-400">{format(item.price)}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-white/[0.05]">
                                    <span className="text-sm text-neutral-500 uppercase tracking-widest">Est. Total</span>
                                    <span className="text-2xl font-bold text-white">{format(getDesignTotal())}</span>
                                </div>
                            </div>
                        )}

                        {/* ILLUSTRATION */}
                        {tab === "illustration" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-4 block">Render Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { key: "half" as const, label: "Half Body", price: 15 },
                                            { key: "full" as const, label: "Full Body", price: 25 },
                                            { key: "render" as const, label: "Full Render", price: 40 },
                                        ].map((t) => (
                                            <button
                                                key={t.key}
                                                onClick={() => setIllusType(t.key)}
                                                className={`p-4 text-center border transition-all ${illusType === t.key ? "border-white bg-white/5" : "border-white/[0.05] bg-transparent hover:border-white/20"}`}
                                            >
                                                <span className="block text-sm font-semibold text-white mb-1">{t.label}</span>
                                                <span className="text-xs text-neutral-500">{format(t.price)}/char</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-4 flex justify-between">
                                        <span>Characters / Figures</span>
                                        <span className="text-white font-bold">{charCount}</span>
                                    </label>
                                    <input type="range" min="1" max="10" value={charCount} onChange={(e) => setCharCount(Number(e.target.value))} className="w-full accent-white" />
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-white/[0.05]">
                                    <span className="text-sm text-neutral-500 uppercase tracking-widest">Est. Total</span>
                                    <span className="text-2xl font-bold text-white">{format(getIllusTotal())}</span>
                                </div>
                            </div>
                        )}

                        {/* UI/UX WEB DESIGN */}
                        {tab === "web" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-4 block">Project Scale</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { key: "small" as const, label: "Small / Landing", desc: "Single page focused on conversion." },
                                            { key: "medium" as const, label: "Medium / SaaS", desc: "Multi-page or Dashboard interfaces." },
                                            { key: "large" as const, label: "Large / Corporate", desc: "Extensive design systems & portals." },
                                        ].map((s) => (
                                            <button
                                                key={s.key}
                                                onClick={() => setWebScale(s.key)}
                                                className={`p-4 text-left border transition-all ${webScale === s.key ? "border-white bg-white/5" : "border-white/[0.05] bg-transparent hover:border-white/20"}`}
                                            >
                                                <span className="block text-sm font-semibold text-white mb-2">{s.label}</span>
                                                <span className="text-xs text-neutral-500 leading-relaxed">{s.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-4 p-4 border border-white/[0.05] cursor-pointer hover:bg-white/[0.02]">
                                    <input type="checkbox" checked={webWireframeOnly} onChange={(e) => setWebWireframeOnly(e.target.checked)} className="accent-white w-4 h-4" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Wireframe / Lo-Fi Only</p>
                                        <p className="text-xs text-neutral-500">I just need the structure, no hi-fi visuals. (-60% cost)</p>
                                    </div>
                                </label>
                                <div className="flex justify-between items-center py-4 border-t border-white/[0.05]">
                                    <span className="text-sm text-neutral-500 uppercase tracking-widest">Est. Total</span>
                                    <span className="text-2xl font-bold text-white">{format(getWebTotal())}</span>
                                </div>
                            </div>
                        )}

                        {/* PHOTOGRAPHY */}
                        {tab === "photo" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="p-4 border border-white/[0.05] bg-white/[0.02] text-sm text-neutral-400">
                                    <span className="text-white font-medium block mb-1">Location Notice:</span>
                                    Photography sessions are currently limited to the Jabodetabek (Jakarta) region.
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-4 flex justify-between">
                                        <span>Duration (Hours)</span>
                                        <span className="text-white font-bold">{photoHours}h</span>
                                    </label>
                                    <input type="range" min="1" max="8" value={photoHours} onChange={(e) => setPhotoHours(Number(e.target.value))} className="w-full accent-white" />
                                </div>
                                <label className="flex items-center gap-4 p-4 border border-white/[0.05] cursor-pointer hover:bg-white/[0.02]">
                                    <input type="checkbox" checked={addRaw} onChange={(e) => setAddRaw(e.target.checked)} className="accent-white w-4 h-4" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">Provide RAW Files</p>
                                        <p className="text-xs text-neutral-500">Includes all unedited photos from the session (+{format(20)})</p>
                                    </div>
                                </label>
                                <div className="flex justify-between items-center py-4 border-t border-white/[0.05]">
                                    <span className="text-sm text-neutral-500 uppercase tracking-widest">Est. Total</span>
                                    <span className="text-2xl font-bold text-white">{format(getPhotoTotal())}</span>
                                </div>
                            </div>
                        )}

                        {/* VIDEO EDITING */}
                        {tab === "video" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-4 block">Finishing Quality</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { key: "standard" as const, label: "Standard Cut", desc: "Basic cuts & transitions" },
                                            { key: "color_graded" as const, label: "Color Graded Pro", desc: "Cinematic grading & FX" },
                                        ].map((v) => (
                                            <button
                                                key={v.key}
                                                onClick={() => setVidGrade(v.key)}
                                                className={`p-4 text-center border transition-all ${vidGrade === v.key ? "border-white bg-white/5" : "border-white/[0.05] bg-transparent hover:border-white/20"}`}
                                            >
                                                <span className="block text-sm font-semibold text-white mb-1">{v.label}</span>
                                                <span className="text-xs text-neutral-500">{v.desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-4 flex justify-between">
                                        <span>Final Output Duration (Minutes)</span>
                                        <span className="text-white font-bold">{vidDuration}m</span>
                                    </label>
                                    <input type="range" min="1" max="15" value={vidDuration} onChange={(e) => setVidDuration(Number(e.target.value))} className="w-full accent-white" />
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-white/[0.05]">
                                    <span className="text-sm text-neutral-500 uppercase tracking-widest">Est. Total</span>
                                    <span className="text-2xl font-bold text-white">{format(getVidTotal())}</span>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="pt-6 mt-6 border-t border-white/[0.05]">
                            <a
                                href="https://wa.me/6285782074034"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 text-center text-sm font-bold uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors"
                            >
                                Contact / Order Now
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
