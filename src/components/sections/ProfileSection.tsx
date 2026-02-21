"use client";
import { motion } from "framer-motion";
import { Palette, Sparkles, Camera, Film, Globe, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeLeft = {
    hidden: { opacity: 0, x: -50, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeRight = {
    hidden: { opacity: 0, x: 50, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

export default function ProfileSection() {
    const t = useTranslations("Profile");

    return (
        <div className="section-container py-28 relative overflow-hidden">
            {/* Cosmic nebula accents */}
            <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute bottom-0 right-[-10%] w-[35%] h-[35%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-16">
                <motion.p variants={fadeUp} className="section-label" style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦ {t("label")}</motion.p>
                <motion.h2 variants={fadeUp} className="section-title" style={{ background: "linear-gradient(135deg, #fff 0%, #e0e7ff 40%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Naufal Adib Syahrizal</motion.h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="space-y-6 max-w-4xl mx-auto">
                {/* Visi */}
                <motion.div variants={fadeLeft} className="rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500" style={{ background: "rgba(139,92,246,0.03)", border: "1px solid rgba(139,92,246,0.12)", backdropFilter: "blur(10px)" }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)" }} />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]" style={{ background: "linear-gradient(135deg, #8B5CF6, #6366F1)" }} />
                        <h3 className="text-xl font-bold" style={{ color: "#E8E0FF" }}>{t("vision_title")}</h3>
                    </div>
                    <p className="leading-relaxed text-lg relative z-10 text-justify" style={{ color: "#C8BFE8" }} dangerouslySetInnerHTML={{ __html: t.raw("vision_desc") }} />
                </motion.div>

                {/* Misi */}
                <motion.div variants={fadeRight} className="rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500" style={{ background: "rgba(236,72,153,0.03)", border: "1px solid rgba(236,72,153,0.12)", backdropFilter: "blur(10px)" }}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)", filter: "blur(40px)", animation: "nebulaPulse 10s ease-in-out infinite" }} />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.6)]" style={{ background: "linear-gradient(135deg, #EC4899, #8B5CF6)" }} />
                        <h3 className="text-xl font-bold" style={{ color: "#E8E0FF" }}>{t("mision_title")}</h3>
                    </div>
                    <p className="text-lg font-medium italic mb-3 relative z-10 text-justify" style={{ background: "linear-gradient(90deg, #f9a8d4, #d8b4fe, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {t("mision_quote")}
                    </p>
                    <p className="leading-relaxed relative z-10 text-justify" style={{ color: "#C8BFE8" }} dangerouslySetInnerHTML={{ __html: t.raw("mision_desc") }} />
                </motion.div>

                {/* Deliverables */}
                <motion.div variants={fadeUp} className="rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ background: "rgba(99,102,241,0.02)", border: "1px solid rgba(99,102,241,0.1)", backdropFilter: "blur(10px)" }}>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]" style={{ background: "linear-gradient(135deg, #22C55E, #06B6D4)" }} />
                        <h3 className="text-xl font-bold" style={{ color: "#E8E0FF" }}>{t("deliverables_title")}</h3>
                    </div>

                    <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        {[
                            { title: "Graphic Design", desc: "Strategic branding, UI/UX elements, and high-conversion social media assets.", color: "#8B5CF6", icon: Palette },
                            { title: "Custom Illustration", desc: "Unique digital artworks and character designs that add a personal, artistic touch.", color: "#EC4899", icon: Sparkles },
                            { title: "Photography", desc: "High-quality visual storytelling, from product shots to conceptual portraits.", color: "#06B6D4", icon: Camera },
                            { title: "Video Production", desc: "Expertly edited video content, motion graphics, and templates for digital platforms.", color: "#F59E0B", icon: Film },
                            { title: "Web Design", desc: "Modern responsive websites with stunning UI/UX, from landing pages to full sites.", color: "#22C55E", icon: Globe },
                            { title: "App Development", desc: "Custom mobile and web applications built with modern frameworks and technologies.", color: "#6366F1", icon: Smartphone },
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                variants={fadeUp}
                                className="p-5 rounded-xl transition-all duration-500 hover:-translate-y-1 group cursor-default"
                                style={{ background: `${item.color}08`, border: `1px solid ${item.color}18` }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}>
                                        <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" style={{ color: item.color }} />
                                    </motion.div>
                                    <h4 className="font-bold" style={{ color: item.color }}>{item.title}</h4>
                                </div>
                                <p className="text-sm" style={{ color: "#B8B0D0" }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
