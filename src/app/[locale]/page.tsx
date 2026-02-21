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

        {/* Light Background Sections */}
        <div className="light-mode bg-white relative z-10 pb-20">
          <section id="profile"><ProfileSection /></section>
          <section id="services"><ServicesSection onOpenPricing={handleOrderClick} /></section>
          <section id="experience"><ExperienceTimeline /></section>
          <section id="skills"><SkillsMarquee /></section>
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
