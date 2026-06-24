import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { story } from "../../lib/storyProgress";
import * as THREE from "three";

/* ---------- Label texture: CHILLI JAM wordmark drawn on a canvas ---------- */
function useLabelTexture() {
  return useMemo(() => {
    const w = 1024;
    const h = 512;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d");

    // Dark espresso label background
    x.fillStyle = "#1a0c06";
    x.fillRect(0, 0, w, h);

    // subtle vignette
    const g = x.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w / 1.4);
    g.addColorStop(0, "rgba(80,30,10,0.45)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);

    // top + bottom amber hairlines
    x.fillStyle = "#F7AC32";
    x.fillRect(w * 0.12, h * 0.16, w * 0.76, 5);
    x.fillRect(w * 0.12, h * 0.84, w * 0.76, 5);

    // Eyebrow
    x.fillStyle = "#F9C46B";
    x.font = "700 30px Arial, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.letterSpacing = "8px";
    x.fillText("FIRE-ROASTED · SMALL BATCH", w / 2, h * 0.27);

    // Wordmark CHILLI
    x.fillStyle = "#F7AC32";
    x.font = "900 132px Arial Black, Arial, sans-serif";
    x.fillText("CHILLI", w / 2, h * 0.46);

    // Wordmark JAM (hot pink)
    x.fillStyle = "#E0005C";
    x.font = "900 132px Arial Black, Arial, sans-serif";
    x.fillText("JAM", w / 2, h * 0.64);

    // tagline
    x.fillStyle = "#F8EFE2";
    x.font = "600 28px Arial, sans-serif";
    x.letterSpacing = "3px";
    x.fillText("SWEET HEAT · UNAPOLOGETICALLY HOT", w / 2, h * 0.78);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    // wrap so it spans the front ~70% of the jar, repeated correctly
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);
}

function Jar() {
  const g = useRef();
  const label = useLabelTexture();

  useFrame((_, dt) => {
    if (!g.current) return;
    const p = story.progress;

    const riseP = Math.min(p * 3, 1);
    const targetY = THREE.MathUtils.lerp(-5, 0, riseP);
    const targetRotY = p * Math.PI * 2.5;
    const targetRotZ = Math.sin(p * Math.PI) * 0.14;
    const targetScale = THREE.MathUtils.lerp(0.6, 1, Math.min(p * 4, 1));

    const k = 1 - Math.pow(0.001, dt);
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, targetRotY, k);
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, targetRotZ, k);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, targetY, k);
    g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, targetScale, k));
  });

  // Mason-jar proportions: wide, short, slight shoulder taper near the neck
  return (
    <group ref={g} position={[0.8, -5, 0]} scale={1.15}>
      {/* ---- Red sauce inside (drawn first, behind glass) ---- */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.92, 0.86, 1.55, 64]} />
        <meshStandardMaterial color="#C42306" roughness={0.45} />
      </mesh>
      {/* sauce surface meniscus */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.04, 64]} />
        <meshStandardMaterial color="#E8431A" roughness={0.3} />
      </mesh>

      {/* ---- Glass body (transparent, refractive) ---- */}
      <mesh>
        <cylinderGeometry args={[0.98, 0.9, 1.85, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#fff1e6"
          roughness={0.05}
          metalness={0}
          transmission={0.92}
          thickness={0.8}
          ior={1.5}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* glass shoulder (top taper into neck) */}
      <mesh position={[0, 1.03, 0]}>
        <cylinderGeometry args={[0.62, 0.98, 0.32, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#fff1e6"
          roughness={0.05}
          transmission={0.92}
          thickness={0.6}
          ior={1.5}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* glass bottom disc */}
      <mesh position={[0, -0.93, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 64]} />
        <meshPhysicalMaterial color="#fff1e6" roughness={0.1} transmission={0.85} thickness={0.5} transparent opacity={0.6} />
      </mesh>

      {/* ---- Wraparound label (sits just outside the glass) ---- */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[1.0, 0.94, 1.15, 64, 1, true]} />
        <meshStandardMaterial map={label} roughness={0.62} side={THREE.DoubleSide} />
      </mesh>

      {/* ---- Neck threads ---- */}
      <mesh position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 48]} />
        <meshPhysicalMaterial color="#fff1e6" roughness={0.1} transmission={0.8} thickness={0.4} transparent opacity={0.6} />
      </mesh>

      {/* ---- Black screw lid (ribbed) ---- */}
      <mesh position={[0, 1.46, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.34, 96]} />
        <meshStandardMaterial color="#0d0805" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* ribbed knurl ring on lid edge */}
      <mesh position={[0, 1.46, 0]}>
        <cylinderGeometry args={[0.665, 0.665, 0.34, 160]} />
        <meshStandardMaterial color="#1a1210" roughness={0.7} metalness={0.1} flatShading />
      </mesh>
      {/* lid top */}
      <mesh position={[0, 1.63, 0]}>
        <cylinderGeometry args={[0.62, 0.66, 0.04, 96]} />
        <meshStandardMaterial color="#161010" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* white sealing band under lid */}
      <mesh position={[0, 1.29, 0]}>
        <cylinderGeometry args={[0.605, 0.605, 0.05, 64]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function JarLayer() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 6]} intensity={2.2} />
        <directionalLight position={[-5, 3, -2]} intensity={0.9} color="#F7AC32" />
        <pointLight position={[3, -2, 4]} intensity={1.4} color="#E8821E" />
        <pointLight position={[-3, 4, 2]} intensity={0.7} color="#C21A6C" />
        {/* studio reflections for realistic glass */}
        <Environment preset="studio" environmentIntensity={0.8}>
          <Lightformer intensity={2} position={[0, 3, 4]} scale={[6, 4, 1]} />
        </Environment>
        <Jar />
      </Canvas>
    </div>
  );
}
