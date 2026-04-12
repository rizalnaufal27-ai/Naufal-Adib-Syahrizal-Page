"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";


function SpaceDust({ count = 150 }) {
    const mesh = useRef<THREE.Points>(null);
    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (seededRandom(i * 1.1) - 0.5) * 50;     // x
            temp[i * 3 + 1] = (seededRandom(i * 2.2) - 0.5) * 50; // y
            temp[i * 3 + 2] = (seededRandom(i * 3.3) - 0.5) * 50; // z
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#8B5CF6" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

// Simple seeded random to keep component pure
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export default function SpaceBubbles() {
    return (
        <div className="absolute inset-0 w-full h-full bg-transparent z-0">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 75 }}
                gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={0.5} />
                <ambientLight intensity={0.5} />
                <SpaceDust />
            </Canvas>
        </div>
    );
}
