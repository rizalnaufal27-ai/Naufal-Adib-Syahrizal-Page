"use client";

export default function ProfileSection() {
    return (
        <div className="section-container py-24">
            <div className="text-center mb-16">
                <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: "var(--color-highlight)" }}>
                    Creative Profile
                </p>
                <h2 className="text-3xl md:text-5xl font-bold gradient-text">Naufal Adib Syahrizal</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Role & Purpose */}
                <div className="lg:col-span-12 space-y-12">
                    {/* Role */}
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: "var(--color-text)" }}>
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Role: Multidisciplinary Visual Creator & Digital Strategist
                        </h3>
                        <p className="leading-relaxed text-lg" style={{ color: "var(--color-text-muted)" }}>
                            I am a versatile creative professional specializing in bridging the gap between artistic vision and functional design. With expertise spanning <strong className="font-bold">Graphic Design, Illustration, Photography, and Video Editing</strong>, I act as a one-stop creative partner for brands and individuals looking to elevate their visual identity.
                        </p>
                    </div>

                    {/* Purpose */}
                    <div className="glass-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: "var(--color-text)" }}>
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Purpose
                        </h3>
                        <h4 className="text-lg font-semibold mb-3 italic" style={{ color: "var(--color-highlight)" }}>
                            To transform complex ideas into compelling visual stories that resonate.
                        </h4>
                        <p className="leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                            My mission is to provide integrated visual solutions that don't just "look good" but drive engagement and communicate value. Whether it’s through a meticulously crafted illustration, a high-impact brand identity, or a dynamic video sequence, I aim to help clients stand out in a crowded digital landscape through consistency and aesthetic excellence.
                        </p>
                    </div>

                    {/* Deliverables */}
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: "var(--color-text)" }}>
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Deliverables
                        </h3>
                        <p className="mb-6 text-sm uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>I provide a comprehensive suite of creative assets tailored to your specific needs:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
                                <h4 className="font-bold mb-2 text-blue-400">Graphic Design</h4>
                                <p className="text-sm text-gray-400">Strategic branding, UI/UX elements, and high-conversion social media assets.</p>
                            </div>
                            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
                                <h4 className="font-bold mb-2 text-purple-400">Custom Illustration</h4>
                                <p className="text-sm text-gray-400">Unique digital artworks and character designs that add a personal, artistic touch to your projects.</p>
                            </div>
                            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
                                <h4 className="font-bold mb-2 text-teal-400">Professional Photography</h4>
                                <p className="text-sm text-gray-400">High-quality visual storytelling, from product shots to conceptual portraits.</p>
                            </div>
                            <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
                                <h4 className="font-bold mb-2 text-pink-400">Video Production</h4>
                                <p className="text-sm text-gray-400">Expertly edited video content, motion graphics, and specialized templates (including green screen setups) optimized for digital platforms.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
