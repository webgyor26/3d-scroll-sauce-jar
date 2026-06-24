import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import { story } from "../../lib/storyProgress";
import * as THREE from "three";

/* ── Label texture ── */
function useLabelTexture() {
  return useMemo(() => {
    const W = 1024, H = 620;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d");

    // cream/off-white background — exactly like the reference label
    c.fillStyle = "#F0E8D0";
    c.fillRect(0, 0, W, H);

    // subtle noise / paper texture
    for (let i = 0; i < 4000; i++) {
      const px = Math.random() * W, py = Math.random() * H;
      c.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
      c.fillRect(px, py, 1.5, 1.5);
    }

    // black bottom band (NET WT stripe)
    c.fillStyle = "#111";
    c.fillRect(0, H * 0.84, W, H * 0.16);
    c.fillStyle = "#F0E8D0";
    c.font = "700 26px Arial, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("NET WT. 300g", W / 2, H * 0.92);

    // top amber hairline
    c.strokeStyle = "#B8860B";
    c.lineWidth = 3;
    c.beginPath(); c.moveTo(W*0.08, H*0.09); c.lineTo(W*0.92, H*0.09); c.stroke();

    // EST & flame icon
    c.fillStyle = "#111";
    c.font = "600 19px Arial, sans-serif";
    c.fillText("EST.", W*0.38, H*0.13);
    c.fillText("2024", W*0.62, H*0.13);
    // flame shape
    const fx = W / 2, fy = H * 0.12;
    c.beginPath();
    c.moveTo(fx, fy - 18);
    c.bezierCurveTo(fx + 12, fy - 8, fx + 16, fy + 4, fx, fy + 14);
    c.bezierCurveTo(fx - 16, fy + 4, fx - 12, fy - 8, fx, fy - 18);
    c.fillStyle = "#CC1F1F";
    c.fill();
    c.beginPath();
    c.moveTo(fx, fy - 8);
    c.bezierCurveTo(fx + 7, fy, fx + 8, fy + 8, fx, fy + 12);
    c.bezierCurveTo(fx - 8, fy + 8, fx - 7, fy, fx, fy - 8);
    c.fillStyle = "#F7AC32";
    c.fill();

    // "SPICY & DELICIOUS" arc hint
    c.fillStyle = "#555";
    c.font = "600 20px Arial, sans-serif";
    c.fillText("— SPICY & DELICIOUS —", W / 2, H * 0.22);

    // CHILLI — big red
    c.fillStyle = "#CC1F1F";
    c.font = "900 158px 'Arial Black', Arial, sans-serif";
    c.fillText("CHILLI", W / 2, H * 0.44);

    // SAUCE — dark, slightly smaller
    c.fillStyle = "#111";
    c.font = "900 96px 'Arial Black', Arial, sans-serif";
    c.fillText("— SAUCE —", W / 2, H * 0.575);

    // "MADE WITH REAL CHILLIES" red banner
    c.fillStyle = "#CC1F1F";
    c.fillRect(W * 0.12, H * 0.615, W * 0.76, 32);
    c.fillStyle = "#F0E8D0";
    c.font = "700 17px Arial, sans-serif";
    c.fillText("MADE WITH REAL CHILLIES", W / 2, H * 0.631);

    // chilli pepper illustration (simple line art)
    const drawPepper = (startX, startY, flip) => {
      c.save();
      c.translate(startX, startY);
      if (flip) c.scale(-1, 1);
      c.strokeStyle = "#CC1F1F";
      c.fillStyle = "#CC1F1F";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(20, 10, 80, 15, 100, 5);
      c.bezierCurveTo(120, -5, 110, 30, 90, 28);
      c.bezierCurveTo(60, 26, 20, 22, 0, 0);
      c.fill();
      // stem
      c.strokeStyle = "#3a7020";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(0, 0); c.bezierCurveTo(-5, -12, 5, -22, 2, -28);
      c.stroke();
      c.restore();
    };
    drawPepper(W*0.28, H*0.74, false);
    drawPepper(W*0.72, H*0.74, true);

    // "BOLD FLAVOR. REAL HEAT." on lid — we'll reuse for body top area
    c.fillStyle = "#888";
    c.font = "600 16px Arial, sans-serif";
    c.fillText("BOLD FLAVOR.  REAL HEAT.", W / 2, H * 0.07);

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);
}

/* ── Lid label (ring text on the lid side) ── */
function useLidTexture() {
  return useMemo(() => {
    const W = 512, H = 128;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d");
    c.fillStyle = "#0a0604";
    c.fillRect(0, 0, W, H);
    c.fillStyle = "#F7AC32";
    c.font = "700 24px Arial, sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    // repeated text around lid
    for (let i = 0; i < 3; i++) {
      c.fillText("BOLD FLAVOR. REAL HEAT.  🌶  ", (W / 3) * i + W / 6, H / 2);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }, []);
}

/* ── Sauce Pour mesh (tapered stream + pooling disc) ── */
function SaucePour({ pouringRef }) {
  const streamRef = useRef();
  const poolRef = useRef();

  useFrame(() => {
    if (!streamRef.current || !poolRef.current) return;
    const p = pouringRef.current; // 0 = no pour, 1 = full pour
    // stream grows downward
    streamRef.current.visible = p > 0.05;
    streamRef.current.scale.y = Math.min(p * 2.5, 1);
    streamRef.current.scale.x = THREE.MathUtils.lerp(0.4, 1, Math.min(p * 2, 1));
    streamRef.current.position.y = -1.2 - (p * 1.5 * 0.5); // drops as it extends
    // pool grows on floor
    poolRef.current.visible = p > 0.3;
    poolRef.current.scale.x = Math.min((p - 0.3) * 3, 1);
    poolRef.current.scale.z = Math.min((p - 0.3) * 2, 0.6);
  });

  return (
    <group>
      {/* sauce stream */}
      <mesh ref={streamRef} position={[0, -1.2, 0]} visible={false}>
        <cylinderGeometry args={[0.18, 0.35, 2.8, 16]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.35} />
      </mesh>
      {/* sauce pool on "floor" */}
      <mesh ref={poolRef} position={[0, -3.2, 0]} rotation={[0, 0, 0]} visible={false}>
        <cylinderGeometry args={[0, 1.1, 0.18, 32]} />
        <meshStandardMaterial color="#991818" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Jar() {
  const bodyRef = useRef();   // entire jar group (body+label)
  const lidRef = useRef();    // lid group — separates on phase 2
  const groupRef = useRef();  // root group — handles rise + tilt
  const label = useLabelTexture();
  const lidTex = useLidTexture();
  const pouringProgress = useRef(0);

  // Bounce direction for idle
  const bounceT = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current || !lidRef.current) return;
    const p = story.progress;

    /* ── PHASE 1: idle in hero (p ≈ 0)
       Jar starts visible on the right side of screen, gently floats */
    bounceT.current += dt * 1.4;
    const idleStrength = Math.max(0, 1 - p * 8); // fades out quickly as scroll starts
    const bounceY = Math.sin(bounceT.current) * 0.12 * idleStrength;

    /* ── PHASE 2: lid opens (p 0.05 → 0.5)
       Jar body spins on Y; lid rises and rotates away */
    const phase2 = Math.max(0, Math.min((p - 0.05) / 0.45, 1));
    const targetRotY = phase2 * Math.PI * 3.5; // 1.75 full Y spins

    // Lid lifts upward and tilts
    const lidRise = THREE.MathUtils.lerp(0, 3.5, Math.min(phase2 * 1.6, 1));
    const lidTilt = THREE.MathUtils.lerp(0, Math.PI * 0.45, Math.min(phase2 * 1.2, 1));
    const lidDrift = THREE.MathUtils.lerp(0, 1.8, Math.min(phase2 * 1.4, 1));

    /* ── PHASE 3: tilt + pour (p 0.5 → 1.0) */
    const phase3 = Math.max(0, Math.min((p - 0.5) / 0.5, 1));
    const tiltAngle = THREE.MathUtils.lerp(0, Math.PI * 0.58, phase3); // 0 → ~105°
    const pourShift = THREE.MathUtils.lerp(0, -0.6, phase3);           // slide left as it tips
    pouringProgress.current = THREE.MathUtils.lerp(
      pouringProgress.current,
      phase3,
      1 - Math.pow(0.002, dt)
    );

    /* ── Y position: starts visible in hero (y=0), slight rise on scroll */
    const targetY = bounceY + THREE.MathUtils.lerp(0, 0.3, Math.min(p * 5, 1));

    const k = 1 - Math.pow(0.001, dt);

    // Root group: position + tilt
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, k * 2);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pourShift, k);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, tiltAngle, k);

    // Body spin on Y
    if (bodyRef.current) {
      bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, targetRotY, k);
    }

    // Lid: rise + tilt + drift sideways
    if (lidRef.current) {
      lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, lidRise, k);
      lidRef.current.position.x = THREE.MathUtils.lerp(lidRef.current.position.x, lidDrift, k);
      lidRef.current.rotation.z = THREE.MathUtils.lerp(lidRef.current.rotation.z, lidTilt, k);
      lidRef.current.rotation.y = THREE.MathUtils.lerp(lidRef.current.rotation.y, targetRotY * 0.7, k);
    }
  });

  return (
    // Right-of-center so hero left half stays clear for text
    <group ref={groupRef} position={[1.1, 0, 0]}>

      {/* ── Jar body group (spins) ── */}
      <group ref={bodyRef}>

        {/* Sauce fill inside */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[1.02, 0.94, 1.8, 64]} />
          <meshStandardMaterial color="#B91C1C" roughness={0.38} />
        </mesh>
        {/* sauce surface */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.05, 64]} />
          <meshStandardMaterial color="#D93515" roughness={0.22} />
        </mesh>
        {/* sauce particles hint (chunky chilli bits) */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r = 0.4 + Math.random() * 0.5;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, 0.2 + (i % 3) * 0.25, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.04 + Math.random() * 0.04, 6, 6]} />
              <meshStandardMaterial color={i % 3 === 0 ? "#E8431A" : "#8B0000"} roughness={0.5} />
            </mesh>
          );
        })}

        {/* Glass body (open cylinder — shows sauce inside) */}
        <mesh>
          <cylinderGeometry args={[1.08, 1.0, 2.0, 80, 1, true]} />
          <meshPhysicalMaterial
            color="#cce8e2"
            roughness={0.02}
            metalness={0}
            transmission={0.93}
            thickness={1.4}
            ior={1.52}
            transparent
            opacity={0.42}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Shoulder */}
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.7, 1.08, 0.3, 80, 1, true]} />
          <meshPhysicalMaterial
            color="#cce8e2"
            roughness={0.02}
            transmission={0.93}
            thickness={0.9}
            ior={1.52}
            transparent opacity={0.38}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Bottom glass disc */}
        <mesh position={[0, -1.02, 0]}>
          <cylinderGeometry args={[0.99, 0.99, 0.08, 80]} />
          <meshPhysicalMaterial color="#cce8e2" roughness={0.04} transmission={0.88} thickness={1.0} transparent opacity={0.5} />
        </mesh>

        {/* Label */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[1.10, 1.02, 1.38, 80, 1, true]} />
          <meshStandardMaterial map={label} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.44, 0]}>
          <cylinderGeometry args={[0.68, 0.7, 0.25, 64, 1, true]} />
          <meshPhysicalMaterial color="#cce8e2" roughness={0.04} transmission={0.9} thickness={0.5} transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>

        {/* Glass rim rings */}
        <mesh position={[0, 1.02, 0]}>
          <torusGeometry args={[1.04, 0.022, 16, 120]} />
          <meshStandardMaterial color="#fff" roughness={0.08} emissive="#fff" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -1.02, 0]}>
          <torusGeometry args={[1.0, 0.018, 16, 120]} />
          <meshStandardMaterial color="#fff" roughness={0.08} emissive="#fff" emissiveIntensity={0.25} />
        </mesh>

        {/* White sealing band under lid attachment point */}
        <mesh position={[0, 1.56, 0]}>
          <cylinderGeometry args={[0.695, 0.695, 0.065, 64]} />
          <meshStandardMaterial color="#ddd8cc" roughness={0.6} />
        </mesh>
      </group>

      {/* ── Lid group (lifts off on phase 2) ── */}
      <group ref={lidRef} position={[0, 0, 0]}>
        {/* Outer lid ring */}
        <mesh position={[0, 1.78, 0]}>
          <cylinderGeometry args={[0.76, 0.76, 0.42, 96]} />
          <meshStandardMaterial color="#0d0806" roughness={0.35} metalness={0.3} />
        </mesh>
        {/* Ribbed knurl */}
        <mesh position={[0, 1.78, 0]}>
          <cylinderGeometry args={[0.765, 0.765, 0.42, 180, 1]} />
          <meshStandardMaterial color="#1c1410" roughness={0.75} metalness={0.1} flatShading />
        </mesh>
        {/* Lid top */}
        <mesh position={[0, 1.99, 0]}>
          <cylinderGeometry args={[0.72, 0.76, 0.04, 96]} />
          <meshStandardMaterial color="#131010" roughness={0.32} metalness={0.38} />
        </mesh>
        {/* Lid top texture (wrap lid text around it) */}
        <mesh position={[0, 1.79, 0]}>
          <cylinderGeometry args={[0.77, 0.77, 0.38, 96, 1, true]} />
          <meshStandardMaterial map={lidTex} roughness={0.5} side={THREE.FrontSide} />
        </mesh>
        {/* Gold emblem on lid top */}
        <mesh position={[0, 2.02, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.02, 32]} />
          <meshStandardMaterial color="#F7AC32" roughness={0.3} emissive="#F7AC32" emissiveIntensity={0.3} metalness={0.4} />
        </mesh>
        {/* Chilli icon in gold on lid */}
        <mesh position={[0, 2.04, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.01, 32]} />
          <meshStandardMaterial color="#CC1F1F" roughness={0.4} emissive="#CC1F1F" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* ── Sauce pour (phase 3) ── */}
      <SaucePour pouringRef={pouringProgress} />
    </group>
  );
}

export default function JarLayer() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 9, 6]} intensity={2.8} />
        <directionalLight position={[-5, 2, -2]} intensity={1.0} color="#F9C46B" />
        <pointLight position={[0, -5, 4]} intensity={2.2} color="#E8821E" />
        <pointLight position={[-3, 4, 2]} intensity={0.9} color="#C21A6C" />
        <Environment preset="studio" environmentIntensity={0.9}>
          <Lightformer intensity={3.5} form="ring" position={[0, 6, 3]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.5} position={[0, -4, 2]} scale={[8, 3, 1]} color="#E8821E" />
        </Environment>
        <Jar />
      </Canvas>
    </div>
  );
}
