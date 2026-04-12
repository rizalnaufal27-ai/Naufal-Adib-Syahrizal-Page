"use client";
import { motion } from "framer-motion";
import { Palette, Film, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

interface ServicesSectionProps {
    onOpenPricing: () => void;
}

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const cardPop = {
    hidden: { opacity: 0, y: 50, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const services = [
    { 
        title: "Essential Studio", 
        description: "Perfect for personal projects and small startups. Includes basic graphic design, simple illustration, and photo editing.", 
        icon: Palette, 
        color: "#9CA3AF", // Silver / Gray-400
        price: "Rp 150.000",
        tier: "Silver"
    },
    { 
        title: "Professional Studio", 
        description: "Comprehensive creative solutions for growing brands. Includes full brand identity, video production, and UI/UX.", 
        icon: Film, 
        color: "#FCD34D", // Pale Gold / Amber-300
        price: "Rp 500.000",
        tier: "Gold"
    },
    { 
        title: "Enterprise Digital", 
        description: "The ultimate digital transformation. Custom web applications, full-scale post-production, and premium agency retaining.", 
        icon: Globe, 
        color: "#E5E7EB", // Platinum / Gray-200
        price: "Rp 1.500.000",
        tier: "Platinum"
    },
];

export default function ServicesSection({ onOpenPricing }: ServicesSectionProps) {
    const t = useTranslations("Services");

    return (
        <div className="section-container py-28 relative overflow-hidden bg-[#0A0A0A]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                <div className="text-center mb-16">
                    <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-neutral-500">
                        ✦ {t("label")}
                    </motion.p>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight text-white/90">
                        {t("title")}
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-sm mt-4 max-w-lg mx-auto text-neutral-400">
                        {t("desc")}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            variants={cardPop}
                            custom={index}
                            onClick={onOpenPricing}
                            className="group cursor-pointer rounded-2xl p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-[#111111]"
                            style={{ 
                                border: `1px solid rgba(255,255,255,0.05)`, 
                            }}
                        >
                            {/* Hover minimal glow */}
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
                                style={{ background: `radial-gradient(circle at 50% 0%, ${service.color}08 0%, transparent 70%)` }} 
                            />

                            {/* Animated icon (Matte dark style) */}
                            <motion.div
                                className="mb-6 w-fit rounded-xl p-3 border border-white/[0.05] bg-[#1A1A1A]"
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 4 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <service.icon
                                    className="w-7 h-7 transition-all duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    style={{ color: service.color }}
                                />
                            </motion.div>

                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border" style={{ color: service.color, borderColor: `${service.color}30`, backgroundColor: `${service.color}10` }}>
                                    {service.tier}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-white/90 transition-colors duration-300">
                                {service.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-8 text-neutral-400 transition-colors duration-300">
                                {service.description}
                            </p>

                            <div className="flex items-center justify-between pt-5 border-t border-white/[0.05] relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Starting at</span>
                                    <span className="text-sm font-bold text-white/80">{service.price}</span>
                                </div>
                                <span className="text-xs font-semibold px-5 py-2 rounded-lg transition-all duration-500 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 group-hover:border-white/20 group-hover:text-white">
                                    {t("get_quote")}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
