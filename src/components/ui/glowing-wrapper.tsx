"use client";
import React from 'react';

interface GlowingWrapperProps {
    children: React.ReactNode;
    className?: string;
    active?: boolean;
}

export default function GlowingWrapper({ children, className = "", active = false }: GlowingWrapperProps) {
    // If not active, just return normal children (or maybe a subtle version?)
    // User asked for "animation on the navbar ... and every category button".
    // Assuming we always want the glow, or maybe stronger when active.

    if (!active) {
        return <div className={`relative ${className}`}>{children}</div>;
    }

    return (
        <div className={`relative group isolate ${className}`}>
            {/* Glow Layer 1 */}
            <div className="absolute inset-[-4px] rounded-xl z-[-1] opacity-60 blur-[3px] transition-all duration-500
                      bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3B82F6_100%)]
                      animate-spin-slow"
            />
            {/* Glow Layer 2 (Opposite) */}
            <div className="absolute inset-[-4px] rounded-xl z-[-1] opacity-60 blur-[3px] transition-all duration-500
                      bg-[conic-gradient(from_270deg_at_50%_50%,#00000000_50%,#8B5CF6_100%)]
                      animate-spin-reverse-slow"
            />

            {/* Background Mask to keep content readable */}
            <div className="absolute inset-[1px] bg-black/80 rounded-full z-[-1]" />

            {children}
        </div>
    );
}
