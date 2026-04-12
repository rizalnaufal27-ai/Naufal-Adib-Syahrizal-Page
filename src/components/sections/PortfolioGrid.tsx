"use client";
import { useState, useMemo } from "react";
import { Project, projects, ProjectCategory } from "@/data/projects";
import ProjectModal from "@/components/ui/project-modal";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function isVideo(src: string) {
    return /\.(mp4|webm|mov|avi)$/i.test(src);
}

export default function PortfolioGrid() {
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

    return (
        <section id="portfolio-grid" className="w-full py-24 bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Header — reference style: big uppercase "WORK" + thin horizontal rule */}
                <div className="mb-16 border-b border-white/[0.06] pb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        WORK
                    </motion.h2>
                </div>

                {/* Category Filter — minimal, no rounded pills */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category as ProjectCategory | "All")}
                            className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 py-1 border-b-2 ${
                                activeCategory === category
                                    ? "text-white border-white"
                                    : "text-neutral-500 border-transparent hover:text-neutral-300"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid — 3 columns flat, no masonry, reference style */}
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.04]"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="group cursor-pointer bg-[#0A0A0A] overflow-hidden relative"
                                onClick={() => setSelectedProject(project)}
                            >
                                {/* Image / Video */}
                                <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-900">
                                    {project.image ? (
                                        isVideo(project.image) ? (
                                            <video
                                                src={project.image}
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                                style={{ filter: "grayscale(80%)" }}
                                                onMouseEnter={(e) => { e.currentTarget.play(); e.currentTarget.style.filter = "grayscale(0%)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; e.currentTarget.style.filter = "grayscale(80%)"; }}
                                            />
                                        ) : (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:[filter:grayscale(0%)] [filter:grayscale(80%)]"
                                                loading="lazy"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-neutral-700 text-xs font-bold tracking-widest uppercase">{project.category}</span>
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                                        <span className="text-[10px] uppercase tracking-widest text-white font-semibold border border-white/30 px-4 py-2">View Project</span>
                                    </div>
                                </div>

                                {/* Label below image — reference style */}
                                <div className="px-4 py-4 border-t border-white/[0.04]">
                                    <p className="text-sm font-semibold text-white tracking-tight">
                                        {project.title}
                                        <span className="text-neutral-500 font-normal ml-2">| {project.category}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No Results */}
                {filteredProjects.length === 0 && (
                    <div className="w-full text-center py-20">
                        <p className="text-neutral-600 text-sm uppercase tracking-widest">No projects found.</p>
                    </div>
                )}
            </div>

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </section>
    );
}
