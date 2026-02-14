"use client";
import React, { useEffect } from "react";
import { Project } from "@/data/projects";
import MediaCarousel from "./media-carousel";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    useEffect(() => {
        if (project) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [project]);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)" }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl relative"
                        style={{
                            background: "rgba(10,10,10,0.95)",
                            border: "1px solid var(--color-border)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left: Media Carousel */}
                            <MediaCarousel media={project.media} gradient={project.gradient} />

                            {/* Right: Context */}
                            <div className="p-8 lg:p-10 space-y-6">
                                <div>
                                    <button
                                        onClick={onClose}
                                        className="float-right p-2 rounded-full transition-colors hover:bg-white/5"
                                        style={{ color: "var(--color-text-muted)" }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--color-highlight)" }}>
                                        {project.category}
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                                        {project.title}
                                    </h2>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Story & Philosophy
                                    </h4>
                                    <p className="leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                                        {project.story}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Tools Used
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools.map((tool) => (
                                            <span
                                                key={tool}
                                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                                style={{
                                                    background: "rgba(59,130,246,0.1)",
                                                    color: "var(--color-primary)",
                                                    border: "1px solid rgba(59,130,246,0.2)",
                                                }}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
