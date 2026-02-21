"use client";

export default function SoftGlowBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {/* Primary orb — blue/violet */}
            <div
                className="absolute rounded-full"
                style={{
                    width: "55vw",
                    height: "55vw",
                    maxWidth: 700,
                    maxHeight: 700,
                    top: "-15%",
                    left: "-10%",
                    background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0) 70%)",
                    animation: "glowDrift1 18s ease-in-out infinite",
                    filter: "blur(60px)",
                }}
            />
            {/* Secondary orb — pastel pink */}
            <div
                className="absolute rounded-full"
                style={{
                    width: "45vw",
                    height: "45vw",
                    maxWidth: 550,
                    maxHeight: 550,
                    bottom: "-10%",
                    right: "-8%",
                    background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(236,72,153,0) 70%)",
                    animation: "glowDrift2 22s ease-in-out infinite",
                    filter: "blur(50px)",
                }}
            />
            {/* Tertiary orb — sky blue */}
            <div
                className="absolute rounded-full"
                style={{
                    width: "35vw",
                    height: "35vw",
                    maxWidth: 400,
                    maxHeight: 400,
                    top: "40%",
                    right: "20%",
                    background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, rgba(56,189,248,0) 70%)",
                    animation: "glowDrift3 15s ease-in-out infinite",
                    filter: "blur(40px)",
                }}
            />
            <style jsx>{`
        @keyframes glowDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes glowDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, -25px) scale(1.08); }
        }
        @keyframes glowDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(25px, -20px) scale(1.06); }
          80% { transform: translate(-15px, 10px) scale(0.95); }
        }
      `}</style>
        </div>
    );
}
