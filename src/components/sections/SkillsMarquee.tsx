"use client";
import { useState } from "react";

const skills = [
    {
        name: "Photoshop",
        color: "#31A8FF",
        abbr: "Ps",
        bgColor: "#001E36",
    },
    {
        name: "Illustrator",
        color: "#FF9A00",
        abbr: "Ai",
        bgColor: "#330000",
    },
    {
        name: "CapCut",
        color: "#FFFFFF",
        abbr: "Cc",
        bgColor: "#000000",
    },
    {
        name: "Canva",
        color: "#FFFFFF",
        abbr: "C",
        bgColor: "#7D2AE8",
    },
    {
        name: "DaVinci Resolve",
        color: "#FF6B35",
        abbr: "Dv",
        bgColor: "#1A1A2E",
    },
    {
        name: "Camera",
        color: "#E5E5E5",
        abbr: "📷",
        bgColor: "#1A1A1A",
    },
    {
        name: "Figma",
        color: "#A259FF",
        abbr: "Fi",
        bgColor: "#1E1E1E",
    },
    {
        name: "VS Code",
        color: "#007ACC",
        abbr: "VS",
        bgColor: "#1E1E1E",
    },
];

export default function SkillsMarquee() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="py-28 overflow-hidden">
            <div className="section-container mb-16">
                <div className="text-center">
                    <p className="section-label">Toolkit</p>
                    <h2 className="section-title gradient-text">Skills & Tools</h2>
                    <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                        Mastering the tools that bring creative visions to life
                    </p>
                </div>
            </div>

            {/* Antigravity Grid */}
            <div className="section-container">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
                    {skills.map((skill, i) => (
                        <div
                            key={skill.name}
                            className="antigravity-item glass-card flex flex-col items-center justify-center gap-3 p-6 md:p-8 cursor-default group"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                borderColor: hoveredIndex === i ? `${skill.color}40` : undefined,
                            }}
                        >
                            {/* Icon badge */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    background: skill.bgColor,
                                    color: skill.color,
                                    boxShadow: hoveredIndex === i ? `0 0 20px ${skill.color}30` : "none",
                                }}
                            >
                                {skill.abbr}
                            </div>

                            {/* Name */}
                            <span
                                className="text-xs font-semibold text-center whitespace-nowrap transition-colors duration-300"
                                style={{
                                    color: hoveredIndex === i ? skill.color : "var(--color-text-muted)",
                                }}
                            >
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marquee strip below */}
            <div className="relative mt-12">
                <div
                    className="flex gap-8 py-4 opacity-30"
                    style={{ animation: "marquee 20s linear infinite", width: "max-content" }}
                >
                    {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
                        <span
                            key={`m-${i}`}
                            className="text-xs font-mono uppercase tracking-widest whitespace-nowrap"
                            style={{ color: skill.color }}
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>

                {/* Edge fades */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
                />
            </div>
        </div>
    );
}
