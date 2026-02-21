"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import MagneticButton from "@/components/ui/magnetic-button";
import SoftGlowBg from "@/components/ui/soft-glow-bg";

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

export default function HeroSection({ onViewResume, onOrderClick }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("Hero");

  return (
    <section className="section-container min-h-screen flex items-center py-24 md:py-0 relative overflow-hidden">
      {/* Soft-Glow Shader Background */}
      <SoftGlowBg />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-white/80">{t("available")}</span>
          </div>
        </motion.div>

        {/* Profile Avatar */}
        <motion.div variants={fadeUp} className="mb-8">
          <div
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl"
            style={{ border: "3px solid rgba(99,102,241,0.3)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src="/images/naufal-profile.jpg"
              alt="Naufal Adib Syahrizal"
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
            />
            <div
              className="absolute inset-0 rounded-full transition-opacity duration-500"
              style={{
                boxShadow: isHovered
                  ? "0 0 40px rgba(99,102,241,0.35), inset 0 0 20px rgba(99,102,241,0.1)"
                  : "none",
                opacity: isHovered ? 1 : 0,
              }}
            />
          </div>
        </motion.div>

        {/* Main Heading — staggered entrance */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center tracking-tighter leading-[0.9] mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 pb-2">Naufal Adib</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/20 text-3xl md:text-5xl lg:text-6xl font-bold tracking-normal">
            Syahrizal
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p variants={fadeUp} className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-indigo-400/80 mb-2">
          Creative Design Studio
        </motion.p>
        <motion.p variants={fadeUp} className="text-base md:text-lg text-white/70 max-w-3xl text-center mb-6">
          Helping brands stand out and convert through high-end visuals and data-driven digital strategy.
        </motion.p>

        {/* Bio */}
        <motion.p variants={fadeUp} className="text-lg md:text-xl text-center text-white/50 max-w-2xl leading-relaxed mb-10">
          {t("bio")}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Primary CTA — Magnetic */}
          <MagneticButton
            onClick={onOrderClick}
            strength={0.25}
            className="group relative px-8 py-3.5 rounded-full font-semibold text-sm text-white cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6366F1, #4F46E5)",
              boxShadow: "0 8px 30px rgba(99,102,241,0.3)",
            }}
          >
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Place an Order
            </span>
            {/* Glow behind button */}
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
              style={{ boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
            />
          </MagneticButton>

          {/* Secondary — Resume */}
          <button
            onClick={onViewResume}
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-white border border-white/15 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 flex items-center gap-2"
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
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-white/60 hover:text-white transition-all flex items-center gap-2 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            {t("cta.contact")}
            <span className="text-xs">↗</span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 rounded-full bg-white/40"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
