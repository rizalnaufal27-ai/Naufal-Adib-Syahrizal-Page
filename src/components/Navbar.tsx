"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface NavbarProps {
    onOrderClick?: () => void;
}

export default function Navbar({ onOrderClick }: NavbarProps) {
    const [active, setActive] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const t = useTranslations("Navbar");

    const navItems = [
        { label: t("home"), href: "#home" },
        { label: t("about"), href: "#profile" },
        { label: t("services"), href: "#services" },
        { label: t("contact"), href: "#contact" },
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
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                background: scrolled ? "rgba(5,5,5,0.92)" : "rgba(5,5,5,0.6)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            }}
        >
            <div className="section-container">
                <div className="flex items-center justify-between h-16 md:h-[72px]">
                    {/* Logo */}
                    <a href="#home" className="flex items-center gap-2 group">
                        <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                            Naufal Adib<span className="text-white/40">.</span>
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item, i) => (
                            <button
                                key={item.label}
                                onClick={() => handleClick(i, item.href)}
                                className="relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                                style={{
                                    color: active === i ? "#fff" : "rgba(255, 255, 255, 0.75)",
                                    background: active === i ? "rgba(99,102,241,0.12)" : "transparent",
                                }}
                            >
                                {item.label}
                                {active === i && (
                                    <span
                                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                                        style={{ background: "#6366F1" }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* CTA + Admin link + Mobile */}
                    <div className="flex items-center gap-3">
                        {/* Admin link */}
                        <a
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Admin
                        </a>

                        {/* Place an Order button removed - moved to FAB */}

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2.5 rounded-lg"
                            style={{ color: "var(--color-text)" }}
                            aria-label="Toggle menu"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div
                    className="md:hidden border-t"
                    style={{ background: "rgba(5,5,5,0.98)", borderColor: "rgba(255,255,255,0.06)" }}
                >
                    <div className="section-container py-4 space-y-1">
                        {navItems.map((item, i) => (
                            <button
                                key={item.label}
                                onClick={() => handleClick(i, item.href)}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                                style={{
                                    color: active === i ? "#fff" : "var(--color-text-muted)",
                                    background: active === i ? "rgba(99,102,241,0.12)" : "transparent",
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                        <a
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Admin
                        </a>
                        {/* Place an Order button removed - moved to FAB */}
                    </div>
                </div>
            )}
        </nav>
    );
}
