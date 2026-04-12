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

const taglines = [
  "Visual Architect.",
  "Digital Experiences.",
  "Brand Identities.",
  "Creative Solutions."
];

export default function HeroSection({ onViewResume, onOrderClick }: HeroSectionProps) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const t = useTranslations("Hero");

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center bg-[#050505] overflow-hidden selection:bg-white/20">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 flex flex-col justify-center h-full pt-20">
        
        {/* Top Meta Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-between items-center w-full mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3">
             <div className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-40 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">Available for freelance</span>
          </div>
          
          <div className="hidden md:block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Based in Jakarta, ID
          </div>
        </motion.div>

        {/* Massive Typography Hero */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <h1 className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] font-black leading-[0.85] tracking-tighter text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Naufal <span className="text-neutral-700">Adib</span><br/>
              Syahrizal<span className="text-neutral-500">.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute -right-4 md:right-10 top-0 md:top-10 w-[30vw] min-w-[200px] max-w-[350px] aspect-[3/4] grayscale-[80%] hover:grayscale-0 transition-all duration-700 opacity-60 mix-blend-lighten hidden sm:block"
          >
            <div className="w-full h-full relative overflow-hidden rounded-sm" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
               <Image
                  src="/images/naufal-profile.jpg"
                  alt="Naufal Adib Syahrizal"
                  fill
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                  priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 md:mt-24 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          
          {/* Dynamic Role / Tagline */}
          <div className="w-full md:w-1/3">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Role / Focus</p>
            <div className="h-8 overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={taglineIndex}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute text-lg md:text-xl font-medium text-neutral-300"
                >
                  {taglines[taglineIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-sm text-neutral-500 mt-6 leading-relaxed max-w-sm">
              {t("bio")}
            </p>
          </div>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-row gap-4"
          >
            <MagneticButton
              onClick={onOrderClick}
              strength={0.3}
              className="px-8 py-4 bg-white text-black text-sm font-semibold uppercase tracking-widest rounded-none border border-white hover:bg-transparent hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              Start Project
            </MagneticButton>
            
            <a
              href="mailto:naufaladib@gmail.com"
              className="px-8 py-4 bg-transparent text-white text-sm font-semibold uppercase tracking-widest rounded-none border border-white/20 hover:border-white transition-all duration-300 flex items-center justify-center backdrop-blur-md"
            >
              Email Me
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
