"use client";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Github, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/syahrizalnaufal07", icon: Instagram, color: "#E1306C" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/naufal-adib-4a6982347", icon: Linkedin, color: "#0A66C2" },
    { name: "GitHub", href: "https://github.com/rizalnaufal27-ai", icon: Github, color: "#C084FC" },
    { name: "WhatsApp", href: "https://wa.me/6285782074034", icon: MessageCircle, color: "#25D366" },
];

const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#portfolio" },
    { name: "Services", href: "/#services" },
    { name: "Track Project", href: "/track" },
    { name: "Dashboard", href: "/public/dashboard" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6 } },
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const t = useTranslations("Footer");

    return (
        <footer className="relative bg-[#050505] text-white pt-28 pb-12 overflow-hidden">
            {/* Cosmic top border */}
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1), rgba(255,255,255,0.05), transparent)" }} />

            {/* Nebula accents */}
            <div className="absolute top-[10%] left-[-5%] w-[30%] h-[40%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute bottom-[20%] right-[-5%] w-[25%] h-[30%] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.01) 0%, transparent 70%)", filter: "blur(60px)" }} />

            <div className="section-container relative z-10">
                {/* Main Call to Action */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} className="mb-32">
                    <motion.h2 variants={fadeUp} className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl">
                        <span style={{ background: "linear-gradient(135deg, #fff 0%, #A3A3A3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {t("heading1")}
                        </span>
                        <br />
                        <span className="text-white/20">{t("heading2")}</span>
                    </motion.h2>
                    <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <a
                            href="mailto:rizalnaufal27@gmail.com"
                            className="inline-flex items-center gap-3 text-xl md:text-2xl border-b pb-1 transition-all duration-500 hover:pl-2 group"
                            style={{ borderColor: "rgba(255,255,255,0.1)" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 group-hover:text-white transition-colors"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span className="group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500">rizalnaufal27@gmail.com</span>
                        </a>
                        <a
                            href="https://wa.me/6285782074034"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-xl md:text-2xl border-b pb-1 transition-all duration-500 hover:pl-2 group"
                            style={{ borderColor: "rgba(16,185,129,0.2)" }}
                        >
                            <MessageCircle size={24} className="text-[#10B981]/50 group-hover:text-[#10B981] transition-colors" />
                            <span className="group-hover:text-[#10B981] group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-500">WhatsApp Direct</span>
                        </a>
                    </motion.div>
                </motion.div>

                {/* Grid Layout */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pt-16 relative">
                    {/* Cosmic divider */}
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" }} />

                    {/* Brand */}
                    <motion.div variants={fadeUp} className="md:col-span-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-4">
                                <span className="text-white">Naufal Adib</span>
                                <span className="text-white/30">.</span>
                            </h3>
                            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                                {t("bio")}
                            </p>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <p className="text-white/25 text-xs uppercase tracking-widest">
                                &copy; {currentYear} Naufal Adib. {t("rights")}
                            </p>
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div variants={fadeUp} className="md:col-span-3">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">{t("menu")}</h4>
                        <ul className="space-y-4">
                            {menuLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-lg text-white/60 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:pl-1 transition-all duration-300 inline-block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={fadeUp} className="md:col-span-3">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">{t("socials")}</h4>
                        <ul className="space-y-4">
                            {socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-lg text-white/60 hover:text-white transition-all duration-300 inline-flex items-center gap-3 group hover:pl-1">
                                        <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]" style={{ color: `${link.color}60` }}>
                                            <link.icon size={18} />
                                        </span>
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-xs text-white/40">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Status */}
                    <motion.div variants={fadeUp} className="md:col-span-2">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">{t("status_heading")}</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-white/35 text-sm mb-1">{t("availability")}</p>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                    </span>
                                    <span className="text-sm font-medium text-[#10B981]">{t("open_work")}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/35 text-sm mb-1">{t("timezone")}</p>
                                <p className="text-sm font-medium text-white/60">GMT+7 Jakarta 🌏</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
}
