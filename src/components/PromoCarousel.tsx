"use client";
import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function PromoCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    // These paths assume the user has uploaded the images to these locations
    const promos = [
        { id: 1, src: "/images/promo-1.png", alt: "Special Offer 1" },
        { id: 2, src: "/images/promo-2.png", alt: "Special Offer 2" },
    ];

    return (
        <div ref={containerRef} className="w-full relative py-8 overflow-hidden z-20">
            <motion.div
                initial="hidden"
                animate={controls}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="section-container"
            >
                <div className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar px-4 md:px-0">
                    {promos.map((promo) => (
                        <div
                            key={promo.id}
                            className="snap-center shrink-0 w-[85vw] md:w-[60vw] max-w-4xl relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-2xl md:rounded-3xl blur-xl group-hover:opacity-100 opacity-60 transition-opacity duration-500" />
                            <img
                                src={promo.src}
                                alt={promo.alt}
                                className="w-full h-auto object-cover rounded-2xl md:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                    ))}
                </div>

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none; /* IE and Edge */
                        scrollbar-width: none; /* Firefox */
                    }
                `}</style>
            </motion.div>
        </div>
    );
}
