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

    // Rise from below viewport (y=-5) to resting position (y=0)
    const riseP = Math.min(p * 3, 1);                            // rises fast in first 33% of story
    const targetY = THREE.MathUtils.lerp(-5, 0, riseP);

    // Full Y rotation across whole story
    const targetRotY = p * Math.PI * 2.5;

    // Gentle Z tilt: upright → slight tilt mid-story → back
    const tiltP = Math.sin(p * Math.PI);
    const targetRotZ = tiltP * 0.18;

    // Scale: pop in as it rises
    const targetScale = THREE.MathUtils.lerp(0.6, 1, Math.min(p * 4, 1));

    const k = 1 - Math.pow(0.001, dt); // frame-rate-independent smooth
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, targetRotY, k);
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, targetRotZ, k);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, targetY, k);
    g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, targetScale, k));
  });

  return (
    // Offset X=0.8 to sit right-of-center, matching reference layout (text left, jar right)
    <group ref={g} position={[0.8, -5, 0]}>
      {/* Jar body — slightly tapered like a real jam jar */}
      <mesh castShadow>
        <cylinderGeometry args={[0.78, 0.70, 2.2, 64]} />
        <meshPhysicalMaterial
          color="#C83E08"
          roughness={0.15}
          metalness={0.02}
          transmission={0.12}
          thickness={0.6}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Cream label band */}
      <mesh>
        <cylinderGeometry args={[0.79, 0.71, 1.5, 64]} />
        <meshStandardMaterial color="#F8EFE2" roughness={0.55} />
      </mesh>

      {/* Amber stripe top of label */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.795, 0.715, 0.07, 64]} />
        <meshStandardMaterial color="#F7AC32" emissive="#F7AC32" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      {/* Amber stripe bottom of label */}
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.795, 0.715, 0.07, 64]} />
        <meshStandardMaterial color="#F7AC32" emissive="#F7AC32" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>

      {/* Hot-pink chilli brand stripe through label center */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.792, 0.712, 0.12, 64]} />
        <meshStandardMaterial color="#C21A6C" emissive="#C21A6C" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.84, 0.84, 0.42, 64]} />
        <meshStandardMaterial color="#120A06" roughness={0.3} metalness={0.15} />
      </mesh>
      {/* Lid top face */}
      <mesh position={[0, 1.49, 0]}>
        <cylinderGeometry args={[0.84, 0.84, 0.03, 64]} />
        <meshStandardMaterial color="#231009" roughness={0.25} metalness={0.2} />
      </mesh>
      {/* Lid rim highlight */}
      <mesh position={[0, 1.47, 0]}>
        <torusGeometry args={[0.84, 0.03, 12, 64]} />
        <meshStandardMaterial color="#4E1E11" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Bottom base */}
      <mesh position={[0, -1.12, 0]}>
        <cylinderGeometry args={[0.70, 0.70, 0.06, 64]} />
        <meshStandardMaterial color="#4E1E11" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function JarLayer() {
  return (
    // zIndex 10 — floats above all section content. pointer-events:none so text is clickable.
    <div style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 36 }} shadows>
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#F7AC32" />
        <pointLight position={[2, -2, 3]} intensity={1.2} color="#E8821E" />
        <pointLight position={[-2, 3, 2]} intensity={0.5} color="#C21A6C" />
        <Environment preset="warehouse" />
        <Jar />
      </Canvas>
    </div>
  );
}
