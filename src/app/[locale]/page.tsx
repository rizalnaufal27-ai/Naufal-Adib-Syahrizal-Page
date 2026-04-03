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




export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const handleOrderClick = useCallback(() => {
    setOrderFormOpen(true);
  }, []);

  const handleViewResume = useCallback(() => {
    // Instead of using a modal, we scroll to the work section for now
    const workSection = document.getElementById('work');
    if (workSection) workSection.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  if (!introComplete) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <>
      {/* 1. Persistent Matte Dark Layer */}
      <div className="fixed inset-0 z-[-1] bg-[#0A0A0A]" />

      <Navbar onOrderClick={handleOrderClick} />

      {/* 2. Main Content */}
      <main className="relative z-10 transition-opacity duration-800 opacity-100 delay-300">
        <section id="home">
          <HeroSection onViewResume={handleViewResume} onOrderClick={handleOrderClick} />
        </section>



        {/* Dark Premium Sections */}
        <div className="relative z-10 pb-20 bg-[#0A0A0A] overflow-hidden">
          {/* Subtle Grid Background Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          {/* ═══ Section Divider ═══ */}
          <div className="relative h-16" />

          <section id="profile"><ProfileSection /></section>

          <section id="services"><ServicesSection onOpenPricing={handleOrderClick} /></section>

          {/* ═══ Subtle Divider ═══ */}
          <div className="relative h-16 w-full flex justify-center items-center">
            <div className="w-24 h-px bg-white/10" />
          </div>

          <section id="work"><PortfolioGrid /></section>

          {/* ═══ Subtle Divider ═══ */}
          <div className="relative h-16 w-full flex justify-center items-center">
            <div className="w-24 h-px bg-white/10" />
          </div>

          <section id="experience"><ExperienceTimeline /></section>

          {/* ═══ Subtle Divider ═══ */}
          <div className="relative h-16 w-full flex justify-center items-center">
            <div className="w-24 h-px bg-white/10" />
          </div>

          <section id="skills"><SkillsMarquee /></section>

          {/* ═══ Subtle Divider ═══ */}
          <div className="relative h-16 w-full flex justify-center items-center">
            <div className="w-24 h-px bg-white/10" />
          </div>

          <section id="dashboard"><DashboardPreview /></section>
        </div>
      </main>

      <footer id="contact">
        <Footer />
      </footer>

      <FloatingOrderFab onClick={handleOrderClick} />
      <Chatbot onOpenPricing={handleOrderClick} />
      <OrderFormModal isOpen={orderFormOpen} onClose={() => setOrderFormOpen(false)} />
    </>
  );
}
