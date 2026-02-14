"use client";

const skills = [
    {
        name: "Photoshop",
        color: "#31A8FF",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#001E36" />
                <text x="5" y="22" fill="#31A8FF" fontSize="14" fontWeight="bold" fontFamily="Arial">Ps</text>
            </svg>
        ),
    },
    {
        name: "Illustrator",
        color: "#FF9A00",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#330000" />
                <text x="6" y="22" fill="#FF9A00" fontSize="14" fontWeight="bold" fontFamily="Arial">Ai</text>
            </svg>
        ),
    },
    {
        name: "CapCut",
        color: "#FFFFFF",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#000000" stroke="#333" strokeWidth="1" />
                <text x="3" y="21" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="Arial">Cap</text>
            </svg>
        ),
    },
    {
        name: "Canva",
        color: "#7D2AE8",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#7D2AE8" />
                <text x="7" y="22" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="Arial">C</text>
            </svg>
        ),
    },
    {
        name: "DaVinci Resolve",
        color: "#FF6B35",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#1A1A2E" />
                <circle cx="16" cy="16" r="8" stroke="#FF6B35" strokeWidth="2" fill="none" />
                <circle cx="16" cy="16" r="3" fill="#FF6B35" />
            </svg>
        ),
    },
    {
        name: "Camera",
        color: "#E5E5E5",
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#1A1A1A" />
                <path d="M8 12h2l2-3h8l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#E5E5E5" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="17" r="4" stroke="#E5E5E5" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="17" r="1.5" fill="#E5E5E5" />
            </svg>
        ),
    },
];

export default function SkillsMarquee() {
    const doubledSkills = [...skills, ...skills, ...skills, ...skills];

    return (
        <div className="py-24 overflow-hidden">
            <div className="section-container mb-12">
                <div className="text-center">
                    <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "var(--color-highlight)" }}>
                        Toolkit
                    </p>
                    <h2 className="text-3xl md:text-5xl font-bold gradient-text">Skills & Tools</h2>
                </div>
            </div>

            {/* Marquee Row 1 */}
            <div className="relative">
                <div
                    className="flex gap-6 py-4"
                    style={{ animation: "marquee 30s linear infinite", width: "max-content" }}
                >
                    {doubledSkills.map((skill, i) => (
                        <div
                            key={`r1-${i}`}
                            className="glass-card flex items-center gap-3 px-6 py-4 shrink-0"
                            style={{ minWidth: "180px" }}
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${skill.color}10` }}
                            >
                                {skill.icon}
                            </div>
                            <span
                                className="text-sm font-semibold whitespace-nowrap"
                                style={{ color: "var(--color-text)" }}
                            >
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Edge fades */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
                    style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
                />
            </div>
        </div>
    );
}
