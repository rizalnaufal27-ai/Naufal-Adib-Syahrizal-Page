"use client";

interface ServicesSectionProps {
    onOpenPricing: () => void;
}

const services = [
    {
        title: "Graphic Design",
        description: "Logo, banner, poster, and complete brand identity packages. Clean, modern, impactful.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
        color: "#3B82F6",
        price: "From $5",
    },
    {
        title: "Illustration",
        description: "Character illustration — half body, full body, and full render. Bring your characters to life.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
            </svg>
        ),
        color: "#8B5CF6",
        price: "From $5",
    },
    {
        title: "Photography",
        description: "Graduation, product, and event photography. Professional editing and retouching included.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
            </svg>
        ),
        color: "#06B6D4",
        price: "From $1",
    },
    {
        title: "Video Editing",
        description: "Professional post-production, color grading, motion graphics, transitions, and sound design.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
        ),
        color: "#F59E0B",
        price: "From $10",
    },
    {
        title: "Web Design",
        description: "Modern, responsive website design with stunning UI/UX. Landing pages, portfolios, and business sites.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        color: "#10B981",
        price: "From $25",
    },
    {
        title: "App Development",
        description: "Custom mobile and web applications built with modern technologies. From concept to deployment.",
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
        ),
        color: "#EC4899",
        price: "From $50",
    },
];

export default function ServicesSection({ onOpenPricing }: ServicesSectionProps) {
    return (
        <div className="section-container py-28">
            <div className="text-center mb-16">
                <p className="section-label">What I Offer</p>
                <h2 className="section-title gradient-text">Services</h2>
                <p className="text-sm mt-4 max-w-lg mx-auto" style={{ color: "var(--color-text-muted)" }}>
                    End-to-end creative solutions tailored to your brand. From design to development.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <div
                        key={service.title}
                        className="agency-card group cursor-pointer rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden"
                        onClick={onOpenPricing}
                        style={{
                            animationDelay: `${index * 100}ms`,
                        }}
                    >
                        {/* Glow ambient inside card */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${service.color}15 0%, transparent 70%)` }} />

                        {/* Icon */}
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                            style={{
                                background: `${service.color}15`,
                                color: service.color,
                                border: `1px solid ${service.color}30`,
                                boxShadow: `0 4px 20px -5px ${service.color}50`
                            }}
                        >
                            {service.icon}
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
                            {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                            {service.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                            <span className="text-sm font-bold" style={{ color: service.color }}>
                                {service.price}
                            </span>
                            <span
                                className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-300 group-hover:px-5 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                style={{
                                    background: `${service.color}15`,
                                    color: service.color,
                                    border: `1px solid ${service.color}30`,
                                }}
                            >
                                Get Quote →
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
