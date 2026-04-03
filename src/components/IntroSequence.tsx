"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface IntroSequenceProps {
    onComplete: () => void;
}

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
    const t = useTranslations("IntroSequence");
    const [phase, setPhase] = useState<"curtain" | "reveal" | "done">("curtain");

    const startReveal = useCallback(() => {
        setPhase("reveal");
        setTimeout(onComplete, 900);
    }, [onComplete]);

    useEffect(() => {
        const timer = setTimeout(startReveal, 2400);
        return () => clearTimeout(timer);
    }, [startReveal]);

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ background: "#0A0A0A" }}
                    exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
                >
                    {/* Curtain Top */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-1/2"
                        style={{ background: "#0A0A0A", zIndex: 2 }}
                        animate={phase === "reveal" ? { y: "-100%" } : { y: "0%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Curtain Bottom */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1/2"
                        style={{ background: "#0A0A0A", zIndex: 2 }}
                        animate={phase === "reveal" ? { y: "100%" } : { y: "0%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Center Content */}
                    <div className="relative z-10 text-center">
                        {/* Monogram */}
                        <motion.div
                            className="text-4xl md:text-5xl font-bold tracking-tighter mb-3"
                            style={{ fontFamily: "var(--font-heading)", color: "#fff" }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        >
                            NA
                        </motion.div>

                        {/* Thin divider line */}
                        <motion.div
                            className="w-8 h-px mx-auto mb-3"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        />

                        {/* Subtitle */}
                        <motion.p
                            className="text-[10px] uppercase tracking-[0.4em] font-medium"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            {t("initializing")}
                        </motion.p>

                        {/* Minimal progress bar */}
                        <motion.div
                            className="mt-4 mx-auto h-px overflow-hidden"
                            style={{ width: "48px", background: "rgba(255,255,255,0.06)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <motion.div
                                className="h-full"
                                style={{ background: "rgba(255,255,255,0.3)" }}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.4, delay: 1, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
