"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  onViewResume?: () => void;
  onOrderClick?: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center">
      
      {/* ── LAYER 1: BACK TEXT (SOLID/DIM) ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-[1] inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      >
        <h1 
          className="font-black uppercase text-center text-white/[0.08]"
          style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "clamp(3.5rem, 16vw, 15rem)", 
            lineHeight: 0.85, 
            letterSpacing: "-0.02em",
          }}
        >
          VISUAL<br />DESIGNER
        </h1>
      </motion.div>

      {/* ── LAYER 2: THE PHOTO ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-[2] w-[clamp(240px,28vw,420px)] aspect-[3/4] shadow-2xl mt-12 md:mt-0"
      >
        <div className="w-full h-full relative overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <Image
            src="/images/naufal-profile.jpg"
            alt="Naufal Adib Syahrizal"
            fill
            className="object-cover object-center"
            style={{ filter: "grayscale(20%) contrast(1.1)" }}
            priority
          />
        </div>
      </motion.div>

      {/* ── LAYER 3: FRONT TEXT (STROKE/OUTLINE ONLY) ── */}
      {/* This text is identically positioned as Layer 1, but transparent with a stroke.
          It sits on top of the image (Layer 2), creating an editorial "cutout/sandwich" effect! */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-[3] inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
      >
        <h1 
          className="font-black uppercase text-center text-transparent"
          style={{ 
            fontFamily: "var(--font-heading)", 
            fontSize: "clamp(3.5rem, 16vw, 15rem)", 
            lineHeight: 0.85, 
            letterSpacing: "-0.02em",
            WebkitTextStroke: "1px rgba(255,255,255,0.7)"
          }}
        >
          VISUAL<br />DESIGNER
        </h1>
      </motion.div>

      {/* ── MOBILE CTA (Under photo) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-[4] mt-8 md:hidden"
      >
        <button
          onClick={onOrderClick}
          className="px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.2em] text-white active:bg-white active:text-black transition-all"
        >
          Start Project
        </button>
      </motion.div>

      {/* ── DESKTOP LEFT COLUMN — Info & CTA ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-[4] left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-6"
      >
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-600 font-medium mb-1">Based in</p>
          <p className="text-sm font-semibold text-neutral-300">Jakarta, Indonesia.</p>
          <p className="text-[10px] text-neutral-600 mt-0.5">GMT+7</p>
        </div>

        <button
          onClick={onOrderClick}
          className="w-fit px-6 py-3 bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Start Project
        </button>
      </motion.div>

      {/* ── DESKTOP RIGHT COLUMN — Bio & Socials ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-[4] right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-6"
      >
        <div className="flex flex-col gap-2 items-end">
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
              className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors font-medium"
            >
              {s.label}
            </a>
          ))}
        </div>
        
        <div className="text-right max-w-[200px] border-t border-white/[0.05] pt-4 mt-4">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Specializing in minimal aesthetics & brand identity.
          </p>
        </div>
      </motion.div>

      {/* ── MOBILE SOCIALS (Bottom) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute z-[4] bottom-8 w-full flex justify-center gap-6 md:hidden"
      >
        {[
          { label: "IG", href: "https://www.instagram.com/ncs_rizal" },
          { label: "BE", href: "https://www.behance.net/naufaladibs" },
          { label: "MAIL", href: "mailto:naufaladib@gmail.com" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium"
          >
            {s.label}
          </a>
        ))}
      </motion.div>

      {/* ── AVAILABILITY BADGE ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute top-24 md:bottom-8 md:top-auto left-6 md:left-12 z-[5] flex items-center gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-30" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-medium">Available for work</span>
      </motion.div>

      {/* ── ISSUE NUMBER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-12 z-[5] hidden md:block"
      >
        <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-700 font-mono">NCS — 2026</p>
      </motion.div>

    </section>
  );
}
