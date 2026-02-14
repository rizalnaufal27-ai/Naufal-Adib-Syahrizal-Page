"use client";
import React, { useEffect, useRef } from "react";

interface WarpTunnelProps {
    speed?: number; // Speed multiplier
    gridColor?: string; // Color of the grid lines
}

export default function WarpTunnel({ speed = 1, gridColor = "rgba(0, 255, 255, 0.4)" }: WarpTunnelProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const speedRef = useRef(speed);

    // Update ref when prop changes
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        // Tunnel Configuration
        const numRings = 30;
        const numSectors = 10; // "10 sections" as per request
        let rings: { z: number }[] = [];

        const initRings = () => {
            rings = [];
            for (let i = 0; i < numRings; i++) {
                rings.push({ z: (i / numRings) * 1000 }); // Distribute rings along Z-axis
            }
        };

        const resizeRef = new ResizeObserver(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initRings();
        });
        resizeRef.observe(document.body);

        const animate = () => {
            // Clear or trail
            ctx.fillStyle = "rgba(5, 5, 10, 0.2)"; // Deep space blue-black
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const currentSpeed = speedRef.current; // Use Ref for latest value

            // Update Ring positions
            rings.forEach((ring) => {
                ring.z -= currentSpeed * 5; // Movement speed scaling
                if (ring.z <= 0) {
                    ring.z = 1000; // Reset to back
                }
            });

            // Draw Tunnel
            // Sort by Z (furthest first)
            const sortedRings = [...rings].sort((a, b) => b.z - a.z);

            ctx.lineWidth = 1;

            // Draw Radial Lines (fixed perspective)
            for (let s = 0; s < numSectors; s++) {
                const angle = (s / numSectors) * Math.PI * 2;
                const xFar = cx + Math.cos(angle) * (canvas.width * 2); // Extend far beyond canvas
                const yFar = cy + Math.sin(angle) * (canvas.height * 2);

                // Opacity fades with distance
                // But radial lines are "walls", so they should be persistent
                ctx.strokeStyle = gridColor;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(xFar, yFar);
                ctx.stroke();
            }

            // Draw Moving Rings (Polygons)
            sortedRings.forEach((ring) => {
                const scale = 100 / ring.z; // Perspective projection
                const brightness = (1 - ring.z / 1000); // Fade out in distance

                ctx.strokeStyle = `rgba(6, 182, 212, ${brightness})`; // Cyan glow
                ctx.beginPath();

                for (let s = 0; s <= numSectors; s++) {
                    const angle = (s / numSectors) * Math.PI * 2;
                    // Radius at this Z depth. 
                    // Let's say the tunnel is 500 units wide at Z=0? No, Z=0 is camera.
                    // Scale factor determines screen size.
                    // Raw radius = 400 (arbitrary world units)
                    const radius = 800 * scale;
                    const x = cx + Math.cos(angle) * radius;
                    const y = cy + Math.sin(angle) * radius;

                    if (s === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        initRings();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeRef.disconnect();
        };
    }, [gridColor]); // Re-run if static props change (speed handled by ref)

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{ background: "#050510" }} // Deep space background
        />
    );
}
