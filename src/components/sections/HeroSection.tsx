"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  onViewResume?: () => void;
  onOrderClick?: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Navbar spacer */}
      <div className="h-[72px]" />

      {/* ── FULL BLEED LAYOUT ── */}
      <div className="relative w-full" style={{ minHeight: "calc(100vh - 72px)" }}>

        {/* ── BACKGROUND TYPOGRAPHY (behind photo) ── */}
        {/* "VISUAL" — top left, bleeds off left edge */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-[1] select-none pointer-events-none"
          style={{
            top: "6%",
            left: "-2vw",
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(5rem, 14vw, 16rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          VISUAL
        </motion.div>

        {/* "DESIGNER" — bottom, bleeds off right edge, slightly overlaps bottom of photo */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="absolute z-[3] select-none pointer-events-none"
          style={{
            bottom: "8%",
            right: "-2vw",
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(5rem, 14vw, 16rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.18)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          DESIGNER
        </motion.div>

        {/* ── CENTER PHOTO (z-index: 2, between the two text layers) ── */}
        <div
          className="absolute z-[2]"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(260px, 30vw, 480px)",
            aspectRatio: "3/4",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full h-full overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Image
              src="/images/naufal-profile.jpg"
              alt="Naufal Adib Syahrizal"
              fill
              className="object-cover object-top"
              style={{ filter: "grayscale(30%) contrast(1.05)" }}
              priority
            />
            {/* Bottom fade so "DESIGNER" text merges naturally */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "35%",
                background: "linear-gradient(to top, #0A0A0A 0%, transparent 100%)",
              }}
            />
          </motion.div>
        </div>

        {/* ── LEFT COLUMN — info, anchored to left side ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-[4] hidden md:flex flex-col gap-6"
          style={{ left: "4vw", top: "50%", transform: "translateY(-50%)" }}
        >
          {/* Label */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-medium mb-1">Based in</p>
            <p className="text-sm font-semibold text-neutral-300">Jakarta, Indonesia.</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">GMT+7</p>
          </div>

          {/* CTA */}
          <button
            onClick={onOrderClick}
            className="w-fit px-6 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            View Portfolio ↓
          </button>

          {/* Socials */}
          <div className="flex flex-col gap-2">
            {[
              { label: "IG", href: "https://www.instagram.com/ncs_rizal" },
              { label: "Behance", href: "https://www.behance.net/naufaladibs" },
              { label: "Email", href: "mailto:naufaladib@gmail.com" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-colors font-medium"
              >
                {s.label} →
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN — bio + CTA, anchored to right side ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-[4] hidden md:flex flex-col gap-5"
          style={{
            right: "4vw",
            top: "50%",
            transform: "translateY(-50%)",
            maxWidth: "220px",
            textAlign: "right",
          }}
        >
          <p className="text-xs text-neutral-400 leading-relaxed">
            Specializing in minimal aesthetics, brand identity, and creative visual design for modern digital platforms.
          </p>

          <button
            onClick={onOrderClick}
            className="ml-auto w-fit text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/15 px-5 py-3 hover:bg-white hover:text-black transition-all duration-300"
          >
            Start a Project
          </button>

          <div className="ml-auto border-t border-white/[0.05] pt-4 w-full">
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-700 font-medium">Selected Works ────</p>
          </div>
        </motion.div>

        {/* ── MOBILE FALLBACK — stacked layout ── */}
        <div className="md:hidden flex flex-col items-center justify-center px-6 pt-8 pb-20" style={{ minHeight: "calc(100vh - 72px)" }}>
          <h1
            className="font-black uppercase text-center text-white mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 18vw, 6rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            VISUAL<br />DESIGNER
          </h1>
          <div className="relative w-full max-w-[260px] aspect-[3/4] overflow-hidden mb-8" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <Image
              src="/images/naufal-profile.jpg"
              alt="Naufal Adib Syahrizal"
              fill
              className="object-cover object-top"
              style={{ filter: "grayscale(30%) contrast(1.05)" }}
              priority
            />
          </div>
          <button
            onClick={onOrderClick}
            className="px-8 py-3 border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all"
          >
            View Portfolio ↓
          </button>
        </div>

        {/* ── AVAILABILITY BADGE ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-6 md:left-12 z-[5] flex items-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-medium">Available for freelance</span>
        </motion.div>

        {/* ── ISSUE NUMBER (fashion mag detail) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-6 md:right-12 z-[5] hidden md:block"
        >
          <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-700 font-mono">NCS — 2026 / PORTFOLIO</p>
        </motion.div>
      </div>
    </section>
  );
}
