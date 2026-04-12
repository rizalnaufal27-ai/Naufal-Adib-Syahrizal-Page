"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const skills = [
    { name: "Photoshop", color: "#31A8FF", abbr: "Ps", bgColor: "#001E36" },
    { name: "Illustrator", color: "#FF9A00", abbr: "Ai", bgColor: "#330000" },
    { name: "After Effects", color: "#9999FF", abbr: "Ae", bgColor: "#00005B" },
    { name: "Premiere Pro", color: "#9999FF", abbr: "Pr", bgColor: "#00005B" },
    { name: "InDesign", color: "#FF3366", abbr: "Id", bgColor: "#49021F" },
    { name: "Ibis Paint", color: "#FF6B9D", abbr: "iP", bgColor: "#2D0013" },
    { name: "CapCut", color: "#FFFFFF", abbr: "Cc", bgColor: "#111111" },
    { name: "Canva", color: "#00C4CC", abbr: "C", bgColor: "#002F33" },
    { name: "DaVinci Resolve", color: "#FF6B35", abbr: "Dv", bgColor: "#331100" },
    { name: "Camera", color: "#E5E5E5", abbr: "📷", bgColor: "#222222" },
    { name: "Figma", color: "#A259FF", abbr: "Fi", bgColor: "#1E1E1E" },
    { name: "VS Code", color: "#007ACC", abbr: "VS", bgColor: "#1E1E1E" },
    { name: "Antigravity", color: "#FFFFFF", abbr: "✦", bgColor: "#1A1A1A" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

const skillPop = {
    hidden: { opacity: 0, scale: 0.9, rotate: 0 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function SkillsMarquee() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const t = useTranslations("Skills");

    return (
        <div className="py-28 overflow-hidden relative bg-[#0A0A0A]">
            <div className="section-container mb-16 relative z-10">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="text-center">
                    <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-3">✦ {t("label")}</motion.p>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-white">{t("title")}</motion.h2>
                    <motion.p variants={fadeUp} className="text-sm mt-4 max-w-md mx-auto text-neutral-400">{t("desc")}</motion.p>
                </motion.div>
            </div>

            {/* Grid */}
            <div className="section-container relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 max-w-4xl mx-auto"
                >
                    {skills.map((skill, i) => (
                        <motion.div
                            key={skill.name}
                            variants={skillPop}
                            className="flex flex-col items-center justify-center gap-3 p-5 md:p-6 cursor-default group rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-1 bg-[#111111]"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                border: `1px solid ${hoveredIndex === i ? `${skill.color}50` : "rgba(255,255,255,0.05)"}`,
                            }}
                        >
                            {/* Subtle dark gradient overlay based on skill color on hover without harsh brightness */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" style={{ background: skill.color }} />

                            {/* Icon badge */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-transform duration-500 group-hover:scale-105 relative z-10"
                                style={{
                                    background: "#1A1A1A",
                                    color: hoveredIndex === i ? skill.color : "#737373", // neutral-500 until hovered
                                    border: "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                {skill.abbr}
                            </div>

                            {/* Name */}
                            <span className="text-xs font-semibold text-center whitespace-nowrap transition-colors duration-300 relative z-10"
                                style={{ color: hoveredIndex === i ? "#FFFFFF" : "#737373" }}>
                                {skill.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Marquee strip */}
            <div className="relative mt-14 overflow-visible border-y border-white/[0.02] bg-[#0A0A0A]">
                <div className="flex gap-12 py-4 overflow-visible" style={{ animation: "marquee 40s linear infinite", width: "max-content" }}>
                    {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
                        <span key={`m-${i}`} className="text-sm font-semibold uppercase tracking-widest whitespace-nowrap flex items-center gap-3 text-neutral-600 transition-colors hover:text-neutral-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                            {skill.name}
                        </span>
                    ))}
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-[#0A0A0A] to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-[#0A0A0A] to-transparent" />
            </div>
        </div >
    );
}
