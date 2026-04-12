"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ServicesSectionProps {
    onOpenPricing: () => void;
}

const services = [
    { 
        title: "Graphic Design", 
        description: "Logo, Brand Identity, Stationery, Posters, & Banners. A-la-carte visual assets built to scale your business identity.", 
        price: "Starting at $5",
    },
    { 
        title: "Illustration", 
        description: "Bespoke digital artwork. From half-body concepts to full character renders for your creative commercial needs.", 
        price: "Starting at $5/char",
    },
    { 
        title: "UI/UX Web Design", 
        description: "User-centric wireframes, high-conversion landing pages, and complex dashboard prototypes.", 
        price: "Project Based",
    },
    { 
        title: "Photography", 
        description: "Product photography, graduation events, conceptual portraits, and professional RAW editing.", 
        price: "Starting at $20",
    },
    { 
        title: "Videography", 
        description: "Short-form video editing, color grading, and commercial video post-production.", 
        price: "Starting at $10",
    },
];

export default function ServicesSection({ onOpenPricing }: ServicesSectionProps) {
    const t = useTranslations("Services");

    return (
        <section className="w-full py-32 bg-[#050505] text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-6">
                            ✦ {t("label")}
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            A-La-Carte <br/>
                            <span className="text-neutral-600">Expertise.</span>
                        </h2>
                    </div>
                    <p className="text-neutral-400 max-w-sm text-sm leading-relaxed font-medium">
                        I don&apos;t believe in locking you into bloated agency retainers. Pick exactly the service you need, when you need it. High-end execution, modular pricing.
                    </p>
                </div>

                <div className="flex flex-col border-t border-white/[0.05]">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            onClick={onOpenPricing}
                            className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-10 md:py-12 border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8"
                        >
                            <div className="col-span-1 md:col-span-5">
                                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white/50 group-hover:text-white transition-colors duration-500" style={{ fontFamily: "var(--font-heading)" }}>
                                    {service.title}
                                </h3>
                            </div>
                            
                            <div className="col-span-1 md:col-span-5">
                                <p className="text-sm md:text-base text-neutral-500 group-hover:text-neutral-300 transition-colors duration-500 max-w-md">
                                    {service.description}
                                </p>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end items-center gap-4">
                                <div className="text-left md:text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">Pricing</p>
                                    <p className="text-sm font-semibold text-white">{service.price}</p>
                                </div>
                                <div className="hidden md:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-white text-black transition-all duration-500 -rotate-45 group-hover:rotate-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
