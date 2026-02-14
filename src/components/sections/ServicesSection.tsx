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
        color: "var(--color-primary)",
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
        color: "var(--color-secondary)",
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
        color: "var(--color-highlight)",
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
];

export default function ServicesSection({ onOpenPricing }: ServicesSectionProps) {
    return (
        <div className="section-container py-24">
            <div className="text-center mb-16">
                <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "var(--color-highlight)" }}>
                    What I Offer
                </p>
                <h2 className="text-3xl md:text-5xl font-bold gradient-text">Services</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                    <div
                        key={service.title}
                        className="glass-card p-6 group cursor-pointer"
                        onClick={onOpenPricing}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                            style={{
                                background: `${service.color}15`,
                                color: service.color,
                            }}
                        >
                            {service.icon}
                        </div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
                            {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--color-text-muted)" }}>
                            {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold" style={{ color: service.color }}>
                                {service.price}
                            </span>
                            <span
                                className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-300"
                                style={{
                                    background: `${service.color}10`,
                                    color: service.color,
                                    border: `1px solid ${service.color}20`,
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
