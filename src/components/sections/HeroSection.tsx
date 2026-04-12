"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import MagneticButton from "@/components/ui/magnetic-button";

interface HeroSectionProps {
  onViewResume?: () => void;
  onOrderClick?: () => void;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const taglines = [
  "Helping brands stand out through high-end visuals",
  "Crafting data-driven digital strategy for growth",
  "Turning creative ideas into powerful brand stories",
  "Building premium experiences that convert",
];

export default function HeroSection({ onViewResume, onOrderClick }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const t = useTranslations("Hero");

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-container min-h-screen flex items-center py-24 md:py-0 relative overflow-hidden bg-[#0A0A0A]">
      {/* Absolute dark base */}
      <div className="absolute inset-0 z-0 bg-[#0A0A0A]" />

      {/* Subtle organic noise or extremely subtle gradient to add depth without color */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)"
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center w-full relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 md:py-32"
      >
        {/* Status Badge */}
        <motion.div variants={fadeUp} className="mb-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border border-white/10 bg-white/[0.02] text-neutral-300 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t("available")}</span>
          </div>
        </motion.div>

        {/* Profile Avatar with subtle dark aesthetic */}
        <motion.div variants={fadeUp} className="mb-8 relative z-10">
          <div className="relative">
            <div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: isHovered ? "0 10px 40px rgba(0,0,0,0.5)" : "none" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src="/images/naufal-profile.jpg"
                alt="Naufal Adib Syahrizal"
                width={112}
                height={112}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                style={{ transform: isHovered ? "scale(1.05)" : "scale(1)", filter: "grayscale(20%) contrast(1.1)" }}
                priority
              />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] pointer-events-none" />
            </div>
            {/* Subtle glow behind the avatar */}
            <div 
              className="absolute inset-0 bg-white rounded-full blur-2xl transition-opacity duration-700 pointer-events-none -z-10"
              style={{ opacity: isHovered ? 0.05 : 0.02, transform: "scale(1.2)" }}
            />
          </div>
        </motion.div>

        {/* Main Heading — High Contrast Grayscale */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center tracking-tighter leading-[0.9] mb-4 text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="block pb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400">
            Naufal Adib
          </span>
          <span className="block text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-500 to-neutral-400">
            Syahrizal
          </span>
        </motion.h1>

        {/* Role badge — minimal styled */}
        <motion.p variants={fadeUp} className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-4 text-neutral-500">
           Creative Designer 
        </motion.p>

        {/* Animated rotating tagline */}
        <motion.div variants={fadeUp} className="h-8 md:h-10 relative w-full max-w-xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 text-base md:text-lg text-center font-medium text-neutral-400"
            >
              {taglines[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Bio — clean glassmorphism card */}
        <motion.div variants={fadeUp} className="w-full max-w-2xl mb-12 px-4 md:px-0">
          <div className="rounded-2xl border border-white/[0.05] bg-black/40 backdrop-blur-sm p-6 md:p-8 shadow-2xl relative shadow-black/50">
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed relative z-10" style={{ textAlign: "justify" }}>
              {t("bio")}
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 items-center">
          {/* Primary CTA — Matte Dark with Silver Accent */}
          <MagneticButton
            onClick={onOrderClick}
            strength={0.2}
            className="group relative px-8 py-3.5 rounded-full font-semibold text-sm text-neutral-900 bg-white hover:bg-neutral-200 transition-colors cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span className="flex items-center gap-2 relative z-10">
              {t("cta.order")}
            </span>
          </MagneticButton>

          {/* Secondary — Resume */}
          <button
            onClick={onViewResume}
            className="px-8 py-3.5 rounded-full font-medium text-sm text-neutral-300 border border-white/10 bg-transparent transition-all hover:bg-white/5 hover:text-white flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            {t("cta.resume")}
          </button>

          {/* Tertiary — Contact */}
          <a
            href="https://wa.me/6285782074034"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full font-medium text-sm text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-2"
          >
            {t("cta.contact")}
            <span className="text-xs">↗</span>
          </a>
        </motion.div>

        {/* Scroll indicator — minimalist */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-8 rounded-full border border-neutral-700 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-neutral-500"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
