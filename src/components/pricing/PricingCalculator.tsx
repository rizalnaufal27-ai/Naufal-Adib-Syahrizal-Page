import { useEffect } from "react";
import { usePricingStore, ServiceType } from "@/store/pricing-store";

interface PricingCalculatorProps {
    onPriceCalculated: (totalUSD: number, serviceLabel: string) => void;
}

const services: { key: ServiceType; label: string; icon: string; desc: string }[] = [
    { key: "brand_identity", label: "Brand Identity", icon: "💎", desc: "Logo, Typography, Guidelines" },
    { key: "digital_presence", label: "Digital Presence", icon: "🌐", desc: "Custom Web Design & Build" },
    { key: "startup_mvp", label: "Startup MVP", icon: "🚀", desc: "App Logic & Full-stack Architecture" }
];

export default function PricingCalculator({ onPriceCalculated }: PricingCalculatorProps) {
    const s = usePricingStore();

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz?.toLowerCase().includes("jakarta")) s.setCurrency("IDR");
        } catch { /* */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (s.service) onPriceCalculated(s.getTotalUSD(), s.getServiceLabel());
    }, [s, onPriceCalculated]);

    const cardStyle = (active: boolean) => ({
        background: active ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(99,102,241,0.4)" : "var(--color-border)"}`,
    });

    if (!s.service) {
        return (
            <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Select Boutique Service</p>
                <div className="grid grid-cols-1 gap-3">
                    {services.map((svc) => (
                        <button
                            key={svc.key}
                            onClick={() => s.setService(svc.key)}
                            className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02]"
                            style={cardStyle(false)}
                        >
                            <div className="flex gap-4 items-center">
                                <span className="text-3xl">{svc.icon}</span>
                                <div>
                                    <p className="text-base font-semibold text-white">{svc.label}</p>
                                    <p className="text-xs mt-0.5 text-neutral-400">{svc.desc}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <button onClick={() => s.setService(null)} className="p-2 rounded-lg hover:bg-white/5 text-neutral-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </button>
                <div>
                    <p className="text-sm font-bold text-white">{s.getServiceLabel()}</p>
                    <p className="text-[11px] text-neutral-400">Package Configuration</p>
                </div>
            </div>

            {/* BRAND IDENTITY */}
            {s.service === "brand_identity" && (
                <div className="space-y-3">
                    <p className="text-xs text-neutral-400">Premium Add-ons</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: "social", label: "Media Kit", price: 50 },
                            { id: "stationery", label: "Stationery", price: 30 },
                            { id: "3d", label: "3D Assets", price: 100 },
                        ].map((item) => (
                            <button key={item.id} onClick={() => s.toggleBrandAddon(item.id)} className="p-3 rounded-xl text-left transition-all" style={cardStyle(s.brandAddons.includes(item.id))}>
                                <p className="text-xs font-semibold text-white">{item.label}</p>
                                <p className="text-[11px] mt-0.5 text-indigo-400">+{s.formatPrice(item.price)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* DIGITAL PRESENCE */}
            {s.service === "digital_presence" && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs mb-1 block text-neutral-400">Sub-Pages Count: <strong className="text-white">{s.webPages}</strong></label>
                        <input type="range" min="1" max="15" value={s.webPages} onChange={(e) => s.setWebPages(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5" style={cardStyle(s.webCMS)}>
                            <input type="checkbox" checked={s.webCMS} onChange={(e) => s.setWebCMS(e.target.checked)} className="w-5 h-5 accent-indigo-500 rounded" />
                            <div>
                                <p className="text-sm font-bold text-white">Headless CMS Setup</p>
                                <p className="text-[11px] text-neutral-400">Sanity/Strapi Integration (+{s.formatPrice(200)})</p>
                            </div>
                        </label>
                    </div>
                </div>
            )}

            {/* STARTUP MVP */}
            {s.service === "startup_mvp" && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs mb-1 block text-neutral-400">Core User Flows: <strong className="text-white">{s.appFlows}</strong></label>
                        <input type="range" min="3" max="25" value={s.appFlows} onChange={(e) => s.setAppFlows(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5" style={cardStyle(s.appAI)}>
                            <input type="checkbox" checked={s.appAI} onChange={(e) => s.setAppAI(e.target.checked)} className="w-5 h-5 accent-indigo-500 rounded" />
                            <div>
                                <p className="text-sm font-bold text-white">AI / LLM Integration</p>
                                <p className="text-[11px] text-neutral-400">OpenAI/Gemini Architecture (+{s.formatPrice(500)})</p>
                            </div>
                        </label>
                    </div>
                </div>
            )}

            {/* RUSH DELIVERY */}
            <div className="pt-2">
                <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all hover:bg-white/5" style={{ background: s.expressDelivery ? "rgba(236,72,153,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${s.expressDelivery ? "rgba(236,72,153,0.4)" : "var(--color-border)"}` }}>
                    <input type="checkbox" checked={s.expressDelivery} onChange={(e) => s.setExpressDelivery(e.target.checked)} className="w-5 h-5 accent-pink-500 rounded" />
                    <div>
                        <p className="text-sm font-bold text-pink-500" style={{ textShadow: "0 0 10px rgba(236,72,153,0.3)"}}>Express Delivery (Rush)</p>
                        <p className="text-[11px] text-neutral-400">Halve the timeline (+50% Rate)</p>
                    </div>
                </label>
            </div>

            {/* SUMMARY */}
            {s.getTotalUSD() > 0 && (
                <div className="p-4 rounded-xl mt-4" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-neutral-400">Estimated Timeline</span>
                        <span className="text-sm font-bold text-white">~{s.getEstimatedDays()} Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-400">Estimated Total</span>
                        <div className="text-right">
                            <span className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
                                {s.formatPrice(s.getTotalUSD())}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
