"use client";

import { motion } from "framer-motion";

export default function RedSpaceAura() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-[#050505]">
            {/* 
        We use a base dark background #050505 here because SpaceBubbles will become transparent.
        This ensures we don't fallback to white.
      */}

            {/* Aura Layer 1: Deep Red Bottom Left */}
            <motion.div
                animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px]"
                style={{
                    background: "radial-gradient(circle, rgba(139,0,0,0.4) 0%, rgba(50,0,0,0) 70%)",
                }}
            />

            {/* Aura Layer 2: Orange/Crimson Top Right */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.25, 0.1],
                    scale: [1.1, 0.9, 1.1],
                    x: [0, -30, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px]"
                style={{
                    background: "radial-gradient(circle, rgba(220,20,60,0.3) 0%, rgba(50,0,0,0) 70%)",
                }}
            />

            {/* Aura Layer 3: Central Subtle Pulse */}
            <motion.div
                animate={{
                    opacity: [0, 0.1, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[150px]"
                style={{
                    background: "radial-gradient(circle, rgba(255,69,0,0.15) 0%, rgba(0,0,0,0) 60%)",
                }}
            />
        </div>
    );
}
