"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  onViewResume?: () => void;
  onOrderClick?: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col items-center justify-center pt-[72px]">
      
      {/* ── CENTRAL COLUMN (Photo) ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[2] flex flex-col items-center w-full max-w-[340px]"
      >
        <div 
          className="relative w-full aspect-[3/4] rounded-[24px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]" 
          style={{ 
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.9), inset 0 0 20px rgba(255,255,255,0.05)"
          }}
        >
          <Image
            src="/images/naufal-profile.jpg"
            alt="Naufal Adib Syahrizal"
            fill
            className="object-cover object-center grayscale-[20%]"
            priority
          />
          {/* Subtle bottom gradient to match mockup's mood */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent pointer-events-none" />
        </div>
        
        <div className="mt-8 flex flex-col items-center z-[4]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Featured Projects</p>
          <p className="text-[11px] text-neutral-400 text-center mt-2 w-[90%] leading-relaxed">
            Crafting meaningful narratives through visual experiences and photographic storytelling.
          </p>
        </div>
      </motion.div>

      {/* ── LEFT COLUMN (Text) ── */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-6 md:left-[5vw] xl:left-[8vw] top-[30%] md:top-[45%] -translate-y-1/2 z-[3] pointer-events-none"
      >
        <h1 
          className="text-transparent font-serif"
          style={{ 
            fontSize: "clamp(4rem, 8vw, 9.5rem)",
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            WebkitTextStroke: "0.5px rgba(255,255,255,0.4)"
          }}
        >
          VISUAL<span className="font-light italic ml-2 md:ml-4 text-white/50">/</span><br />
          DESIGNER
        </h1>
      </motion.div>

      {/* ── RIGHT COLUMN (Bio & Socials) ── */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-6 md:right-[5vw] xl:right-[8vw] top-auto bottom-8 md:bottom-auto md:top-1/2 md:-translate-y-[40%] z-[3] flex flex-col items-start gap-6 w-[calc(100%-48px)] md:w-[clamp(240px,20vw,280px)]"
      >
        <p className="text-sm md:text-[15px] text-neutral-300 leading-relaxed font-light hidden md:block">
          Based in Jakarta. Specializing in minimal aesthetics, brand identity, and creative visual design for modern digital platforms.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 rounded-full border border-neutral-600 text-[11px] font-medium text-neutral-300 uppercase tracking-[0.15em] hover:border-white hover:text-white transition-colors backdrop-blur-[2px] pointer-events-auto w-fit text-left"
          >
            View Portfolio
          </button>
          <button 
            onClick={onOrderClick}
            data-order-trigger="true"
            className="px-6 py-2.5 rounded-full bg-white text-black border border-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-neutral-200 transition-colors pointer-events-auto w-fit text-left"
          >
            Start a Project
          </button>
        </div>
        
        <div className="hidden md:flex items-center gap-5 mt-2">
          <a href="https://www.instagram.com/ncs_rizal" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors pointer-events-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://www.behance.net/naufaladibs" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors pointer-events-auto">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14H3v-4h4a2 2 0 1 1 0 4z M7 14a2 2 0 1 0 0 4H3v-4h4z M14 10h5M14 14h6M14 10v8M20 14v4M14 14c0-2-1-4-3-4M14 14c0 2-1 4-3 4"></path></svg>
          </a>
        </div>
        
        <div className="hidden md:flex items-center gap-4 w-full mt-2">
          <span className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] shrink-0 font-medium">Selected Works</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>
      </motion.div>

    </section>
  );
}
