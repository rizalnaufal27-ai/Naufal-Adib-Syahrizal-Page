"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface NavbarProps {
    onOrderClick?: () => void;
}

export default function Navbar({ onOrderClick }: NavbarProps) {
    const [active, setActive] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    // Detect if we're on a sub-page (not the homepage)
    const isSubPage = (() => {
        const clean = pathname.replace(/^\/(en|id)/, "") || "/";
        return clean !== "/" && clean !== "";
    })();

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
        if (isSubPage) {
            // On sub-pages, navigate to homepage with hash
            window.location.href = `/${href}`;
        } else if (href.startsWith("#")) {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            window.location.href = href;
        }
    };

    const handleLogoClick = () => {
        if (isSubPage) {
            window.location.href = "/";
        } else {
            const el = document.querySelector("#home");
            if (el) el.scrollIntoView({ behavior: "smooth" });
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
                    {/* Logo — click to go home */}
                    <button onClick={handleLogoClick} className="flex items-center gap-2 group">
                        <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                            Naufal Adib<span className="text-white/40">.</span>
                        </span>
                    </button>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {isSubPage && (
                            <a
                                href="/public/dashboard"
                                className="relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                                style={{
                                    color: pathname.includes("/dashboard") || pathname.includes("/track") || pathname.includes("/order") ? "#fff" : "rgba(255,255,255,0.5)",
                                    background: pathname.includes("/dashboard") || pathname.includes("/track") || pathname.includes("/order") ? "rgba(99,102,241,0.12)" : "transparent",
                                }}
                            >
                                Dashboard
                            </a>
                        )}
                        {navItems.map((item, i) => (
                            <button
                                key={item.label}
                                onClick={() => handleClick(i, item.href)}
                                className="relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                                style={{
                                    color: !isSubPage && active === i ? "#fff" : "rgba(255, 255, 255, 0.55)",
                                    background: !isSubPage && active === i ? "rgba(99,102,241,0.12)" : "transparent",
                                }}
                            >
                                {item.label}
                                {!isSubPage && active === i && (
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
                        <a
                            href={`/${pathname.split("/")[1] || "en"}/consultation`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                            style={{ background: "linear-gradient(135deg, #EC4899, #8B5CF6)" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Consultation
                        </a>
                        <a
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Admin
                        </a>

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
                        {isSubPage && (
                            <a
                                href="/public/dashboard"
                                className="block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                                style={{ color: pathname.includes("/dashboard") ? "#fff" : "var(--color-text-muted)", background: pathname.includes("/dashboard") ? "rgba(99,102,241,0.12)" : "transparent" }}
                            >
                                Dashboard
                            </a>
                        )}
                        {navItems.map((item, i) => (
                            <button
                                key={item.label}
                                onClick={() => handleClick(i, item.href)}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                                style={{
                                    color: !isSubPage && active === i ? "#fff" : "var(--color-text-muted)",
                                    background: !isSubPage && active === i ? "rgba(99,102,241,0.12)" : "transparent",
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                        <a
                            href={`/${pathname.split("/")[1] || "en"}/consultation`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-white"
                            style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))" }}
                        >
                            Consultation
                        </a>
                        <a
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Admin
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
