"use client";
import React from 'react';

export default function RGBBorder({ borderRadius = "rounded-full" }: { borderRadius?: string }) {
    return (
        <div className={`absolute inset-[-2px] ${borderRadius} z-[-1] overflow-hidden`}>
            {/* 
        RGB Conic Gradient 
        Using standard rainbow colors: Red, Orange, Yellow, Green, Blue, Indigo, Violet
      */}
            <div
                className="absolute inset-[-100%]"
                style={{
                    background: "conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #4b0082, #ee82ee, #ff0000)",
                    width: "300%",
                    height: "300%",
                    left: "-100%",
                    top: "-100%",
                    opacity: 0.6,
                    filter: "blur(10px)",
                    animation: "spin 4s linear infinite"
                }}
            />
            {/* Inner Mask to create the "border" look */}
            <div className={`absolute inset-[1px] bg-[#050505] ${borderRadius} z-10`} />
        </div>
    );
}
