"use client";
import { motion } from "framer-motion";
import { Palette, Camera, Film, BookOpen } from "lucide-react";

const experiences = [
    { year: "2024 - Present", title: "Freelance Graphic Design", company: "Self-Employed", description: "Logo design, branding materials, and visual identity projects for various clients.", icon: Palette },
    { year: "2022 - 2024", title: "Freelance Photography", company: "Self-Employed", description: "Graduation, product, and event photography. Professional photo editing and retouching.", icon: Camera },
    { year: "2023 - 2024", title: "Freelance Video Editing", company: "Self-Employed", description: "Video post-production, color grading, motion graphics, and content creation.", icon: Film },
    { year: "2024", title: "Teacher at SMKN 47", company: "Jakarta, Indonesia", description: "Teaching multimedia and design fundamentals to vocational school students.", icon: BookOpen },
];

export default function ExperienceTimeline() {
    return (
        <section className="w-full py-24 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Header — same style as WORK */}
                <div className="mb-16 border-b border-white/[0.06] pb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        EXPERIENCE
                    </motion.h2>
                </div>

                {/* Timeline — horizontal reference style */}
                <div className="relative">
                    {/* Vertical center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.06]" />

                    <div className="space-y-0">
                        {experiences.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="grid grid-cols-1 md:grid-cols-2 relative py-10 border-b border-white/[0.04]"
                            >
                                {/* Dot on center line */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-500 hidden md:block" />

                                {/* Left: Year + Company */}
                                <div className={`pr-12 ${i % 2 === 0 ? "text-right" : "md:col-start-2 md:row-start-1 pl-12 pr-0 text-left"}`}>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mb-1 font-medium">{exp.year}</p>
                                    <h3 className="text-lg font-bold text-white tracking-tight">{exp.title}</h3>
                                    <p className="text-xs text-neutral-500 mt-1 font-medium">{exp.company}</p>
                                </div>

                                {/* Right: Description */}
                                <div className={`pt-3 md:pt-0 ${i % 2 === 0 ? "md:col-start-2 pl-12" : "pr-12 text-right"}`}>
                                    <exp.icon className="w-4 h-4 text-neutral-600 mb-3 hidden md:block" strokeWidth={1.5} />
                                    <p className="text-sm text-neutral-400 leading-relaxed">{exp.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
