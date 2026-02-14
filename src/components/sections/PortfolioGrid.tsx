"use client";
import { useState, useMemo } from "react";
import { Project, projects, ProjectCategory } from "@/data/projects";
import ProjectModal from "@/components/ui/project-modal";
import RGBBorder from "@/components/ui/rgb-border";
import { motion, AnimatePresence, Variants } from "framer-motion";

function isVideo(src: string) {
    return /\.(mp4|webm|mov|avi)$/i.test(src);
}

export default function PortfolioGrid() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");

    // Extract categories dynamically but strictly typed
    const categories = useMemo(() => {
        const uniqueCats = Array.from(new Set(projects.map((p) => p.category))).sort();
        return ["All", ...uniqueCats];
    }, []);

    // Filter projects
    const filteredProjects = useMemo(() => {
        return projects
            .filter((project) => activeCategory === "All" || project.category === activeCategory)
            .sort((a, b) => a.id - b.id); // Stabilize order
    }, [activeCategory]);

    // Stagger container
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2 // Wait for tab switch
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <section id="portfolio-grid" className="section-container py-24 relative z-10">
            <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-[0.3em] mb-3 text-cyan-400">
                    Selected Works
                </p>
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
                    Portfolio
                </h2>

                {/* Interactive Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((category) => (
                        <div key={category} className="relative group">
                            {/* Glow Effect only for Active */}
                            {activeCategory === category && (
                                <RGBBorder borderRadius="rounded-full" />
                            )}

                            <button
                                onClick={() => setActiveCategory(category as any)}
                                className={`relative px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 z-20 ${activeCategory === category
                                    ? "text-white"
                                    : "text-white/50 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Masonry Layout: Natural Aspect Ratio */}
            <motion.div
                key={activeCategory} // Re-trigger stagger on category change
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 w-full max-w-[1400px] mx-auto px-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            layoutId={`project-${project.id}`}
                            className="group relative overflow-hidden rounded-xl bg-neutral-900/50 border border-white/10 cursor-pointer break-inside-avoid mb-4 md:mb-6"
                            onClick={() => setSelectedProject(project)}
                            whileHover={{ scale: 1.02, zIndex: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Image / Video Layer */}
                            <div className="w-full">
                                {project.image ? (
                                    isVideo(project.image) ? (
                                        <video
                                            src={project.image}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
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
                                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    )
                                ) : (
                                    /* Fallback for no image: Use a fixed height or aspect ratio if needed, or just padding */
                                    <div
                                        className="w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black"
                                        style={{ background: project.gradient }}
                                    >
                                        <span className="text-white/40 text-xs font-bold tracking-widest uppercase rotate-45 transform">
                                            {project.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                    {project.category}
                                </p>
                                <h3 className="text-sm md:text-lg font-bold text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    {project.title}
                                </h3>
                                <div className="mt-2 h-[1px] w-0 group-hover:w-full bg-white/30 transition-all duration-500 delay-100" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* No Results State */}
            {filteredProjects.length === 0 && (
                <div className="w-full text-center py-20 text-white/30">
                    No projects found in this category.
                </div>
            )}

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </section>
    );
}
