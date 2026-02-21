"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import IntroSequence from "@/components/IntroSequence";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import SkillsMarquee from "@/components/sections/SkillsMarquee";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import ProfileSection from "@/components/sections/ProfileSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DashboardPreview from "@/components/sections/DashboardPreview";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import OrderFormModal from "@/components/OrderFormModal";
import FloatingOrderFab from "@/components/ui/floating-order-fab";

// Lazy load heavy visual components
const SpaceBubbles = dynamic(() => import("@/components/ui/space-bubbles"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/20" />
});
const RedSpaceAura = dynamic(() => import("@/components/ui/red-space-aura"), { ssr: false });

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [viewingResume, setViewingResume] = useState(false);

  const handleOrderClick = useCallback(() => {
    setOrderFormOpen(true);
  }, []);

  const handleViewResume = useCallback(() => {
    setViewingResume(true);
  }, []);

  const handleCloseResume = useCallback(() => {
    setViewingResume(false);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  if (!introComplete) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <>
      {/* 1. Persistent Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        <RedSpaceAura />
        <SpaceBubbles />
      </div>

      <Navbar onOrderClick={handleOrderClick} />

      {/* 2. Main Content */}
      <main
        className={`relative z-10 transition-opacity duration-800 ${viewingResume ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-300'}`}
      >
        <section id="home">
          <HeroSection onViewResume={handleViewResume} onOrderClick={handleOrderClick} />
        </section>

        {/* Dark Cosmic Sections */}
        <div className="relative z-10 pb-20" style={{ background: "linear-gradient(180deg, #050510 0%, #0a0a1f 15%, #080818 30%, #0c0820 50%, #0a0a1a 70%, #060612 85%, #050510 100%)" }}>

          {/* ═══ Section Divider: Hero → Profile ═══ */}
          <div className="relative h-24 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(192,132,252,0.6), rgba(139,92,246,0.4), transparent)" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: "#c084fc", boxShadow: "0 0 20px rgba(192,132,252,0.8), 0 0 60px rgba(192,132,252,0.3)", animation: "glowPulse 3s ease-in-out infinite" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-dashed" style={{ borderColor: "rgba(192,132,252,0.2)", animation: "orbitalSpin 8s linear infinite" }} />
          </div>

          <section id="profile"><ProfileSection /></section>

          {/* ═══ Section Divider ═══ */}
          <div className="relative h-20 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(236,72,153,0.3) 30%, rgba(139,92,246,0.4) 50%, rgba(99,102,241,0.3) 70%, transparent 95%)" }} />
            <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#ec4899", boxShadow: "0 0 10px rgba(236,72,153,0.6)", animation: "cosmicFloat 6s ease-in-out infinite" }} />
            <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full" style={{ background: "#818cf8", boxShadow: "0 0 8px rgba(129,140,248,0.5)", animation: "cosmicFloat 8s ease-in-out infinite reverse" }} />
          </div>

          <section id="services"><ServicesSection onOpenPricing={handleOrderClick} /></section>

          {/* ═══ Section Divider ═══ */}
          <div className="relative h-20 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 items-center">
              {[0, 1, 2].map(i => <div key={i} className="w-1 h-1 rounded-full" style={{ background: "rgba(192,132,252,0.5)", animation: `glowPulse ${2 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />)}
            </div>
          </div>

          <section id="experience"><ExperienceTimeline /></section>

          {/* ═══ Section Divider ═══ */}
          <div className="relative h-20 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.25), rgba(139,92,246,0.35), rgba(99,102,241,0.25), transparent)" }} />
            <div className="absolute right-[35%] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#a78bfa", boxShadow: "0 0 12px rgba(167,139,250,0.6)", animation: "cosmicFloat 7s ease-in-out infinite" }} />
          </div>

          <section id="skills"><SkillsMarquee /></section>

          {/* ═══ Section Divider ═══ */}
          <div className="relative h-20 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(192,132,252,0.4), rgba(139,92,246,0.3), transparent)" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: "#8b5cf6", boxShadow: "0 0 15px rgba(139,92,246,0.7), 0 0 40px rgba(139,92,246,0.2)", animation: "glowPulse 3s ease-in-out infinite" }} />
          </div>

          <section id="dashboard"><DashboardPreview /></section>
        </div>
      </main>

      <footer id="contact" className={`transition-opacity duration-800 ${viewingResume ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Footer />
      </footer>

      {/* 3. Resume / Portfolio Grid Overlay */}
      <div
        className={`fixed inset-0 z-20 overflow-y-auto bg-black/90 transition-opacity duration-800 flex flex-col ${viewingResume ? 'opacity-100 pointer-events-auto delay-500' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute top-24 right-8 z-50">
          <button
            onClick={handleCloseResume}
            className="text-white/50 hover:text-white transition-colors"
            aria-label="Close Resume"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 w-full">
          <PortfolioGrid />
        </div>
      </div>

      <FloatingOrderFab onClick={handleOrderClick} />
      <Chatbot onOpenPricing={handleOrderClick} />
      <OrderFormModal isOpen={orderFormOpen} onClose={() => setOrderFormOpen(false)} />
    </>
  );
}
