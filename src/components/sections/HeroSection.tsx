"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import SpaceBubbles from "@/components/ui/space-bubbles";

export default function HeroSection({ onViewResume }: { onViewResume?: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('Hero');

  return (
    <section className="section-container min-h-screen flex items-center py-24 md:py-0 relative overflow-hidden">
      {/* Background Bubbles - Home Section Only */}
      <div className="absolute inset-0 z-0">
        <SpaceBubbles />
      </div>

      <div className="flex flex-col items-center justify-center w-full relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 md:py-32">
        {/* Status Badge - Centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/10 shadow-xl shadow-blue-500/5 group transition-all hover:scale-105 cursor-default"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-white/80 group-hover:text-white transition-colors">{t('available')}</span>
          </div>
        </motion.div>

        {/* Profile Avatar - Small & Centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
            <img
              src="/images/naufal-profile.jpg"
              alt="Naufal Adib Syahrizal"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-center tracking-tighter leading-[0.9] mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 pb-4">
            Naufal Adib
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/20 text-3xl md:text-5xl lg:text-6xl font-bold tracking-normal">
            Syahrizal
          </span>
        </motion.h1>

        {/* University & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center text-center gap-1 mb-8"
        >
          <span className="text-xl md:text-2xl font-medium text-white/80">
            {t('university_name')}
          </span>
          <span className="text-lg md:text-xl text-white/60">
            {t('student_status')}
          </span>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-center text-white/60 max-w-2xl leading-relaxed mb-10"
        >
          {t('bio')}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <button
            onClick={onViewResume}
            className="group relative px-8 py-3 rounded-full font-semibold text-sm bg-white text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              {t('cta.resume')}
            </span>
          </button>

          <a
            href="https://wa.me/6285782074034"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full font-semibold text-sm text-white border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105 flex items-center gap-2"
          >
            {t('cta.contact')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
