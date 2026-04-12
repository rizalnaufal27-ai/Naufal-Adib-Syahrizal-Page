"use client";
import { motion } from "framer-motion";

interface ServicesSectionProps {
    onOpenPricing: () => void;
}

const services = [
    { 
        title: "Graphic Design", 
        description: "Logo, Brand Identity, Stationery, Posters & Banners. Visual assets built to scale your business identity.", 
        price: "Starting at Rp 75.000",
    },
    { 
        title: "Illustration", 
        description: "Bespoke digital artwork. From half-body concepts to full character renders for your creative commercial needs.", 
        price: "Starting at Rp 75.000/char",
    },
    { 
        title: "UI/UX Web Design", 
        description: "User-centric wireframes, high-conversion landing pages, and complex dashboard prototypes.", 
        price: "Starting at Rp 1.500.000",
    },
    { 
        title: "Photography", 
        description: "Product photography, graduation events, conceptual portraits, and professional RAW editing.", 
        price: "Starting at Rp 300.000",
    },
    { 
        title: "Videography", 
        description: "Short-form video editing, color grading, and commercial video post-production.", 
        price: "Starting at Rp 150.000",
    },
];

export default function ServicesSection({ onOpenPricing }: ServicesSectionProps) {

    return (
        <section className="w-full py-24 bg-[#0A0A0A] text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                
                {/* Header — same style as WORK/EXPERIENCE */}
                <div className="mb-16 border-b border-white/[0.06] pb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tight text-white"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        SERVICES
                    </motion.h2>
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
                            <div className="col-span-1 md:col-span-1 text-neutral-700 text-sm font-mono group-hover:text-neutral-500 transition-colors">
                                {String(index + 1).padStart(2, "0")}
                            </div>
                            <div className="col-span-1 md:col-span-4">
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300">
                                    {service.title}
                                </h3>
                            </div>
                            <div className="col-span-1 md:col-span-5">
                                <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-neutral-400 transition-colors">
                                    {service.description}
                                </p>
                            </div>
                            <div className="col-span-1 md:col-span-2 text-right">
                                <p className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-1">PRICING</p>
                                <p className="text-sm font-semibold text-white">{service.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 pt-8 border-t border-white/[0.04]">
                    <button
                        onClick={onOpenPricing}
                        className="text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-white border border-neutral-800 hover:border-white/30 px-8 py-4 transition-all duration-300"
                    >
                        Get a Custom Quote →
                    </button>
                </div>

            </div>
        </section>
    );
}
