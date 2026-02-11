"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

// Le fichier chargé ici sera la statue (modèle Sketchfab exporté en .glb),
// à placer dans `frontend/public/models/hermes.glb`.
const MODEL_PATH = "/models/hermes.glb";
const STATUE_COLOR = "#F9F6F0"; // crème de la palette
const INITIAL_ROTATION_Y = (3 * Math.PI) / 2;
const SCALE = 5.8;

function StatueModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<Group>(null);

  const clonedScene = useRef<Group | null>(null);
  if (!clonedScene.current) {
    const clone = scene.clone() as Group;
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat: THREE.Material) => {
          if ("color" in mat) {
            (mat as THREE.MeshStandardMaterial).color.set(STATUE_COLOR);
          }
          if ("roughness" in mat) (mat as THREE.MeshStandardMaterial).roughness = 0.4;
          if ("metalness" in mat) (mat as THREE.MeshStandardMaterial).metalness = 0.05;
        });
      }
    });
    clonedScene.current = clone;
  }

  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;

    // Plus d'animation d'arrivée : la statue est directement à l'échelle finale
    g.scale.setScalar(SCALE);

    // Rotation contrôlée par le scroll, comme avant
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
      style={{ width: "100%", height: "100%", background: "#6C8157" }}
    >
      <color attach="background" args={["#6C8157"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 6, 6]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#e8e8f0" />
      <pointLight position={[0, -2, 4]} intensity={0.4} color="#F9F6F0" />
      <StatueModel scrollProgress={scrollProgress} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
