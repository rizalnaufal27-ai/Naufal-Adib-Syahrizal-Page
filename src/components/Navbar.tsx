"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isSubPage = (() => {
        const clean = pathname.replace(/^\/(en|id)/, "") || "/";
        return clean !== "/" && clean !== "";
    })();

    const navItems = [
        { label: "WORK", href: "#work" },
        { label: "ABOUT", href: "#profile" },
        { label: "SERVICES", href: "#services" },
        { label: "CONTACT", href: "#contact" },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (href: string) => {
        setMobileOpen(false);
        if (isSubPage) {
            router.push(`/${href}`);
        } else if (href.startsWith("#")) {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(href);
        }
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                background: scrolled ? "rgba(5,5,5,0.95)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
            }}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between h-16 md:h-[72px]">
                    {/* Logo text */}
                    <button
                        onClick={() => {
                            if (isSubPage) router.push("/");
                            else { const el = document.querySelector("#home"); if (el) el.scrollIntoView({ behavior: "smooth" }); }
                        }}
                        className="text-sm font-bold uppercase tracking-[0.2em] text-white hover:text-neutral-300 transition-colors"
                    >
                        NCS
                    </button>

                    {/* Desktop Nav — uppercase, no color */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleClick(item.href)}
                                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors duration-300"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Right side: Admin link + mobile toggle */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin"
                            target="_blank"
                            className="hidden md:inline-flex text-xs font-medium uppercase tracking-[0.15em] text-neutral-500 hover:text-white transition-colors"
                        >
                            Admin
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t" style={{ background: "rgba(5,5,5,0.98)", borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleClick(item.href)}
                                className="block w-full text-left text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors py-2"
                            >
                                {item.label}
                            </button>
                        ))}
                        <Link
                            href="/admin"
                            className="block text-sm uppercase tracking-[0.15em] text-neutral-600 hover:text-white transition-colors py-2"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
