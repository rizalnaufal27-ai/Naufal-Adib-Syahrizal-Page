"use client";
import { useState, useCallback } from "react";

function isVideo(src: string) {
    return /\.(mp4|webm|mov|avi)$/i.test(src);
}

export default function MediaCarousel({ media, gradient }: { media: string[]; gradient: string }) {
    const [current, setCurrent] = useState(0);

    const prev = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent((c) => (c === 0 ? media.length - 1 : c - 1));
    }, [media.length]);

    const next = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent((c) => (c === media.length - 1 ? 0 : c + 1));
    }, [media.length]);

    if (media.length === 0) {
        return (
            <div
                className="w-full h-full min-h-[300px] lg:min-h-[500px] flex items-center justify-center"
                style={{ background: gradient }}
            >
                <div className="text-center text-white/40 p-8">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p className="text-sm">Coming Soon</p>
                </div>
            </div>
        );
    }

    const src = media[current];

    return (
        <div className="relative w-full min-h-[300px] lg:min-h-[500px] flex items-center justify-center" style={{ background: "#0a0a0a" }}>
            {isVideo(src) ? (
                <video
                    src={src}
                    controls
                    className="w-full h-full max-h-[500px] object-contain"
                    style={{ background: "#000" }}
                />
            ) : (
                <img
                    src={src}
                    alt={`Slide ${current + 1}`}
                    className="w-full h-full max-h-[500px] object-contain"
                    style={{ background: "#0a0a0a" }}
                />
            )}

            {/* Navigation arrows — only show when there are multiple items */}
            {media.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {media.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrent(i);
                                }}
                                className="w-2 h-2 rounded-full transition-all duration-300"
                                style={{
                                    background: i === current ? "var(--color-primary)" : "rgba(255,255,255,0.3)",
                                    transform: i === current ? "scale(1.3)" : "scale(1)",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Media type badge */}
            {media.length > 1 && (
                <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                    {current + 1} / {media.length}
                </div>
            )}
        </div>
    );
}
