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
        return () => { document.body.style.overflow = "auto"; };
    }, [project]);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                    style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.97 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.97 }}
                        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                        className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-[#0A0A0A] relative"
                        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 text-neutral-500 hover:text-white transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh]">
                            {/* Left: Media */}
                            <div className="overflow-hidden">
                                <MediaCarousel media={project.media} gradient={project.gradient} />
                            </div>

                            {/* Right: The Explanation Room */}
                            <div className="overflow-y-auto p-8 md:p-10 flex flex-col">
                                <div className="mb-6">
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-1">
                                        {project.category}
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                                        {project.title}
                                    </h2>
                                </div>

                                {/* The Explanation Room box — reference style */}
                                <div
                                    className="rounded-none p-6 mb-6 flex-1"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">THE EXPLANATION ROOM</h4>
                                        <div className="flex gap-1">
                                            {[0,1,2,3].map(i => (
                                                <div key={i} className="w-2 h-2 rounded-full border border-neutral-600" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-neutral-300 uppercase tracking-widest mb-2">Story & Philosophy</p>
                                    <p className="text-sm text-neutral-400 leading-relaxed">
                                        {project.story}
                                    </p>
                                </div>

                                {/* Tools — reference: outlined pills, monochrome, uppercase */}
                                <div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools.map((tool) => (
                                            <span
                                                key={tool}
                                                className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 border border-neutral-700 hover:border-white hover:text-white transition-colors"
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
