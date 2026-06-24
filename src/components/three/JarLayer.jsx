import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import { story } from "../../lib/storyProgress";
import * as THREE from "three";

function Jar() {
  const g = useRef();

  useFrame((_, dt) => {
    if (!g.current) return;
    const p = story.progress;
    const targetRotY = p * Math.PI * 2.5;
    const targetRotZ = THREE.MathUtils.lerp(0, Math.PI * 0.15, Math.min(p * 2, 1));
    const targetY = THREE.MathUtils.lerp(-2.5, 0.3, Math.min(p * 2, 1));
    const k = 1 - Math.pow(0.001, dt);
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, targetRotY, k);
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, targetRotZ, k);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, targetY, k);
  });

  return (
    <group ref={g} position={[0, -2.5, 0]}>
      {/* Jar body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.75, 2.1, 64]} />
        <meshPhysicalMaterial
          color="#D44A0A"
          roughness={0.18}
          metalness={0.02}
          transmission={0.15}
          thickness={0.5}
        />
      </mesh>

      {/* Label band */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.83, 0.76, 1.4, 64]} />
        <meshStandardMaterial color="#F8EFE2" roughness={0.6} />
      </mesh>

      {/* Label text ring (thin amber stripe) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.835, 0.835, 0.08, 64]} />
        <meshStandardMaterial color="#F7AC32" roughness={0.4} emissive="#F7AC32" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.835, 0.835, 0.08, 64]} />
        <meshStandardMaterial color="#F7AC32" roughness={0.4} emissive="#F7AC32" emissiveIntensity={0.3} />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.38, 64]} />
        <meshStandardMaterial color="#120A06" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Lid top disc */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 64]} />
        <meshStandardMaterial color="#231009" roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.07, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.06, 64]} />
        <meshStandardMaterial color="#4E1E11" roughness={0.5} />
      </mesh>

      {/* Chilli inside (visible through label gap) - decorative spheres */}
      {[-0.2, 0.1, -0.05].map((x, i) => (
        <mesh key={i} position={[x * 0.5, -0.6 + i * 0.5, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#C21A6C" roughness={0.6} emissive="#C21A6C" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function JarLayer() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5.5], fov: 38 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#F7AC32" />
        <pointLight position={[0, -3, 2]} intensity={0.8} color="#E8821E" />
        <Environment preset="warehouse" />
        <Jar />
      </Canvas>
    </div>
  );
}
