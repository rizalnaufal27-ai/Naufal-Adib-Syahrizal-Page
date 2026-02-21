"use client";
import React from "react";
import { Instagram, Linkedin, Github, MessageCircle } from "lucide-react";

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/syahrizalnaufal07", icon: Instagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/naufal-adib-4a6982347", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/rizalnaufal27-ai", icon: Github },
    { name: "WhatsApp", href: "https://wa.me/6285782074034", icon: MessageCircle },
];

const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#portfolio" },
    { name: "Services", href: "/#services" },
    { name: "Dashboard", href: "/public/dashboard" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] text-white pt-28 pb-12 overflow-hidden">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)" }}
            />

            <div className="section-container">
                {/* Main Call to Action */}
                <div className="mb-32">
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl">
                        Let&apos;s work <br />
                        <span className="text-white/30">together.</span>
                    </h2>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <a
                            href="mailto:rizalnaufal27@gmail.com"
                            className="inline-flex items-center gap-3 text-xl md:text-2xl border-b border-white/20 pb-1 hover:border-blue-400/80 hover:text-blue-400 hover:pl-2 hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] transition-all duration-500"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            rizalnaufal27@gmail.com
                        </a>
                        <a
                            href="https://wa.me/6285782074034"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-xl md:text-2xl border-b border-white/20 pb-1 hover:border-green-400/80 hover:text-green-400 hover:pl-2 hover:drop-shadow-[0_0_15px_rgba(74,222,128,0.6)] transition-all duration-500"
                        >
                            <MessageCircle size={24} />
                            WhatsApp Direct
                        </a>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-white/8 pt-16">

                    {/* Brand / Copyright */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Naufal Adib<span className="text-white/30">.</span></h3>
                            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                                Creating digital experiences that blend aesthetics with functionality.
                                Based in Jakarta, Indonesia.
                            </p>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <p className="text-white/40 text-xs uppercase tracking-widest">
                                &copy; {currentYear} Naufal Adib. All Rights Reserved
                            </p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-6">Menu</h4>
                        <ul className="space-y-4">
                            {menuLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-lg hover:text-blue-400 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all duration-300 inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-6">Socials</h4>
                        <ul className="space-y-4">
                            {socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg hover:text-blue-400 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.8)] transition-all duration-300 inline-flex items-center gap-3 group"
                                    >
                                        <span className="text-white/50 group-hover:text-blue-400 transition-colors">
                                            <link.icon size={18} />
                                        </span>
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-xs">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location / Status */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-6">Status</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-white/50 text-sm mb-1">Availability</p>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-medium">Open for work</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm mb-1">Time Zone</p>
                                <p className="text-sm font-medium">GMT+7 Jakarta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
