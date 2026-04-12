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
        <div className="section-container py-28 relative overflow-hidden bg-[#0A0A0A]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-16 relative z-10">
                <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-3">✦ {t("label")}</motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white tracking-tight">Naufal Adib Syahrizal</motion.h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="space-y-6 max-w-4xl mx-auto relative z-10">
                {/* Visi */}
                <motion.div variants={fadeLeft} className="rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-[#111111] border border-white/[0.05]">
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-neutral-400" />
                        <h3 className="text-xl font-bold text-white">{t("vision_title")}</h3>
                    </div>
                    <p className="leading-relaxed text-base md:text-lg relative z-10 text-justify text-neutral-400" dangerouslySetInnerHTML={{ __html: t.raw("vision_desc") }} />
                </motion.div>

                {/* Misi */}
                <motion.div variants={fadeRight} className="rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-[#111111] border border-white/[0.05]">
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-neutral-400" />
                        <h3 className="text-xl font-bold text-white">{t("mision_title")}</h3>
                    </div>
                    <p className="text-base md:text-lg font-medium italic mb-3 relative z-10 text-justify text-neutral-300">
                        {t("mision_quote")}
                    </p>
                    <p className="leading-relaxed text-base md:text-lg relative z-10 text-justify text-neutral-400" dangerouslySetInnerHTML={{ __html: t.raw("mision_desc") }} />
                </motion.div>

                {/* Deliverables */}
                <motion.div variants={fadeUp} className="rounded-2xl p-6 md:p-8 relative overflow-hidden bg-[#111111] border border-white/[0.05]">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-neutral-400" />
                        <h3 className="text-xl font-bold text-white">{t("deliverables_title")}</h3>
                    </div>

                    <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        {[
                            { title: "Graphic Design", desc: "Strategic branding, UI/UX elements, and high-conversion social media assets.", icon: Palette },
                            { title: "Custom Illustration", desc: "Unique digital artworks and character designs that add a personal, artistic touch.", icon: Sparkles },
                            { title: "Photography", desc: "High-quality visual storytelling, from product shots to conceptual portraits.", icon: Camera },
                            { title: "Video Production", desc: "Expertly edited video content, motion graphics, and templates for digital platforms.", icon: Film },
                            { title: "Web Design", desc: "Modern responsive websites with stunning UI/UX, from landing pages to full sites.", icon: Globe },
                            { title: "App Development", desc: "Custom mobile and web applications built with modern frameworks and technologies.", icon: Smartphone },
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                variants={fadeUp}
                                className="p-5 rounded-xl transition-all duration-500 hover:-translate-y-1 group cursor-default border border-white/[0.02] bg-white/[0.02] hover:bg-white/[0.04]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}>
                                        <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 text-neutral-400 group-hover:text-white" />
                                    </motion.div>
                                    <h4 className="font-bold text-neutral-200 group-hover:text-white transition-colors">{item.title}</h4>
                                </div>
                                <p className="text-sm text-neutral-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
