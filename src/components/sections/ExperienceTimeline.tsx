"use client";
import { motion } from "framer-motion";
import { Palette, Camera, Film, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

const experiences = [
    { title: "Freelance Graphic Design", duration: "3 Months", energy: 25, description: "Logo design, branding materials, and visual identity projects for various clients.", icon: Palette },
    { title: "Freelance Photography", duration: "1 Year", energy: 100, description: "Graduation, product, and event photography. Professional photo editing and retouching.", icon: Camera },
    { title: "Freelance Video Editing", duration: "1 Month", energy: 8, description: "Video post-production, color grading, motion graphics, and content creation.", icon: Film },
    { title: "Teacher at SMKN 47 JKT", duration: "3 Months", energy: 25, description: "Teaching multimedia and design fundamentals to vocational school students.", icon: BookOpen },
];

const fadeSlide = {
    hidden: { opacity: 0, x: -30, filter: "blur(6px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ExperienceTimeline() {
    const t = useTranslations("Experience");

    return (
        <div className="section-container py-28 relative overflow-hidden bg-[#0A0A0A]">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="text-center mb-16">
                <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-neutral-500">
                    ✦ {t("label")}
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight text-white/90">
                    {t("title")}
                </motion.h2>
            </motion.div>

            <div className="relative max-w-2xl mx-auto">
                {/* Clean monochromatic timeline line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <div className="space-y-6">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            variants={fadeSlide}
                            custom={i}
                            className="relative pl-16 md:pl-20 group"
                        >
                            {/* Grayscale timeline dot */}
                            <div className="absolute left-4 md:left-6 top-8 w-4 h-4 rounded-full transition-all duration-300 bg-neutral-800 border-2 border-neutral-600 group-hover:border-neutral-300 group-hover:bg-neutral-700 ml-[1px]">
                            </div>

                            <div className="rounded-2xl p-6 transition-all duration-500 relative overflow-hidden bg-[#111111] hover:bg-[#151515] hover:-translate-y-1"
                                style={{ border: `1px solid rgba(255,255,255,0.05)` }}>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 relative z-10">
                                    <h3 className="text-lg font-bold flex items-center gap-3 text-neutral-200">
                                        <div className="p-2 rounded-lg bg-neutral-800/50 border border-white/5">
                                            <exp.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        {exp.title}
                                    </h3>
                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full w-fit bg-neutral-800/80 text-neutral-400 border border-white/5 uppercase tracking-wider">
                                        {exp.duration}
                                    </span>
                                </div>

                                <p className="text-sm mb-5 relative z-10 text-neutral-400 leading-relaxed font-light">{exp.description}</p>

                                {/* Minimal Energy Bar */}
                                <div className="space-y-2 relative z-10 pt-4 border-t border-white/[0.03]">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
                                        <span>{t("duration_intensity")}</span>
                                        <span className="text-neutral-300">{exp.energy}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full overflow-hidden bg-neutral-900 border border-white/[0.02]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${exp.energy}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                                            className="h-full rounded-full bg-neutral-400 relative"
                                        >
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
