"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: "en", label: "English" },
        { code: "id", label: "Indonesia" },
    ];

    const toggleLang = (newLocale: string) => {
        if (newLocale !== locale) {
            router.replace(pathname, { locale: newLocale });
        }
        setIsOpen(false);
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
                <Globe size={18} />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold uppercase bg-purple-600 text-white px-1.5 rounded-sm">{locale}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-12 right-0 w-36 rounded-xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 z-50 overflow-hidden shadow-xl"
                        >
                            {languages.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => toggleLang(l.code)}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${locale === l.code ? "bg-purple-500/20 text-purple-300 font-medium" : "text-white/70 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
