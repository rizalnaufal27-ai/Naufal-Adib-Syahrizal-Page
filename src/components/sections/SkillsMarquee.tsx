"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const skills = [
    { name: "Photoshop", abbr: "Ps" },
    { name: "Illustrator", abbr: "Ai" },
    { name: "Krita", abbr: "Kr" },
    { name: "Premiere Pro", abbr: "Pr" },
    { name: "InDesign", abbr: "Id" },
    { name: "Ibis Paint", abbr: "iP" },
    { name: "CapCut", abbr: "Cc" },
    { name: "Canva", abbr: "Cn" },
    { name: "DaVinci Resolve", abbr: "Dv" },
    { name: "Camera", abbr: "📷" },
    { name: "Antigravity", abbr: "Ag" },
    { name: "VS Code", abbr: "VS" },
];

export default function SkillsMarquee() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="w-full py-24 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="mb-16 border-b border-white/[0.06] pb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        TOOLS
                    </motion.h2>
                </div>

                {/* Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-px bg-white/[0.04]"
                >
                    {skills.map((skill, i) => (
                        <div
                            key={skill.name}
                            className="group bg-[#0A0A0A] p-6 flex flex-col items-center justify-center gap-3 cursor-default hover:bg-[#111111] transition-colors duration-300"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div
                                className="w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors duration-300"
                                style={{
                                    color: hoveredIndex === i ? "#FFFFFF" : "#525252",
                                }}
                            >
                                {skill.abbr}
                            </div>
                            <span
                                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-center transition-colors duration-300"
                                style={{ color: hoveredIndex === i ? "#FFFFFF" : "#404040" }}
                            >
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </motion.div>

            </div>

            {/* Marquee strip */}
            <div className="relative mt-16 overflow-hidden border-y border-white/[0.03]">
                <div
                    className="flex gap-16 py-4 whitespace-nowrap"
                    style={{ animation: "marquee 40s linear infinite", width: "max-content" }}
                >
                    {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
                        <span key={`m-${i}`} className="text-xs font-semibold uppercase tracking-widest text-neutral-700 flex items-center gap-3">
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                            {skill.name}
                        </span>
                    ))}
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
