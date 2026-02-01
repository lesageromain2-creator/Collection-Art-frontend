"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

const MODEL_PATH = "/models/hermes.glb";
const MARBLE_WHITE = "#f5f5f0";
const INITIAL_ROTATION_Y = (3 * Math.PI) / 2;
const SCALE = 5.8;
const DURATION_ENTRANCE = 1.4;
const SCALE_START = 0.55;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function HermesModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);
  const entranceRef = useRef(0);

  const clonedScene = useRef<Group | null>(null);
  if (!clonedScene.current) {
    const clone = scene.clone() as Group;
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.Material) => {
          if ("color" in mat) {
            (mat as THREE.MeshStandardMaterial).color.set(MARBLE_WHITE);
          }
          if ("roughness" in mat) (mat as THREE.MeshStandardMaterial).roughness = 0.4;
          if ("metalness" in mat) (mat as THREE.MeshStandardMaterial).metalness = 0.05;
        });
      }
    });
    clonedScene.current = clone;
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;

    if (entranceRef.current < 1) {
      entranceRef.current = Math.min(1, entranceRef.current + delta / DURATION_ENTRANCE);
      const t = easeOutCubic(entranceRef.current);
      const s = SCALE * (SCALE_START + (1 - SCALE_START) * t);
      g.scale.setScalar(s);
    } else {
      g.scale.setScalar(SCALE);
    }

    g.rotation.y = INITIAL_ROTATION_Y + scrollProgress * Math.PI * 2;
  });

  return (
    <group ref={groupRef} scale={[SCALE, SCALE, SCALE]} position={[0, 0, 0]}>
      <Center>
        <primitive object={clonedScene.current} />
      </Center>
    </group>
  );
}

export default function HermesScene({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 11], fov: 44 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 6, 6]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#e8e8f0" />
      <pointLight position={[0, -2, 4]} intensity={0.4} color="#f5f5f0" />
      <HermesModel scrollProgress={scrollProgress} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
