"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  onViewResume?: () => void;
  onOrderClick?: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col">
      {/* Navbar spacer */}
      <div className="h-[72px] flex-shrink-0" />

      {/* Main grid layout — reference style */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-0 relative">

        {/* BIG TITLE — left column, vertically centered */}
        <div className="md:col-span-5 flex flex-col justify-center py-12 md:py-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="text-[13vw] md:text-[7vw] lg:text-[6.5vw] font-black leading-[0.85] tracking-tighter text-white uppercase select-none"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              VISUAL
              <span className="block text-neutral-600 leading-[0.9]">/</span>
              DESIGNER
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex flex-col gap-4"
          >
            <button
              onClick={onOrderClick}
              className="w-fit px-6 py-3 border border-white/20 text-xs font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              View Portfolio ↓
            </button>
          </motion.div>
        </div>

        {/* CENTER IMAGE — col 5-9 */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4 relative flex items-center justify-center py-8 md:py-16"
        >
          <div
            className="relative w-full max-w-[340px] md:max-w-full mx-auto aspect-[3/4] overflow-hidden"
            style={{ borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Image
              src="/images/naufal-profile.jpg"
              alt="Naufal Adib Syahrizal"
              fill
              className="object-cover object-top"
              style={{ filter: "grayscale(40%) contrast(1.05)" }}
              priority
            />
            {/* Bottom gradient fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

            {/* Caption below image */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-medium">FEATURED PROJECTS</p>
              <p className="text-xs text-neutral-600 mt-1">Crafting meaningful narratives through visual storytelling.</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN — bio + social + selected works label */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-3 flex flex-col justify-center py-8 md:py-0 md:pl-8 border-l border-white/[0.05] hidden md:flex"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Based in</p>
            <p className="text-sm font-medium text-neutral-300">Jakarta, Indonesia.</p>
            <p className="text-xs text-neutral-500 mt-1">GMT+7</p>
          </div>

          <div className="mb-8">
            <p className="text-sm text-neutral-400 leading-relaxed">
              Specializing in minimal aesthetics, brand identity, and creative visual design for modern digital platforms.
            </p>
          </div>

          <button
            onClick={onOrderClick}
            className="w-fit text-xs font-semibold uppercase tracking-widest text-white border border-white/15 px-5 py-3 hover:bg-white hover:text-black transition-all duration-300 mb-8"
          >
            Start a Project
          </button>

          {/* Social icons — monochrome */}
          <div className="flex gap-4 mb-12">
            <a href="https://www.instagram.com/ncs_rizal" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">IG</a>
            <a href="https://www.behance.net/naufaladibs" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">Be</a>
            <a href="mailto:naufaladib@gmail.com" className="text-neutral-600 hover:text-white transition-colors text-xs uppercase tracking-widest font-medium">Email</a>
          </div>

          <div className="border-t border-white/[0.05] pt-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 font-medium">Selected Works ────</p>
          </div>
        </motion.div>
      </div>

      {/* Availability badge — bottom left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-6 md:left-12 flex items-center gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Available for freelance</span>
      </motion.div>
    </section>
  );
}
