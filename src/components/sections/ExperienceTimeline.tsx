"use client";

const experiences = [
    {
        title: "Freelance Graphic Design",
        duration: "3 Months",
        energy: 25,
        description: "Logo design, branding materials, and visual identity projects for various clients.",
        color: "var(--color-primary)",
    },
    {
        title: "Freelance Photography",
        duration: "1 Year",
        energy: 100,
        description: "Graduation, product, and event photography. Professional photo editing and retouching.",
        color: "var(--color-secondary)",
    },
    {
        title: "Freelance Video Editing",
        duration: "1 Month",
        energy: 8,
        description: "Video post-production, color grading, motion graphics, and content creation.",
        color: "var(--color-highlight)",
    },
    {
        title: "Teacher at SMKN 47 JKT",
        duration: "3 Months",
        energy: 25,
        description: "Teaching multimedia and design fundamentals to vocational school students.",
        color: "#22C55E",
    },
];

export default function ExperienceTimeline() {
    return (
        <div className="section-container py-24">
            <div className="text-center mb-16">
                <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "var(--color-highlight)" }}>
                    Journey
                </p>
                <h2 className="text-3xl md:text-5xl font-bold gradient-text">Experience</h2>
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* Timeline line */}
                <div
                    className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
                    style={{ background: "var(--color-border)" }}
                />

                <div className="space-y-8">
                    {experiences.map((exp, i) => (
                        <div key={i} className="relative pl-16 md:pl-20">
                            {/* Timeline dot */}
                            <div
                                className="absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full border-2"
                                style={{
                                    borderColor: exp.color,
                                    background: "var(--color-bg)",
                                    boxShadow: `0 0 12px ${exp.color}40`,
                                }}
                            />

                            <div className="glass-card p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                    <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                                        {exp.title}
                                    </h3>
                                    <span
                                        className="text-xs font-semibold px-3 py-1 rounded-full"
                                        style={{
                                            background: `${exp.color}15`,
                                            color: exp.color,
                                            border: `1px solid ${exp.color}30`,
                                        }}
                                    >
                                        {exp.duration}
                                    </span>
                                </div>

                                <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                                    {exp.description}
                                </p>

                                {/* Energy Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: "var(--color-text-muted)" }}>Duration Intensity</span>
                                        <span style={{ color: exp.color }}>{exp.energy}%</span>
                                    </div>
                                    <div
                                        className="h-2 rounded-full overflow-hidden"
                                        style={{ background: "var(--color-border)" }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${exp.energy}%`,
                                                background: `linear-gradient(90deg, ${exp.color}, ${exp.color}80)`,
                                                boxShadow: `0 0 10px ${exp.color}40`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
