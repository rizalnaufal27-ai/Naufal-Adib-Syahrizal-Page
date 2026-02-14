"use client";
import { useEffect, useRef } from "react";

export default function StarBackground({ speed = 0.5 }: { speed?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const speedRef = useRef(speed);

    // Update ref when prop changes so animation loop sees it immediately
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; z: number; size: number }[] = [];

        const initStars = () => {
            stars = Array.from({ length: 800 }).map(() => ({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * canvas.width,
                size: Math.random() * 2,
            }));
        };

        const resizeRef = new ResizeObserver(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        });
        resizeRef.observe(document.body);

        const animate = () => {
            // Trail effect: instead of clearing completely, fill with low-opacity black
            // This creates a slight trail/motion blur at high speeds
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const currentSpeed = speedRef.current;

            stars.forEach((star) => {
                star.z -= currentSpeed;
                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = Math.random() * canvas.width - cx;
                    star.y = Math.random() * canvas.height - cy;
                }

                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                    const size = (1 - star.z / canvas.width) * star.size * 2;
                    const brightness = (1 - star.z / canvas.width);

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        initStars();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeRef.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
            style={{ background: "#050505" }}
        />
    );
}
