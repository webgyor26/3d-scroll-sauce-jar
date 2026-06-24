import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { story } from "../../lib/storyProgress";
import * as THREE from "three";

/* ── Label texture ── */
function useLabelTexture() {
  return useMemo(() => {
    const W = 1024, H = 640;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d");

    // deep espresso background
    c.fillStyle = "#170a04";
    c.fillRect(0, 0, W, H);

    // inner warm highlight (centre glow)
    const grd = c.createRadialGradient(W/2, H/2, 40, W/2, H/2, W*0.7);
    grd.addColorStop(0, "rgba(120,40,5,0.55)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = grd;
    c.fillRect(0, 0, W, H);

    // top amber border band
    c.fillStyle = "#F7AC32";
    c.fillRect(0, 0, W, 12);
    // bottom amber band
    c.fillRect(0, H - 12, W, 12);
    // inner thin amber lines
    c.fillStyle = "rgba(247,172,50,0.5)";
    c.fillRect(0, 28, W, 3);
    c.fillRect(0, H - 31, W, 3);

    // flame / chilli motif — simple drawn icon (left side)
    const fx = 96, fy = H / 2;
    c.beginPath();
    c.ellipse(fx, fy, 22, 34, 0, 0, Math.PI * 2);
    c.fillStyle = "#E0005C";
    c.fill();
    c.beginPath();
    c.ellipse(fx, fy - 12, 14, 24, 0, 0, Math.PI * 2);
    c.fillStyle = "#F7AC32";
    c.fill();
    c.beginPath();
    c.ellipse(fx, fy - 20, 8, 16, 0, 0, Math.PI * 2);
    c.fillStyle = "#fff8f0";
    c.fill();
    // mirror on right
    const fx2 = W - 96;
    c.beginPath(); c.ellipse(fx2, fy, 22, 34, 0, 0, Math.PI*2);
    c.fillStyle = "#E0005C"; c.fill();
    c.beginPath(); c.ellipse(fx2, fy-12, 14, 24, 0, 0, Math.PI*2);
    c.fillStyle = "#F7AC32"; c.fill();
    c.beginPath(); c.ellipse(fx2, fy-20, 8, 16, 0, 0, Math.PI*2);
    c.fillStyle = "#fff8f0"; c.fill();

    // eyebrow
    c.fillStyle = "#F9C46B";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = "700 22px Arial, sans-serif";
    c.fillText("FIRE-ROASTED · SMALL BATCH", W/2, H * 0.14);

    // CHILLI — large amber
    c.fillStyle = "#F7AC32";
    c.font = "900 148px 'Arial Black', Arial, sans-serif";
    c.fillText("CHILLI", W/2, H * 0.43);

    // JAM — hot pink, slightly smaller
    c.fillStyle = "#E0005C";
    c.font = "900 148px 'Arial Black', Arial, sans-serif";
    c.fillText("JAM", W/2, H * 0.66);

    // tagline
    c.fillStyle = "rgba(248,239,226,0.75)";
    c.font = "600 21px Arial, sans-serif";
    c.fillText("SWEET HEAT  ·  UNAPOLOGETICALLY HOT", W/2, H * 0.83);

    // dot separators across top+bottom
    c.fillStyle = "rgba(247,172,50,0.4)";
    for (let i = 0; i < W; i += 18) {
      c.beginPath(); c.arc(i, 20, 2.5, 0, Math.PI*2); c.fill();
      c.beginPath(); c.arc(i, H-20, 2.5, 0, Math.PI*2); c.fill();
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, []);
}

function Jar() {
  const g = useRef();
  const label = useLabelTexture();

  useFrame((_, dt) => {
    if (!g.current) return;
    const p = story.progress;

    // Rise: starts below viewport, fully visible by p=0.3
    const riseP = Math.min(p * 3.3, 1);
    const targetY = THREE.MathUtils.lerp(-4.5, -0.1, riseP);

    // Spin on Y axis — 2 full turns across the story
    const targetRotY = p * Math.PI * 4;

    // Tilt: 0 → ~85° (nearly horizontal) matching the reference "perspective" section
    const targetRotZ = THREE.MathUtils.lerp(0, Math.PI * 0.47, p);

    // Scale: pops in as it rises
    const targetScale = THREE.MathUtils.lerp(0.5, 1.1, Math.min(p * 5, 1));

    const k = 1 - Math.pow(0.001, dt);
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, targetRotY, k);
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, targetRotZ, k);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, targetY, k);
    g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, targetScale, k));
  });

  return (
    // Centered (x=0). Text sections have padding-right:50vw so right half is always clear.
    <group ref={g} position={[0, -4.5, 0]}>

      {/* ── 1. Red chilli sauce fill (behind glass) ── */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.01, 0.93, 1.7, 64]} />
        <meshStandardMaterial color="#BC2508" roughness={0.4} />
      </mesh>
      {/* sauce meniscus surface */}
      <mesh position={[0, 0.77, 0]}>
        <cylinderGeometry args={[1.01, 1.01, 0.05, 64]} />
        <meshStandardMaterial color="#D93515" roughness={0.25} />
      </mesh>

      {/* ── 2. Glass body — open-ended cylinder (inside visible) ── */}
      <mesh>
        <cylinderGeometry args={[1.08, 1.00, 2.0, 80, 1, true]} />
        <meshPhysicalMaterial
          color="#d4ede8"
          roughness={0.03}
          metalness={0}
          transmission={0.95}
          thickness={1.2}
          ior={1.52}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glass shoulder — tapers from body to neck */}
      <mesh position={[0, 1.16, 0]}>
        <cylinderGeometry args={[0.68, 1.08, 0.32, 80, 1, true]} />
        <meshPhysicalMaterial
          color="#d4ede8"
          roughness={0.03}
          transmission={0.95}
          thickness={0.8}
          ior={1.52}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glass bottom disc */}
      <mesh position={[0, -1.0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.06, 80]} />
        <meshPhysicalMaterial
          color="#d4ede8"
          roughness={0.05}
          transmission={0.9}
          thickness={0.8}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* ── 3. Label wrapped around glass ── */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[1.10, 1.02, 1.28, 80, 1, true]} />
        <meshStandardMaterial
          map={label}
          roughness={0.58}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── 4. Neck ── */}
      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry args={[0.66, 0.68, 0.22, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#d4ede8"
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          transparent opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── 5. Lid ── */}
      {/* outer metal ring */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.74, 0.74, 0.38, 96]} />
        <meshStandardMaterial color="#0e0806" roughness={0.38} metalness={0.3} />
      </mesh>
      {/* ribbed edge (flat-shaded for knurl effect) */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.745, 0.745, 0.38, 160, 1, false]} />
        <meshStandardMaterial color="#1c1410" roughness={0.72} metalness={0.08} flatShading />
      </mesh>
      {/* lid top face */}
      <mesh position={[0, 1.84, 0]}>
        <cylinderGeometry args={[0.7, 0.74, 0.04, 96]} />
        <meshStandardMaterial color="#151010" roughness={0.35} metalness={0.35} />
      </mesh>
      {/* lid centre disc */}
      <mesh position={[0, 1.87, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.015, 64]} />
        <meshStandardMaterial color="#F7AC32" roughness={0.4} emissive="#F7AC32" emissiveIntensity={0.15} />
      </mesh>
      {/* white sealing band under lid */}
      <mesh position={[0, 1.47, 0]}>
        <cylinderGeometry args={[0.67, 0.67, 0.06, 64]} />
        <meshStandardMaterial color="#e2ddd5" roughness={0.65} />
      </mesh>

      {/* ── 6. Glass rim highlight (thin bright ring at top of body) ── */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[1.04, 0.025, 16, 120]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} emissive="#ffffff" emissiveIntensity={0.25} />
      </mesh>
      {/* bottom glass rim */}
      <mesh position={[0, -1.0, 0]}>
        <torusGeometry args={[1.01, 0.02, 16, 120]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export default function JarLayer() {
  return (
    <div className="jar-layer" style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        {/* key light from front-right top */}
        <directionalLight position={[4, 7, 5]} intensity={2.8} />
        {/* amber fill from left */}
        <directionalLight position={[-5, 2, -1]} intensity={1.1} color="#F7AC32" />
        {/* warm orange rim from below */}
        <pointLight position={[0, -4, 3]} intensity={2.0} color="#E8821E" />
        {/* magenta accent bounce */}
        <pointLight position={[-3, 3, 1]} intensity={0.8} color="#C21A6C" />

        <Environment preset="studio" environmentIntensity={1.0}>
          {/* large soft box above — critical for glass reflections */}
          <Lightformer intensity={3} form="ring" position={[0, 5, 3]} scale={[8, 8, 1]} />
          {/* floor bounce */}
          <Lightformer intensity={1.2} position={[0, -3, 2]} scale={[6, 2, 1]} color="#E8821E" />
        </Environment>
        <Jar />
      </Canvas>
    </div>
  );
}
