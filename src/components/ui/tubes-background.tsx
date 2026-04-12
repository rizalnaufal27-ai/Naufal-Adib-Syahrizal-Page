"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

interface TubeProps {
    path: THREE.Curve<THREE.Vector3>;
    color: string;
    radius: number;
    opacity: number;
    index: number;
}

function Tube({ path, color, radius, opacity, index }: TubeProps) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current || !mesh.current.material) return;
        const t = state.clock.getElapsedTime();

        const material = (Array.isArray(mesh.current.material)
            ? mesh.current.material[0]
            : mesh.current.material) as THREE.MeshStandardMaterial;

        if (material && material.emissiveIntensity !== undefined) {
            material.emissiveIntensity = 0.8 + Math.sin(t * 0.5 + index) * 0.3;
        }

        mesh.current.rotation.z = Math.sin(t * 0.05 + index) * 0.05;
    });

    return (
        <mesh ref={mesh}>
            <tubeGeometry args={[path, 64, radius, 4, false]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1}
                toneMapped={false}
                transparent
                opacity={opacity}
                roughness={0.1}
                metalness={0.1}
            />
        </mesh>
    );
}

// Simple seeded random to keep component pure
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

function Particles({ count = 100 }) {
    const mesh = useRef<THREE.Points>(null);
    const { viewport } = useThree();

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            temp[i * 3] = (seededRandom(i * 1.1) - 0.5) * viewport.width * 2;
            temp[i * 3 + 1] = (seededRandom(i * 2.2) - 0.5) * viewport.height * 2;
            temp[i * 3 + 2] = (seededRandom(i * 3.3) - 0.5) * 10;
            sizes[i] = seededRandom(i * 4.4);
        }
        return { positions: temp, sizes };
    }, [count, viewport]);

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.y = t * 0.02;
        mesh.current.rotation.x = t * 0.01;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#ffffff"
                transparent
                opacity={0.3}
                sizeAttenuation
            />
        </points>
    );
}

function Scene({ count = 5 }) {
    const { viewport } = useThree();

    const tubeData = useMemo(() => {
        const colors = ["#3B82F6", "#8B5CF6", "#06B6D4", "#EC4899"];
        return new Array(count).fill(0).map((_, i) => {
            const points = [];
            const width = viewport.width * 2;
            const height = viewport.height;

            for (let j = 0; j <= 5; j++) {
                points.push(
                    new THREE.Vector3(
                        (j / 5) * width - width / 2,
                        (seededRandom(i * 5.5 + j) - 0.5) * height * 1.5,
                        (seededRandom(i * 6.6 + j) - 0.5) * 5
                    )
                );
            }
            return {
                curve: new THREE.CatmullRomCurve3(points),
                color: colors[i % colors.length],
                radius: 0.02 + seededRandom(i * 7.7) * 0.05,
                opacity: 0.3 + seededRandom(i * 8.8) * 0.4
            };
        });
    }, [count, viewport]);

    return (
        <group>
            {tubeData.map((data, i) => (
                <Tube
                    key={i}
                    index={i}
                    path={data.curve}
                    color={data.color}
                    radius={data.radius}
                    opacity={data.opacity}
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
        const lerpFactor = 0.01;
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
