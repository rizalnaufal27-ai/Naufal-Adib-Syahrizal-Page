"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
    isPlaying: boolean;
    hasInteracted: boolean;
    toggleAudio: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio("/audio/freesound_community-peaceful-24736.mp3");
            audio.loop = true;
            audio.volume = 0.4;
            audioRef.current = audio;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error("Audio play failed:", err);
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && audioRef.current) {
            const url = URL.createObjectURL(file);
            audioRef.current.src = url;
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
            setHasInteracted(true);
        }
    };

    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                setHasInteracted(true);
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(() => { });
            }
        };

        if (!hasInteracted) {
            document.addEventListener('click', handleInteraction, { once: true });
        }

        return () => {
            document.removeEventListener('click', handleInteraction);
        };
    }, [hasInteracted]);

    return (
        <AudioContext.Provider value={{ isPlaying, hasInteracted, toggleAudio, handleFileChange }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within an AudioProvider");
    return context;
}
