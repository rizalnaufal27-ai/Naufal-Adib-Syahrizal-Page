"use client";
import React from "react";

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/syahrizalnaufal07" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/naufal-adib-4a6982347" },
    { name: "GitHub", href: "https://github.com/rizalnaufal27-ai" },
    { name: "WhatsApp", href: "https://wa.me/6285782074034" },
];

const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#portfolio" },
    { name: "Services", href: "/#services" },
    { name: "Dashboard", href: "/dashboard" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] text-white pt-24 pb-12 overflow-hidden">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="section-container">
                {/* Main Call to Action */}
                <div className="mb-24">
                    <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl">
                        Let&apos;s work <br />
                        <span className="text-white/40">together.</span>
                    </h2>
                    <a
                        href="mailto:rizalnaufal27@gmail.com"
                        className="inline-flex items-center gap-3 text-xl md:text-2xl border-b border-white/30 pb-1 hover:border-white hover:pl-2 transition-all duration-300"
                    >
                        rizalnaufal27@gmail.com
                        <span className="text-lg">↗</span>
                    </a>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-t border-white/10 pt-16">

                    {/* Brand / Copyright */}
                    <div className="md:col-span-4 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Naufal Adib.</h3>
                            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                                Creating digital experiences that blend aesthetics with functionality.
                                Based in Jakarta, Indonesia.
                            </p>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <p className="text-white/20 text-xs uppercase tracking-widest">
                                © {currentYear} All Rights Reserved
                            </p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Menu</h4>
                        <ul className="space-y-4">
                            {menuLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-lg hover:text-white/60 transition-colors inline-block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="md:col-span-3">
                        <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Socials</h4>
                        <ul className="space-y-4">
                            {socialLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg hover:text-white/60 transition-colors inline-flex items-center gap-2 group"
                                    >
                                        {link.name}
                                        <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xs">↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location / Status */}
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-medium text-white/40 uppercase tracking-widest mb-6">Status</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-white/60 text-sm mb-1">Make a website</p>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-medium">Available</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm mb-1">Time</p>
                                <p className="text-sm font-medium">GMT+7 Jakarta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
