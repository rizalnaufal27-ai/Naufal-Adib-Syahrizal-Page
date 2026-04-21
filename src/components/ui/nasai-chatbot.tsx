"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Play, ExternalLink, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const PenguinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-3.31 0-6 2.69-6 6v3.54c-.65.25-1.5.89-1.5 2.46 0 2.22 2.2 2 3.23 2h.27V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-5h.27c1.03 0 3.23.22 3.23-2 0-1.57-.85-2.21-1.5-2.46V8c0-3.31-2.69-6-6-6Z" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
        <circle cx="14" cy="10" r="1" fill="currentColor" />
    </svg>
);

const TOUR_STEPS = [
    { id: 'home', key: 'welcome' },
    { id: 'profile', key: 'profile' },
    { id: 'services', key: 'services' },
    { id: 'work', key: 'work' },
    { id: 'experience', key: 'experience' },
    { id: 'contact', key: 'action' }, // Point to footer for contact
];

export function NasaiChatbot() {
    const t = useTranslations('NasaiExplorer');
    const [isOpen, setIsOpen] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Navbar offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    const startTour = () => {
        setIsTourActive(true);
        setCurrentStep(0);
        scrollToSection(TOUR_STEPS[0].id);
    };

    const nextStep = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            const next = currentStep + 1;
            setCurrentStep(next);
            scrollToSection(TOUR_STEPS[next].id);
        } else {
            finishTour();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            const prev = currentStep - 1;
            setCurrentStep(prev);
            scrollToSection(TOUR_STEPS[prev].id);
        }
    };

    const finishTour = () => {
        setIsTourActive(false);
        setIsOpen(false);
        setCurrentStep(0);
    };

    // Auto-open greeting on first mount
    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('nasai_popup_seen');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('nasai_popup_seen', 'true');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isOpen) return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#111111] border border-white/10 shadow-2xl hover:border-emerald-500/40 hover:bg-[#1a1a1a] transition-all duration-300 group flex items-center justify-center pointer-events-auto"
        >
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <PenguinIcon className="w-7 h-7 text-white group-hover:text-emerald-400 relative" />
        </motion.button>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 w-[340px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0f0f0f]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
                            <PenguinIcon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-white/90 uppercase tracking-tighter">NASAI Explorer</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1 px-4 text-white/30 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-5">
                    {!isTourActive ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                <PenguinIcon className="w-8 h-8 text-emerald-400/80" />
                            </div>
                            <h3 className="text-white font-bold mb-2 text-sm">{t('welcome')}</h3>
                            <button
                                onClick={startTour}
                                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                            >
                                <Play size={14} className="fill-current" />
                                {t('buttons.start')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                                        {t(TOUR_STEPS[currentStep].key)}
                                    </p>

                                    {currentStep === TOUR_STEPS.length - 1 && (
                                        <div className="flex flex-col gap-2 mb-4">
                                            <button
                                                onClick={() => {
                                                    const btn = document.querySelector('[data-order-trigger="true"]') as HTMLButtonElement;
                                                    if (btn) btn.click();
                                                    else window.location.hash = 'services';
                                                }}
                                                className="w-full py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                                            >
                                                <ExternalLink size={14} />
                                                {t('buttons.order')}
                                            </button>
                                            <a
                                                href="https://wa.me/6285782074034"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600/20 transition-colors"
                                            >
                                                <MessageCircle size={14} />
                                                {t('buttons.whatsapp')}
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex gap-1">
                                    {TOUR_STEPS.map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-emerald-500' : 'w-1 bg-white/10'}`} 
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white disabled:opacity-20 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="p-2 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
                                    >
                                        {currentStep === TOUR_STEPS.length - 1 ? t('buttons.finish') : t('buttons.next')}
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Subtle */}
                <div className="px-4 py-2 bg-white/5 flex items-center justify-between">
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-mono">NASAI V2.0 · PROACTIVE MODE</span>
                    {isTourActive && (
                        <button onClick={finishTour} className="text-[8px] text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                            {t('buttons.skip')}
                        </button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

