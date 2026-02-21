"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const skills = [
    { name: "Photoshop", color: "#31A8FF", abbr: "Ps", bgColor: "#001E36" },
    { name: "Illustrator", color: "#FF9A00", abbr: "Ai", bgColor: "#330000" },
    { name: "After Effects", color: "#9999FF", abbr: "Ae", bgColor: "#00005B" },
    { name: "Premiere Pro", color: "#9999FF", abbr: "Pr", bgColor: "#00005B" },
    { name: "InDesign", color: "#FF3366", abbr: "Id", bgColor: "#49021F" },
    { name: "Ibis Paint", color: "#FF6B9D", abbr: "iP", bgColor: "#2D0013" },
    { name: "CapCut", color: "#FFFFFF", abbr: "Cc", bgColor: "#000000" },
    { name: "Canva", color: "#FFFFFF", abbr: "C", bgColor: "#7D2AE8" },
    { name: "DaVinci Resolve", color: "#FF6B35", abbr: "Dv", bgColor: "#1A1A2E" },
    { name: "Camera", color: "#E5E5E5", abbr: "📷", bgColor: "#1A1A1A" },
    { name: "Figma", color: "#A259FF", abbr: "Fi", bgColor: "#1E1E1E" },
    { name: "VS Code", color: "#007ACC", abbr: "VS", bgColor: "#1E1E1E" },
    { name: "Antigravity", color: "#C084FC", abbr: "✦", bgColor: "#1A0B2E" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

const skillPop = {
    hidden: { opacity: 0, scale: 0.7, rotate: -5 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, ease: "backOut" } },
};

export default function SkillsMarquee() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="py-28 overflow-hidden relative">
            {/* Cosmic ambient */}
            <div className="absolute top-[20%] right-[10%] w-[25%] h-[30%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)", filter: "blur(80px)", animation: "nebulaPulse 12s ease-in-out infinite" }} />

            <div className="section-container mb-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="text-center">
                    <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦ Toolkit</motion.p>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fff 0%, #e0e7ff 40%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Skills & Tools</motion.h2>
                    <motion.p variants={fadeUp} className="text-sm mt-4 max-w-md mx-auto text-white/55">Mastering the tools that bring creative visions to life</motion.p>
                </motion.div>
            </div>

            {/* Cosmic Grid */}
            <div className="section-container">
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
                            className="flex flex-col items-center justify-center gap-3 p-5 md:p-6 cursor-default group rounded-2xl relative overflow-hidden transition-all duration-500 hover:-translate-y-2"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                background: hoveredIndex === i ? `${skill.color}08` : "rgba(255,255,255,0.02)",
                                border: `1px solid ${hoveredIndex === i ? `${skill.color}30` : "rgba(255,255,255,0.05)"}`,
                                backdropFilter: "blur(10px)",
                                boxShadow: hoveredIndex === i ? `0 0 30px ${skill.color}15` : "none",
                            }}
                        >
                            {/* Cosmic glow on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, ${skill.color}15 0%, transparent 60%)` }} />

                            {/* Orbital ring on hover */}
                            {hoveredIndex === i && (
                                <div className="absolute inset-2 rounded-xl border border-dashed pointer-events-none" style={{ borderColor: `${skill.color}20`, animation: "orbitalSpin 6s linear infinite" }} />
                            )}

                            {/* Icon badge */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 group-hover:scale-115 relative z-10"
                                style={{
                                    background: skill.bgColor,
                                    color: skill.color,
                                    boxShadow: hoveredIndex === i ? `0 0 25px ${skill.color}40, 0 4px 15px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.2)",
                                }}
                            >
                                {skill.abbr}
                            </div>

                            {/* Name */}
                            <span className="text-xs font-semibold text-center whitespace-nowrap transition-all duration-300 relative z-10"
                                style={{ color: hoveredIndex === i ? skill.color : "rgba(255,255,255,0.55)" }}>
                                {skill.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Cosmic Marquee strip */}
            <div className="relative mt-14">
                <div className="flex gap-10 py-4" style={{ animation: "marquee 30s linear infinite", width: "max-content" }}>
                    {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
                        <span key={`m-${i}`} className="text-xs font-mono uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-2" style={{ color: `${skill.color}40` }}>
                            <span className="w-1 h-1 rounded-full" style={{ background: `${skill.color}30` }} />
                            {skill.name}
                        </span>
                    ))}
                </div>
                {/* Edge fades */}
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }} />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }} />
            </div>
        </div>
    );
}
