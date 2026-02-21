"use client";
import { useEffect } from "react";
import { usePricingStore, ServiceType } from "@/store/pricing-store";
import { useTranslations } from "next-intl";

interface PricingCalculatorProps {
    onPriceCalculated: (totalUSD: number, serviceLabel: string) => void;
}

const services: { key: ServiceType; label: string; icon: string; desc: string }[] = [
    { key: "design", label: "Graphic Design", icon: "🎨", desc: "Logo, Banner, Poster, Brand" },
    { key: "illustration", label: "Illustration", icon: "✏️", desc: "Half Body, Full Body, Render" },
    { key: "photo", label: "Photography", icon: "📸", desc: "Jabodetabek • Editing" },
    { key: "video", label: "Video Production", icon: "🎬", desc: "Editing + Post-Production" },
    { key: "web", label: "Web Design", icon: "🌐", desc: "Responsive + CMS + API" },
    { key: "app", label: "App Design", icon: "📱", desc: "UX, Prototype, Logic" },
];

export default function PricingCalculator({ onPriceCalculated }: PricingCalculatorProps) {
    const t = useTranslations("PricingCalculator");
    const s = usePricingStore();

    useEffect(() => {
        // Auto-detect currency
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz?.toLowerCase().includes("jakarta")) s.setCurrency("IDR");
        } catch { /* */ }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (s.service) {
            onPriceCalculated(s.getTotalUSD(), s.getServiceLabel());
        }
    }, [s, onPriceCalculated]);

    const cardStyle = (active: boolean) => ({
        background: active ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(99,102,241,0.4)" : "var(--color-border)"}`,
    });

    const btnStyle = (active: boolean) => ({
        background: active ? "linear-gradient(135deg, #6366F1, #4F46E5)" : "rgba(255,255,255,0.03)",
        color: active ? "#fff" : "var(--color-text-muted)",
        border: `1px solid ${active ? "#6366F1" : "var(--color-border)"}`,
    });

    // Step 1: Service Selection
    if (!s.service) {
        return (
            <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("chooseService")}</p>
                <div className="grid grid-cols-2 gap-3">
                    {services.map((svc) => (
                        <button
                            key={svc.key}
                            onClick={() => s.setService(svc.key)}
                            className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02]"
                            style={cardStyle(false)}
                        >
                            <span className="text-2xl">{svc.icon}</span>
                            <p className="text-sm font-semibold mt-2" style={{ color: "var(--color-text)" }}>{t(`services.${svc.key}.label`)}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>{t(`services.${svc.key}.desc`)}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Step 2: Service-specific inputs
    return (
        <div className="space-y-5">
            {/* Back + Service header */}
            <div className="flex items-center gap-3">
                <button onClick={() => s.setService(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: "var(--color-text-muted)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </button>
                <div>
                    <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{s.service ? t(`services.${s.service}.label`) : s.getServiceLabel()}</p>
                    <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{t("configureOrder")}</p>
                </div>
            </div>

            {/* GRAPHIC DESIGN */}
            {s.service === "design" && (
                <div className="space-y-3">
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t("design.select")}</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: "logo", label: "Logo Design", price: 5 },
                            { id: "banner", label: "Banner Design", price: 5 },
                            { id: "poster", label: "Poster Design", price: 5 },
                            { id: "brand", label: "Brand Package", price: 20 },
                        ].map((item) => (
                            <button key={item.id} onClick={() => s.toggleDesignItem(item.id)} className="p-3 rounded-xl text-left transition-all" style={cardStyle(s.designItems.includes(item.id))}>
                                <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{t(`design.items.${item.id}`)}</p>
                                <p className="text-[11px] mt-0.5" style={{ color: "#6366F1" }}>{s.formatPrice(item.price)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ILLUSTRATION */}
            {s.service === "illustration" && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {([
                            { key: "half" as const, price: 5 },
                            { key: "full" as const, price: 8 },
                            { key: "render" as const, price: 12 },
                        ]).map((tItem) => (
                            <button key={tItem.key} onClick={() => s.setIllusType(tItem.key)} className="flex-1 py-3 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.illusType === tItem.key)}>
                                {t(`illustration.types.${tItem.key}`)}<br />{s.formatPrice(tItem.price)}/{t("illustration.char")}
                            </button>
                        ))}
                    </div>
                    <div>
                        <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                            {t("illustration.characters")}: <strong style={{ color: "var(--color-text)" }}>{s.charCount}</strong>
                        </label>
                        <input type="range" min="1" max="10" value={s.charCount} onChange={(e) => s.setCharCount(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                </div>
            )}

            {/* PHOTOGRAPHY */}
            {s.service === "photo" && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {(["package", "edit"] as const).map((m) => (
                            <button key={m} onClick={() => s.setPhotoMode(m)} className="flex-1 py-3 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.photoMode === m)}>
                                {m === "package" ? `📸 ${t("photo.modes.package")}` : `🖌️ ${t("photo.modes.edit")}`}
                            </button>
                        ))}
                    </div>
                    {s.photoMode === "package" && (
                        <div className="space-y-3">
                            <input
                                type="text" value={s.location} onChange={(e) => s.setLocation(e.target.value)}
                                placeholder={t("photo.locationPlaceholder")}
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", color: "var(--color-text)" }} />
                            {s.isJabodetabek === true && (
                                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22C55E" }}>
                                    {t("photo.available", { price: s.formatPrice(20) })}
                                </div>
                            )}
                            {s.isJabodetabek === false && (
                                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
                                    {t("photo.notAvailable")}
                                </div>
                            )}
                            {s.isJabodetabek && (
                                <label className="flex items-center gap-2 p-3 rounded-lg cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--color-border)" }}>
                                    <input type="checkbox" checked={s.addRaw} onChange={(e) => s.setAddRaw(e.target.checked)} className="accent-indigo-500" />
                                    <span className="text-xs" style={{ color: "var(--color-text)" }}>{t("photo.addRaw", { price: s.formatPrice(5) })}</span>
                                </label>
                            )}
                        </div>
                    )}
                    {s.photoMode === "edit" && (
                        <div>
                            <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                                {t("photo.complexity")}: <strong style={{ color: "var(--color-text)" }}>{s.formatPrice(s.editComplexity)}</strong>
                            </label>
                            <input type="range" min="1" max="5" value={s.editComplexity} onChange={(e) => s.setEditComplexity(Number(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                    )}
                </div>
            )}

            {/* VIDEO */}
            {s.service === "video" && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>{t("video.duration")}: <strong style={{ color: "var(--color-text)" }}>{s.videoDuration} {t("video.min")}</strong></label>
                        <input type="range" min="1" max="60" value={s.videoDuration} onChange={(e) => s.setVideoDuration(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div className="flex gap-2">
                        {([{ key: "low" as const, price: "$10" }, { key: "med" as const, price: "$30" }, { key: "high" as const, price: "$50" }]).map((c) => (
                            <button key={c.key} onClick={() => s.setVideoComplexity(c.key)} className="flex-1 py-3 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.videoComplexity === c.key)}>
                                {t(`video.complexity.${c.key}`)}<br /><span className="opacity-70">{c.price} {t("video.base")}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* WEB DESIGN */}
            {s.service === "web" && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>{t("web.pages")}: <strong style={{ color: "var(--color-text)" }}>{s.webPages}</strong></label>
                        <input type="range" min="1" max="20" value={s.webPages} onChange={(e) => s.setWebPages(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>{t("web.responsive")}</label>
                        <div className="flex gap-2">
                            {(["basic", "full"] as const).map((r) => (
                                <button key={r} onClick={() => s.setWebResponsive(r)} className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.webResponsive === r)}>
                                    {t(`web.responsiveModes.${r}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>{t("web.interactivity")}</label>
                        <div className="flex gap-2">
                            {([
                                { key: "static" as const },
                                { key: "dynamic" as const },
                                { key: "cms" as const },
                            ]).map((i) => (
                                <button key={i.key} onClick={() => s.setWebInteractivity(i.key)} className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.webInteractivity === i.key)}>
                                    {t(`web.interactivityModes.${i.key}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* APP DESIGN */}
            {s.service === "app" && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs mb-1 block" style={{ color: "var(--color-text-muted)" }}>{t("app.userFlows")}: <strong style={{ color: "var(--color-text)" }}>{s.appFlows}</strong></label>
                        <input type="range" min="1" max="15" value={s.appFlows} onChange={(e) => s.setAppFlows(Number(e.target.value))} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>{t("app.prototypeDepth")}</label>
                        <div className="flex gap-2">
                            {(["lofi", "hifi"] as const).map((p) => (
                                <button key={p} onClick={() => s.setAppPrototype(p)} className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.appPrototype === p)}>
                                    {t(`app.prototypeModes.${p}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs block mb-1" style={{ color: "var(--color-text-muted)" }}>{t("app.systemLogic")}</label>
                        <div className="flex gap-2">
                            {([
                                { key: "simple" as const },
                                { key: "moderate" as const },
                                { key: "complex" as const },
                            ]).map((l) => (
                                <button key={l.key} onClick={() => s.setAppLogic(l.key)} className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all" style={btnStyle(s.appLogic === l.key)}>
                                    {t(`app.logicModes.${l.key}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Price Summary */}
            {(s.getTotalUSD() > 0) && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                            {t("estimatedTotal")}
                        </span>
                        <span className="text-xl font-bold" style={{ color: "#6366F1" }}>{s.formatPrice(s.getTotalUSD())}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
