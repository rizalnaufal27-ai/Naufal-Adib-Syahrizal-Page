"use client";
import { motion } from "framer-motion";

interface ServicesSectionProps {
    onOpenPricing: () => void;
}

const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const cardPop = {
    hidden: { opacity: 0, y: 50, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const services = [
    { title: "Graphic Design", description: "Logo, banner, poster, and complete brand identity packages. Clean, modern, impactful.", emoji: "🎨", color: "#8B5CF6", gradient: "from-violet-500/20 to-purple-500/10", price: "From $5" },
    { title: "Illustration", description: "Character illustration — half body, full body, and full render. Bring your characters to life.", emoji: "✦", color: "#EC4899", gradient: "from-pink-500/20 to-rose-500/10", price: "From $5" },
    { title: "Photography", description: "Graduation, product, and event photography. Professional editing and retouching included.", emoji: "📷", color: "#06B6D4", gradient: "from-cyan-500/20 to-teal-500/10", price: "From $1" },
    { title: "Video Editing", description: "Professional post-production, color grading, motion graphics, transitions, and sound design.", emoji: "🎬", color: "#F59E0B", gradient: "from-amber-500/20 to-yellow-500/10", price: "From $10" },
    { title: "Web Design", description: "Modern, responsive website design with stunning UI/UX. Landing pages, portfolios, and business sites.", emoji: "🌐", color: "#22C55E", gradient: "from-emerald-500/20 to-green-500/10", price: "From $25" },
    { title: "App Development", description: "Custom mobile and web applications built with modern technologies. From concept to deployment.", emoji: "📱", color: "#6366F1", gradient: "from-indigo-500/20 to-blue-500/10", price: "From $50" },
];

export default function ServicesSection({ onOpenPricing }: ServicesSectionProps) {
    return (
        <div className="section-container py-28 relative overflow-hidden">
            {/* Cosmic ambient */}
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(60px)", animation: "nebulaPulse 12s ease-in-out infinite" }} />
            <div className="absolute bottom-[10%] left-[-5%] w-[25%] h-[25%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)", filter: "blur(80px)", animation: "nebulaPulse 15s ease-in-out infinite reverse" }} />

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
                <div className="text-center mb-16">
                    <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ background: "linear-gradient(90deg, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦ What I Offer</motion.p>
                    <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fff 0%, #e0e7ff 40%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Services</motion.h2>
                    <motion.p variants={fadeUp} className="text-sm mt-4 max-w-lg mx-auto text-white/55">
                        End-to-end creative solutions tailored to your brand. From design to development.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            variants={cardPop}
                            custom={index}
                            onClick={onOpenPricing}
                            className="group cursor-pointer rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(139,92,246,0.12)]"
                            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${service.color}15`, backdropFilter: "blur(10px)" }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${service.color}12 0%, transparent 60%)` }} />

                            {/* Cosmic particle on hover */}
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" style={{ background: service.color, boxShadow: `0 0 15px ${service.color}`, animation: "cosmicFloat 8s ease-in-out infinite" }} />

                            {/* Emoji icon with cosmic glow */}
                            <div className="text-4xl mb-5 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] will-change-transform" style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))" }}>
                                {service.emoji}
                            </div>

                            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-200 transition-colors duration-300">
                                {service.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-6 text-white/60 group-hover:text-white/75 transition-colors duration-300">
                                {service.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 relative z-10" style={{ borderTop: `1px solid ${service.color}12` }}>
                                <span className="text-sm font-bold" style={{ color: service.color }}>{service.price}</span>
                                <span className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-500 group-hover:px-5 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    style={{ background: `${service.color}12`, color: service.color, border: `1px solid ${service.color}25` }}>
                                    Get Quote ✦
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
