// @ts-nocheck
"use client";

import * as THREE from "three";
import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Bubbles({ count = 30 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const light = useRef<THREE.PointLight>(null);

    // Generate random initial data
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            const scale = 0.5 + Math.random() * 1.5; // Bubble size variation
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, scale });
        }
        return temp;
    }, [count]);

    // Reuse helper object for matrix updates to avoid GC
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor, scale } = particle;

            // Update time
            t = particle.t += speed / 2;

            // Calculate position - elliptical orbit / drift
            // "Like in space" -> gentle floating
            const x = Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
            const y = Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
            const z = Math.cos(t) + Math.sin(t * 3) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

            // Apply to dummy object
            dummy.position.set(x, y, z);
            dummy.scale.setScalar(scale);
            dummy.rotation.set(t, t, t);
            dummy.updateMatrix();

            // Update instance matrix
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;

        // Move light gently
        if (light.current) {
            light.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 20;
            light.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 20;
        }
    });

    return (
        <>
            <pointLight ref={light} distance={40} intensity={2} color="#3B82F6" />
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#000000"
                    emissive="#3B82F6" // Neon Blueish glow
                    emissiveIntensity={0.5}
                    roughness={0}
                    metalness={0.8}
                    transparent
                    opacity={0.6}
                />
            </instancedMesh>
        </>
    );
}

function SpaceDust({ count = 150 }) {
    const mesh = useRef<THREE.Points>(null);
    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (Math.random() - 0.5) * 50;     // x
            temp[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
            temp[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
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
                />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#8B5CF6" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

export default function SpaceBubbles() {
    return (
        <div className="absolute inset-0 w-full h-full bg-transparent z-0">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 75 }}
                gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
                dpr={[1, 1.5]}
            >
                {/* <color attach="background" args={["#050505"]} /> Removed for transparent background */}
                <ambientLight intensity={0.5} />
                <ambientLight intensity={0.5} />
                {/* <Bubbles /> Removed per user request */}
                <SpaceDust />
            </Canvas>
        </div>
    );
}
