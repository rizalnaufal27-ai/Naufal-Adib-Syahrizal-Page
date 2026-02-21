"use client";

import { useState, useEffect } from "react";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import { projects, Project } from "@/data/projects";
import ProjectModal from "@/components/ui/project-modal";
import WarpTunnel from "@/components/ui/warp-tunnel";
import { useTranslations } from "next-intl";
import Link from "next/link";

// Transform projects data to match CardStackItem interface
const items: CardStackItem[] = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.story,
    imageSrc: project.image || project.media[0] || "", // Fallback to first media item if cover is missing
    href: "#", // Optional link
}));

export default function ResumePage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [warpSpeed, setWarpSpeed] = useState(0.2); // State A: Idle (Slow loop)
    const [animationPhase, setAnimationPhase] = useState<'idle' | 'burst' | 'active'>('idle');
    const [showGallery, setShowGallery] = useState(false);

    // Transition Sequence
    useEffect(() => {
        // Start Sequence immediately on mount (simulating "Click View Resume")

        // Phase 1: Pre-load / Idle (Instant)
        setAnimationPhase('idle');

        // Phase 2: The Trigger & Burst (0 -> 100ms)
        const burstTimer = setTimeout(() => {
            setAnimationPhase('burst');
            setWarpSpeed(12); // High speed burst
        }, 500);

        // Phase 3: The Hand-off (2.5s)
        const galleryTimer = setTimeout(() => {
            setShowGallery(true);
            // Decelerate
            setWarpSpeed(4);
        }, 2500);

        // Phase 4: Persistence (Loop) (3.5s)
        const loopTimer = setTimeout(() => {
            setAnimationPhase('active');
            setWarpSpeed(0.5); // Cruising speed
        }, 4000);

        return () => {
            clearTimeout(burstTimer);
            clearTimeout(galleryTimer);
            clearTimeout(loopTimer);
        };
    }, []);

    const isBursting = animationPhase === 'burst';

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative text-white py-20 overflow-hidden">
            {/* Background Layer: Persistent */}
            <WarpTunnel speed={warpSpeed} gridColor={isBursting ? "rgba(6, 182, 212, 0.8)" : "rgba(6, 182, 212, 0.2)"} />

            {/* Phase 1 & 2: Resume Title / Blur Effect */}
            <div
                className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-all duration-1000 ${showGallery ? 'opacity-0 scale-150 blur-xl' : 'opacity-100 blur-0'}`}
            >
                {/* This text appears initially then blurs out/explodes */}
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter">
                    {t("resume")}
                </h1>
            </div>

            {/* Phase 3 & 4: Live Gallery */}
            <div
                className={`transition-all duration-1000 transform ${showGallery ? 'opacity-100 translate-z-0 scale-100' : 'opacity-0 translate-z-10 scale-95'} w-full flex flex-col items-center z-30`}
            >
                <div className="text-center mb-12">
                    <p className="text-sm uppercase tracking-[0.3em] mb-3 text-cyan-400">
                        {t("selectedWorks")}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        {t("projectGallery")}
                    </h1>
                </div>

                <div className="mx-auto w-full max-w-5xl p-8">
                    <CardStack
                        items={items}
                        initialIndex={0}
                        autoAdvance={showGallery} // Only auto-advance when visible
                        intervalMs={4000}
                        pauseOnHover={true}
                        showDots={true}
                        renderCard={(item, { active }) => (
                            <div
                                className="h-full w-full relative group"
                                onClick={() => {
                                    if (active) {
                                        const p = projects.find(proj => proj.id === item.id);
                                        if (p) setSelectedProject(p);
                                    }
                                }}
                            >
                                {/* Reuse default card look with click handler */}
                                <div className="absolute inset-0">
                                    {item.imageSrc && (
                                        item.imageSrc.match(/\.(mp4|webm|mov|avi)$/i) ? (
                                            <video src={item.imageSrc} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                                        ) : (
                                            <img src={item.imageSrc} alt={item.title} className="h-full w-full object-cover" />
                                        )
                                    )}
                                </div>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="relative z-10 flex h-full flex-col justify-end p-5">
                                    <div className="truncate text-lg font-semibold text-white">{item.title}</div>
                                    {item.description && <div className="mt-1 line-clamp-2 text-sm text-white/80">{item.description}</div>}
                                    <div className="mt-3 inline-flex items-center text-xs font-medium text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t("clickForDetails")} <span className="ml-1">→</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm">
                        {t("backToHome")}
                    </Link>
                </div>
            </div>

            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </div>
    );
}
