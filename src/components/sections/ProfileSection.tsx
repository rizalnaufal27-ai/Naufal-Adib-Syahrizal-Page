"use client";
import { motion } from "framer-motion";
import { Palette, Sparkles, Camera, Film, Globe } from "lucide-react";

export default function ProfileSection() {
    return (
        <section className="relative w-full py-32 bg-[#050505] text-white border-t border-white/[0.05]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                    
                    {/* Left Column - Philosophy */}
                    <motion.div 
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 flex flex-col justify-between"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-8">
                                ✦ Core Philosophy
                            </p>
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                                Form follows <br/>
                                <span className="text-neutral-500">function.</span> but <br/>
                                emotion dictates <br/>
                                <span className="italic font-light">memory.</span>
                            </h2>
                            <p className="text-neutral-400 leading-relaxed text-lg max-w-md">
                                I believe design is not just about making things look beautiful. It is an engineering process of visual communication, designed specifically to solve problems, evoke emotions, and drive business growth.
                            </p>
                        </div>
                        
                        <div className="mt-16 pt-8 border-t border-white/[0.05]">
                            <p className="text-sm font-medium italic text-neutral-300">
                                &quot;The best design is the one you don&apos;t even notice, because it just works perfectly.&quot;
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Bento Grid of 5 Services */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        <div className="col-span-1 sm:col-span-2">
                             <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-6">
                                ✦ Disciplines
                            </p>
                        </div>

                        {[
                            { title: "Graphic Design", desc: "Brand identities, typography, and visual assets built to scale.", icon: Palette, size: "large" },
                            { title: "Illustration", desc: "Bespoke digital artwork and character design.", icon: Sparkles, size: "small" },
                            { title: "UI/UX Web Design", desc: "User-centric interfaces and responsive landing pages.", icon: Globe, size: "small" },
                            { title: "Photography", desc: "Product, event, and conceptual portrait photography.", icon: Camera, size: "small" },
                            { title: "Videography", desc: "Motion editing, color grading, and short-form storytelling.", icon: Film, size: "small" },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`group p-8 flex flex-col justify-between bg-[#0A0A0A] border border-white/[0.05] transition-all duration-500 hover:bg-[#111111] hover:border-white/[0.15] ${item.size === 'large' ? 'col-span-1 sm:col-span-2 min-h-[220px]' : 'col-span-1 min-h-[220px]'}`}
                            >
                                <div className="mb-8">
                                    <item.icon className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-500">{item.title}</h4>
                                    <p className="text-sm text-neutral-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
