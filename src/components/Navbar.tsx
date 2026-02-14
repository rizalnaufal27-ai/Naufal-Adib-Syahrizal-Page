"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import RGBBorder from "./ui/rgb-border";

export default function Navbar() {
    const [active, setActive] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const t = useTranslations('Navbar');

    const navItems = [
        { label: t('home'), href: "#home" },
        { label: t('about'), href: "#profile" },
        { label: t('services'), href: "#services" },
        { label: "Dashboard", href: "/dashboard" },
        { label: t('contact'), href: "#contact" },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (index: number, href: string) => {
        setActive(index);
        setMobileOpen(false);
        if (href.startsWith("#")) {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            window.location.href = href;
        }
    };

    return (
        <nav
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
            style={{
                background: scrolled
                    ? "rgba(5,5,5,0.85)"
                    : "rgba(255,255,255,0.03)",
                backdropFilter: "blur(20px)",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "6px 8px",
                boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.4)" : "none",
            }}
        >
            {/* RGB Glowing Border */}
            <RGBBorder borderRadius="rounded-full" />

            <div className="bg-black/80 absolute inset-0 rounded-full z-[-1]" />
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-1 relative">
                {navItems.map((item, i) => (
                    <button
                        key={item.label}
                        onClick={() => handleClick(i, item.href)}
                        className="relative px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300"
                        style={{
                            color: active === i ? "#fff" : "var(--color-text-muted)",
                            background: active === i
                                ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                                : "transparent",
                            boxShadow:
                                active === i ? "0 0 20px rgba(59,130,246,0.3)" : "none",
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2.5 rounded-full"
                    style={{ color: "var(--color-text)" }}
                    aria-label="Toggle menu"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div
                    className="md:hidden absolute top-full mt-3 left-1/2 -translate-x-1/2 rounded-2xl py-3 px-2 w-56"
                    style={{
                        background: "rgba(5,5,5,0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    {navItems.map((item, i) => (
                        <button
                            key={item.label}
                            onClick={() => handleClick(i, item.href)}
                            className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                            style={{
                                color: active === i ? "#fff" : "var(--color-text-muted)",
                                background:
                                    active === i
                                        ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                                        : "transparent",
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
}
