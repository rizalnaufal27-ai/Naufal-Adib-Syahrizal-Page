"use client";

export default function AuroraBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden" style={{ background: "#050505" }}>
            {/* Aurora Blob 1 - Blue */}
            <div
                className="absolute rounded-full blur-[120px]"
                style={{
                    width: "600px",
                    height: "600px",
                    top: "-15%",
                    left: "-10%",
                    background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
                    animation: "aurora 15s ease infinite",
                }}
            />
            {/* Aurora Blob 2 - Violet */}
            <div
                className="absolute rounded-full blur-[120px]"
                style={{
                    width: "500px",
                    height: "500px",
                    top: "30%",
                    right: "-5%",
                    background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
                    animation: "aurora 18s ease infinite reverse",
                }}
            />
            {/* Aurora Blob 3 - Cyan */}
            <div
                className="absolute rounded-full blur-[120px]"
                style={{
                    width: "400px",
                    height: "400px",
                    bottom: "10%",
                    left: "20%",
                    background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
                    animation: "aurora 20s ease infinite",
                    animationDelay: "-5s",
                }}
            />
            {/* Extra glow center */}
            <div
                className="absolute rounded-full blur-[150px]"
                style={{
                    width: "300px",
                    height: "300px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
                    animation: "aurora 25s ease infinite reverse",
                    animationDelay: "-10s",
                }}
            />
        </div>
    );
}
