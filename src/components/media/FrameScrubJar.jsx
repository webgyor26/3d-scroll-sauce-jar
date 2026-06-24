import { useEffect, useRef, useState } from "react";
import { story } from "../../lib/storyProgress";

/*
  Image crossfade-scrub jar.

  Uses 3 real product photos as keyframes, mapped to the 3-stage process:
    step1.png  → jar closed, upright            (Hero / idle)
    step2.png  → lid off, sitting beside jar     (mid scroll — "opening")
    step3.png  → jar tilted, sauce pouring out   (late scroll — "pour")

  Scroll progress (story.progress, 0→1) crossfades between them and adds
  subtle transform motion. Phase 1 (no scroll) adds a gentle idle bounce.

  Drop the 3 files into:  public/jar/step1.png  step2.png  step3.png
*/

const BASE = import.meta.env.BASE_URL || "/";
const FRAMES = [
  `${BASE}jar/step1.png`,
  `${BASE}jar/step2.png`,
  `${BASE}jar/step3.png`,
];

export default function FrameScrubJar() {
  const refs = [useRef(null), useRef(null), useRef(null)];
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [missing, setMissing] = useState(false);

  // Preload + detect missing files (graceful fallback)
  useEffect(() => {
    let loaded = 0;
    let failed = false;
    FRAMES.forEach((src) => {
      const im = new Image();
      im.onload = () => { if (++loaded === FRAMES.length && !failed) setReady(true); };
      im.onerror = () => { failed = true; setMissing(true); };
      im.src = src;
    });
  }, []);

  useEffect(() => {
    let raf;
    const bounceStart = performance.now();

    const loop = () => {
      const p = story.progress; // 0..1
      const els = refs.map((r) => r.current);
      if (els.every(Boolean)) {
        /* ---- Crossfade weights across 3 keyframes ---- */
        // step1 dominant 0→0.30, fades to step2 by 0.50
        // step2 dominant 0.45→0.55, fades to step3 by 0.80
        // step3 dominant 0.80→1.0
        let w0 = 0, w1 = 0, w2 = 0;
        if (p < 0.45) {
          const t = clamp(p / 0.45);
          w0 = 1 - t; w1 = t;
        } else {
          const t = clamp((p - 0.45) / 0.45);
          w1 = 1 - t; w2 = t;
        }
        els[0].style.opacity = w0.toFixed(3);
        els[1].style.opacity = w1.toFixed(3);
        els[2].style.opacity = w2.toFixed(3);

        /* ---- Idle bounce (only when basically unscrolled) ---- */
        const idle = Math.max(0, 1 - p * 12);
        const t = (performance.now() - bounceStart) / 1000;
        const bounce = Math.sin(t * 1.6) * 14 * idle; // px

        /* ---- Scroll motion: gentle rise + scale as the story plays ---- */
        const rise = -p * 30;            // drift up a little
        const scale = 1 + p * 0.06;      // subtle zoom
        if (wrapRef.current) {
          wrapRef.current.style.transform =
            `translateY(${(bounce + rise).toFixed(2)}px) scale(${scale.toFixed(3)})`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  if (missing) {
    // Files not added yet — show a clear placeholder instead of a blank/broken area
    return (
      <div style={placeholderStyle}>
        <div style={{ textAlign: "center", color: "#F9C46B", fontFamily: "system-ui", opacity: 0.5 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🫙</div>
          <div style={{ fontSize: 13, letterSpacing: 1 }}>
            Add <code>public/jar/step1–3.png</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={layerStyle}>
      <div ref={wrapRef} style={imageBoxStyle}>
        {FRAMES.map((src, i) => (
          <img
            key={i}
            ref={refs[i]}
            src={src}
            alt=""
            draggable={false}
            style={{
              ...imgStyle,
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function clamp(v) { return Math.max(0, Math.min(1, v)); }

const layerStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 10,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "max(4vw, 1rem)",
};

const imageBoxStyle = {
  position: "relative",
  width: "min(46vw, 620px)",
  height: "min(80vh, 760px)",
  willChange: "transform",
};

const imgStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.45))",
  transition: "none",
};

const placeholderStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 10,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  paddingRight: "8vw",
};
