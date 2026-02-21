"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FloatingOrderFabProps {
    onClick: () => void;
}

export default function FloatingOrderFab({ onClick }: FloatingOrderFabProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <AnimatePresence>
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.5 }}
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="fixed bottom-6 right-24 z-[140] flex items-center gap-2 rounded-full cursor-pointer transition-all duration-300"
                style={{
                    padding: hovered ? "14px 24px" : "14px 18px",
                    background: "rgba(99,102,241,0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: hovered
                        ? "0 8px 40px rgba(99,102,241,0.3), inset 0 0 20px rgba(99,102,241,0.05)"
                        : "0 4px 20px rgba(99,102,241,0.15)",
                }}
            >
                {/* Pulse ring */}
                <span
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: "1px solid rgba(99,102,241,0.2)",
                        animation: "fabPulse 3s ease-in-out infinite",
                    }}
                />

                {/* Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>

                {/* Label — expands on hover */}
                <motion.span
                    animate={{ width: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden"
                >
                    Place an Order
                </motion.span>

                <style jsx>{`
          @keyframes fabPulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.15); opacity: 0; }
          }
        `}</style>
            </motion.button>
        </AnimatePresence>
    );
}
