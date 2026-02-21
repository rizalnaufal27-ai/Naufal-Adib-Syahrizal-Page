"use client";
import { useState, useMemo } from "react";
import { Project, projects, ProjectCategory } from "@/data/projects";
import ProjectModal from "@/components/ui/project-modal";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTranslations } from "next-intl";

function isVideo(src: string) {
    return /\.(mp4|webm|mov|avi)$/i.test(src);
}

export default function PortfolioGrid() {
    const t = useTranslations("PortfolioGrid");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");

    const categories = useMemo(() => {
        const uniqueCats = Array.from(new Set(projects.map((p) => p.category))).sort();
        return ["All", ...uniqueCats];
    }, []);

    const filteredProjects = useMemo(() => {
        return projects
            .filter((project) => activeCategory === "All" || project.category === activeCategory)
            .sort((a, b) => a.id - b.id);
    }, [activeCategory]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0, scale: 0.92 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, damping: 14 }
        }
    };

    return (
        <section id="portfolio-grid" className="section-container py-24 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-sm uppercase tracking-[0.3em] mb-3 text-cyan-400"
                >
                    {t("selectedWorks")}
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
                    style={{
                        background: "linear-gradient(135deg, #fff 0%, #a5b4fc 50%, #06b6d4 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t("portfolio")}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-white/40 max-w-md mx-auto"
                >
                    {t("browse")}
                </motion.p>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-2 mt-10 mb-4"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category as any)}
                            className="relative px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 z-20 overflow-hidden"
                            style={{
                                background: activeCategory === category
                                    ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(6,182,212,0.15))"
                                    : "rgba(255,255,255,0.03)",
                                border: activeCategory === category
                                    ? "1px solid rgba(99,102,241,0.4)"
                                    : "1px solid rgba(255,255,255,0.08)",
                                color: activeCategory === category ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                                boxShadow: activeCategory === category
                                    ? "0 0 20px rgba(99,102,241,0.15)"
                                    : "none",
                            }}
                        >
                            {activeCategory === category && (
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 animate-pulse" />
                            )}
                            <span className="relative z-10">{category}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Masonry Layout */}
            <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5 w-full max-w-[1400px] mx-auto px-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            layoutId={`project-${project.id}`}
                            className="group relative overflow-hidden rounded-2xl cursor-pointer break-inside-avoid mb-4 md:mb-5"
                            onClick={() => setSelectedProject(project)}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            {/* Image / Video */}
                            <div className="w-full overflow-hidden">
                                {project.image ? (
                                    isVideo(project.image) ? (
                                        <video
                                            src={project.image}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            onMouseEnter={(e) => e.currentTarget.play()}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    )
                                ) : (
                                    <div
                                        className="w-full aspect-[4/3] flex items-center justify-center"
                                        style={{ background: project.gradient || "linear-gradient(135deg, #1e1b4b, #0f172a)" }}
                                    >
                                        <span className="text-white/20 text-xs font-bold tracking-widest uppercase">
                                            {project.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-5">
                                {/* Category badge */}
                                <div
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold mb-2 w-fit translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                                    style={{
                                        background: "rgba(6,182,212,0.15)",
                                        color: "#67e8f9",
                                        border: "1px solid rgba(6,182,212,0.25)",
                                    }}
                                >
                                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                    {project.category}
                                </div>
                                {/* Title */}
                                <h3 className="text-sm md:text-lg font-bold text-white translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                    {project.title}
                                </h3>
                                {/* Animated underline */}
                                <div className="mt-2 h-[2px] w-0 group-hover:w-full transition-all duration-500 delay-150 rounded-full"
                                    style={{ background: "linear-gradient(90deg, #6366f1, #06b6d4)" }}
                                />
                                {/* View prompt */}
                                <p className="text-xs text-white/40 mt-2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                                    {t("clickToView")}
                                </p>
                            </div>

                            {/* Subtle glow on hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    boxShadow: "inset 0 0 40px rgba(99,102,241,0.05), 0 0 30px rgba(99,102,241,0.08)",
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* No Results */}
            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center py-20"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-30">
                            <rect x="2" y="3" width="20" height="18" rx="2" />
                            <line x1="8" y1="10" x2="16" y2="10" />
                            <line x1="8" y1="14" x2="12" y2="14" />
                        </svg>
                    </div>
                    <p className="text-white/30 text-sm">{t("noProjects")}</p>
                </motion.div>
            )}

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </section>
    );
}
