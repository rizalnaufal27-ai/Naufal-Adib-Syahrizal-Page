"use client";

export default function ProfileSection() {
    return (
        <div className="section-container py-28">
            <div className="text-center mb-16">
                <p className="section-label">Creative Profile</p>
                <h2 className="section-title gradient-text">Naufal Adib Syahrizal</h2>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Role */}
                <div className="agency-card">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h3 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                            Multidisciplinary Visual Creator & Digital Strategist
                        </h3>
                    </div>
                    <p className="leading-relaxed text-lg" style={{ color: "var(--color-text-muted)" }}>
                        I am a versatile creative professional specializing in bridging the gap between artistic vision and functional design. With expertise spanning <strong className="font-bold text-white/90">Graphic Design, Illustration, Photography, Video Editing, Web Design, and App Development</strong>, I act as a one-stop creative partner for brands and individuals looking to elevate their visual identity.
                    </p>
                </div>

                {/* Purpose */}
                <div className="agency-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-[80px]" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <h3 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                            Purpose
                        </h3>
                    </div>
                    <p className="text-lg font-medium italic mb-3" style={{ color: "var(--color-highlight)" }}>
                        To transform complex ideas into compelling visual stories that resonate.
                    </p>
                    <p className="leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                        My mission is to provide integrated visual solutions that don&apos;t just &ldquo;look good&rdquo; but drive engagement and communicate value. Whether it&apos;s through a meticulously crafted illustration, a high-impact brand identity, or a dynamic video sequence, I aim to help clients stand out in a crowded digital landscape through consistency and aesthetic excellence.
                    </p>
                </div>

                {/* Deliverables */}
                <div className="agency-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <h3 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                            Deliverables
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Graphic Design", desc: "Strategic branding, UI/UX elements, and high-conversion social media assets.", color: "#3B82F6" },
                            { title: "Custom Illustration", desc: "Unique digital artworks and character designs that add a personal, artistic touch.", color: "#8B5CF6" },
                            { title: "Photography", desc: "High-quality visual storytelling, from product shots to conceptual portraits.", color: "#06B6D4" },
                            { title: "Video Production", desc: "Expertly edited video content, motion graphics, and templates for digital platforms.", color: "#EC4899" },
                            { title: "Web Design", desc: "Modern responsive websites with stunning UI/UX, from landing pages to full sites.", color: "#10B981" },
                            { title: "App Development", desc: "Custom mobile and web applications built with modern frameworks and technologies.", color: "#F59E0B" },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px]"
                                style={{
                                    background: `${item.color}08`,
                                    border: `1px solid ${item.color}15`,
                                }}
                            >
                                <h4 className="font-bold mb-1.5" style={{ color: item.color }}>{item.title}</h4>
                                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
