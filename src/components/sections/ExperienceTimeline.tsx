"use client";
import { motion } from "framer-motion";

const experiences = [
    { title: "Freelance Graphic Design", duration: "3 Months", energy: 25, description: "Logo design, branding materials, and visual identity projects for various clients.", color: "#8B5CF6", emoji: "🎨" },
    { title: "Freelance Photography", duration: "1 Year", energy: 100, description: "Graduation, product, and event photography. Professional photo editing and retouching.", color: "#EC4899", emoji: "📷" },
    { title: "Freelance Video Editing", duration: "1 Month", energy: 8, description: "Video post-production, color grading, motion graphics, and content creation.", color: "#06B6D4", emoji: "🎬" },
    { title: "Teacher at SMKN 47 JKT", duration: "3 Months", energy: 25, description: "Teaching multimedia and design fundamentals to vocational school students.", color: "#22C55E", emoji: "📚" },
];

const fadeSlide = {
    hidden: { opacity: 0, x: -30, filter: "blur(6px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ExperienceTimeline() {
    return (
        <div className="section-container py-28 relative overflow-hidden">
            {/* Cosmic ambient */}
            <div className="absolute top-[30%] left-[-8%] w-[30%] h-[40%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(80px)", animation: "nebulaPulse 14s ease-in-out infinite" }} />

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="text-center mb-16">
                <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦ Journey</motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fff 0%, #e0e7ff 40%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Experience</motion.h2>
            </motion.div>

            <div className="relative max-w-2xl mx-auto">
                {/* Timeline line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.3) 10%, rgba(99,102,241,0.2) 50%, rgba(236,72,153,0.2) 90%, transparent)" }} />

                <div className="space-y-6">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            variants={fadeSlide}
                            custom={i}
                            className="relative pl-16 md:pl-20"
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-4 md:left-6 top-8 w-4 h-4 rounded-full transition-all duration-500" style={{
                                background: `linear-gradient(135deg, ${exp.color}, ${exp.color}80)`,
                                boxShadow: `0 0 15px ${exp.color}50, 0 0 30px ${exp.color}20`,
                            }}>
                                <div className="absolute -inset-1.5 rounded-full border border-dashed" style={{ borderColor: `${exp.color}30`, animation: `orbitalSpin ${8 + i * 2}s linear infinite` }} />
                            </div>

                            <div className="rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                                style={{ background: `${exp.color}04`, border: `1px solid ${exp.color}15`, backdropFilter: "blur(10px)" }}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 0% 50%, ${exp.color}10 0%, transparent 50%)` }} />

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 relative z-10">
                                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#E8E0FF" }}>
                                        <span className="text-xl group-hover:scale-125 transition-transform duration-300">{exp.emoji}</span>
                                        {exp.title}
                                    </h3>
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full w-fit" style={{ background: `${exp.color}12`, color: exp.color, border: `1px solid ${exp.color}25` }}>
                                        {exp.duration}
                                    </span>
                                </div>

                                <p className="text-sm mb-4 relative z-10" style={{ color: "#C8BFE8" }}>{exp.description}</p>

                                {/* Energy Bar */}
                                <div className="space-y-1.5 relative z-10">
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: "#A8A0C0" }}>Duration Intensity</span>
                                        <span className="font-mono font-bold" style={{ color: exp.color }}>{exp.energy}%</span>
                                    </div>
                                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${exp.energy}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                                            className="h-full rounded-full relative"
                                            style={{ background: `linear-gradient(90deg, ${exp.color}, ${exp.color}80)`, boxShadow: `0 0 12px ${exp.color}40` }}
                                        >
                                            <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmer 2s ease-in-out infinite" }} />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
