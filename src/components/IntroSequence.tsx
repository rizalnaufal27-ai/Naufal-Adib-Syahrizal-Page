"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface IntroSequenceProps {
    onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
    const t = useTranslations("IntroSequence");
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start exit sequence after 4.5 seconds
        const timer = setTimeout(() => {
            setIsExiting(true);
            // Trigger completion after exit animation
            setTimeout(onComplete, 800);
        }, 4500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Core */}
                        <motion.div
                            className="w-4 h-4 rounded-full bg-blue-500 blur-[2px]"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                                boxShadow: [
                                    "0 0 10px rgba(59,130,246,0.5)",
                                    "0 0 20px rgba(59,130,246,1)",
                                    "0 0 10px rgba(59,130,246,0.5)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Inner Ring */}
                        <motion.div
                            className="absolute border border-blue-500/30 rounded-full w-16 h-16 border-t-blue-400 border-r-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Middle Ring */}
                        <motion.div
                            className="absolute border border-purple-500/20 rounded-full w-24 h-24 border-b-purple-400 border-l-transparent"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Outer Ring */}
                        <motion.div
                            className="absolute border border-cyan-500/10 rounded-full w-32 h-32 border-l-cyan-400 border-r-transparent"
                            animate={{ rotate: 180 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Loading Text */}
                        <motion.p
                            className="absolute mt-48 text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {t("initializing")}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
