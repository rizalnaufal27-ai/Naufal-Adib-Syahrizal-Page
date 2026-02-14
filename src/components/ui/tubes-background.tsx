// @ts-nocheck
"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3 } from "three";

function Tube({ path, color, radius = 0.1, opacity = 0.5, index }: any) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current || !mesh.current.material) return;
        const t = state.clock.getElapsedTime();

        // Safety check for material array or single
        const material = (Array.isArray(mesh.current.material)
            ? mesh.current.material[0]
            : mesh.current.material) as THREE.MeshStandardMaterial;

        if (material && material.emissiveIntensity !== undefined) {
            // Pulsing glow effect - SLOWER & SOFTER for "Comfy" look
            material.emissiveIntensity = 0.8 + Math.sin(t * 0.5 + index) * 0.3;
        }

        // Gentle floating movement - VERY SLOW
        mesh.current.rotation.z = Math.sin(t * 0.05 + index) * 0.05;
    });

    return (
        <mesh ref={mesh}>
            <tubeGeometry args={[path, 64, radius, 4, false]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1} // Lower base intensity
                toneMapped={false}
                transparent
                opacity={0.2} // More transparent
                roughness={0.1}
                metalness={0.1}
            />
        </mesh>
    );
}

function Particles({ count = 100 }) { // Reduced count
    const mesh = useRef<THREE.Points>(null);
    const { viewport } = useThree();

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
            temp[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
            sizes[i] = Math.random();
        }
        return { positions: temp, sizes };
    }, [count, viewport]);

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.y = t * 0.02; // Slower
        mesh.current.rotation.x = t * 0.01; // Slower
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03} // Smaller particles
                color="#ffffff"
                transparent
                opacity={0.3} // Less visible
                sizeAttenuation
            />
        </points>
    );
}

function Scene({ count = 5 }) { // Reduced count for simplicity
    const { viewport } = useThree();

    const curves = useMemo(() => {
        return new Array(count).fill(0).map(() => {
            const points = [];
            const width = viewport.width * 2;
            const height = viewport.height;

            for (let i = 0; i <= 5; i++) {
                points.push(
                    new THREE.Vector3(
                        (i / 5) * width - width / 2,
                        (Math.random() - 0.5) * height * 1.5,
                        (Math.random() - 0.5) * 5
                    )
                );
            }
            return new CatmullRomCurve3(points);
        });
    }, [count, viewport]);

    const colors = ["#3B82F6", "#8B5CF6", "#06B6D4", "#EC4899"];

    return (
        <group>
            {curves.map((curve, i) => (
                <Tube
                    key={i}
                    index={i}
                    path={curve}
                    color={colors[i % colors.length]}
                    radius={0.02 + Math.random() * 0.05}
                    opacity={0.3 + Math.random() * 0.4}
                />
            ))}
            <Particles />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </group>
    );
}

function Rig() {
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Smooth mouse look or auto-drift if no mouse interaction
        const lerpFactor = 0.01; // Slower camera drift
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(t * 0.1) * 0.5, lerpFactor);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.cos(t * 0.1) * 0.2, lerpFactor);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function TubesBackground() {
    return (
        <div className="fixed inset-0 w-full h-full bg-[#050505]">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 75 }}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
            >
                <Rig />
                <Scene count={5} />
            </Canvas>
        </div>
    );
}
