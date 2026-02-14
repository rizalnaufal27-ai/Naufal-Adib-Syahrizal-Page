"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SpaceAmbience() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Initialize Audio
    useEffect(() => {
        // Create audio element programmatically to keep DOM clean
        const audio = new Audio("/audio/freesound_community-peaceful-24736.mp3");
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        // Cleanup
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            // Play
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error("Audio play failed:", err);
                // If file missing, maybe show a toast or just fail silently
            });
        }
    };

    // Auto-start on first interaction
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                setHasInteracted(true);
                // Attempt auto-play if user clicks
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Autoplay might strictly block even after click if context wrong, but usually click is fine
                });
            }
        };

        if (!hasInteracted) {
            document.addEventListener('click', handleInteraction, { once: true });
        }

        return () => {
            document.removeEventListener('click', handleInteraction);
        };
    }, [hasInteracted]);

    // Prevent Hydration Mismatch
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) return null;

    return (
        <div className="fixed bottom-8 left-8 z-[10000] flex items-center gap-4 opacity-100 transition-opacity duration-500 pointer-events-auto">
            {/* Text Label */}
            <span
                className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 ${isPlaying ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-white/30'}`}
            >
                Audio {isPlaying ? 'On' : 'Off'}
            </span>

            {/* MD3 Style Switch Container */}
            <button
                onClick={toggleAudio}
                className={`
                relative w-[52px] h-[32px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                border focus:outline-none focus:ring-2 focus:ring-blue-500/50
                ${isPlaying
                        ? 'bg-blue-500/20 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }
            `}
                aria-label={isPlaying ? "Mute Space Ambience" : "Enable Space Ambience"}
            >
                {/* Visualizer Background (Active only) */}
                {isPlaying && (
                    <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
                        <div className="flex items-center justify-center w-full h-full gap-[2px]">
                            <div className="w-[2px] h-3 bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-[2px] h-5 bg-blue-400 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                            <div className="w-[2px] h-3 bg-blue-400 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        </div>
                    </div>
                )}

                {/* Sliding Thumb */}
                <span
                    className={`
                    absolute top-[3px] left-[3px] w-[24px] h-[24px] rounded-full flex items-center justify-center 
                    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-lg
                    ${isPlaying
                            ? 'translate-x-[20px] bg-blue-400 text-black'
                            : 'translate-x-0 bg-white/40 text-white hover:bg-white/60'
                        }
                `}
                >
                    {isPlaying ? (
                        <Volume2 className="w-3 h-3" strokeWidth={3} />
                    ) : (
                        <VolumeX className="w-3 h-3" strokeWidth={3} />
                    )}
                </span>
            </button>
        </div>
    );
}
