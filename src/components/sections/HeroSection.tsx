"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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

const taglines = [
  "Helping brands stand out through high-end visuals",
  "Crafting data-driven digital strategy for growth",
  "Turning creative ideas into powerful brand stories",
  "Building premium experiences that convert",
];

// Cosmic floating particles
function CosmicParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0
              ? "rgba(139,92,246,0.6)"
              : i % 3 === 1
                ? "rgba(99,102,241,0.5)"
                : "rgba(236,72,153,0.4)",
            boxShadow: `0 0 ${Math.random() * 8 + 4}px currentColor`,
            animation: `cosmicFloat ${Math.random() * 15 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      ))}
    </div>
  );
}

// Nebula background elements
function NebulaEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main nebula */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full" style={{
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
        filter: "blur(60px)",
        animation: "nebulaPulse 12s ease-in-out infinite",
      }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full" style={{
        background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(147,51,234,0.04) 40%, transparent 70%)",
        filter: "blur(80px)",
        animation: "nebulaPulse 15s ease-in-out infinite reverse",
      }} />
      {/* Cosmic dust trail */}
      <div className="absolute top-[40%] left-[20%] w-[60%] h-[2px] rotate-[-15deg]" style={{
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.15), rgba(139,92,246,0.1), transparent)",
        filter: "blur(1px)",
        animation: "cosmicTrail 8s ease-in-out infinite",
      }} />
    </div>
  );
}

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
    <section className="section-container min-h-screen flex items-center py-24 md:py-0 relative overflow-hidden">
      {/* Soft-Glow Shader Background */}
      <SoftGlowBg />
      <NebulaEffects />
      <CosmicParticles />

      {/* Cosmic grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.2) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          animation: "gridShift 20s linear infinite",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-purple-500/20 bg-purple-500/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            </span>
            <span style={{
              background: "linear-gradient(90deg, #c084fc, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{t("available")}</span>
          </div>
        </motion.div>

        {/* Profile Avatar with cosmic ring */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="relative">
            {/* Orbital ring */}
            <div className="absolute -inset-3 rounded-full border border-purple-500/20" style={{
              animation: "orbitalSpin 10s linear infinite",
            }}>
              <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </div>
            <div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.3)]"
              style={{ border: "3px solid rgba(139,92,246,0.4)" }}
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
                  boxShadow: isHovered ? "0 0 50px rgba(139,92,246,0.5), inset 0 0 30px rgba(139,92,246,0.15)" : "none",
                  opacity: isHovered ? 1 : 0,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Heading — Cosmic gradient */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center tracking-tighter leading-[0.9] mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span
            className="block pb-2"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 30%, #c084fc 70%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 35px rgba(192,132,252,0.35))",
            }}
          >
            Naufal Adib
          </span>
          <span
            className="block text-4xl md:text-5xl lg:text-6xl font-bold tracking-normal"
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 30%, #6366f1 60%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 25px rgba(124,58,237,0.45))",
            }}
          >
            Syahrizal
          </span>
        </motion.h1>

        {/* Role badge — fantasy styled */}
        <motion.p variants={fadeUp} className="text-sm md:text-base font-semibold uppercase tracking-[0.25em] mb-3"
          style={{
            background: "linear-gradient(90deg, #c084fc, #818cf8, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 30px rgba(192,132,252,0.3)",
          }}>
          ✦ Creative Designer ✦
        </motion.p>

        {/* Animated rotating tagline */}
        <motion.div variants={fadeUp} className="h-8 md:h-10 relative w-full max-w-xl overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 text-base md:text-lg text-center font-medium"
              style={{
                background: "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(192,132,252,0.8), rgba(129,140,248,0.8), rgba(6,182,212,0.7))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {taglines[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Bio — cosmic glassmorphism card */}
        <motion.div variants={fadeUp} className="w-full max-w-2xl mb-10 px-4 md:px-0">
          <div className="rounded-2xl border border-purple-500/15 bg-white/[0.02] backdrop-blur-md p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <p className="text-base md:text-lg text-white/50 leading-relaxed relative z-10" style={{ textAlign: "justify" }}>
              {t("bio")}
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Primary CTA — Cosmic gradient */}
          <MagneticButton
            onClick={onOrderClick}
            strength={0.25}
            className="group relative px-8 py-3.5 rounded-full font-semibold text-sm text-white cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6366F1, #4F46E5)",
              boxShadow: "0 8px 35px rgba(124,58,237,0.35)",
            }}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">✦</span>
              {t("cta.order")}
            </span>
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
              style={{ boxShadow: "0 0 50px rgba(124,58,237,0.5)" }}
            />
          </MagneticButton>

          {/* Secondary — Resume */}
          <button
            onClick={onViewResume}
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-white border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm transition-all hover:bg-purple-500/10 hover:border-purple-500/30 hover:scale-105 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
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
            className="px-8 py-3.5 rounded-full font-semibold text-sm text-white/60 hover:text-white transition-all flex items-center gap-2 hover:drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]"
          >
            {t("cta.contact")}
            <span className="text-xs">↗</span>
          </a>
        </motion.div>

        {/* Scroll indicator — cosmic styled */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-purple-300/30 uppercase tracking-widest">Explore</span>
            <div className="w-5 h-8 rounded-full border border-purple-500/25 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 rounded-full bg-purple-400/50"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
