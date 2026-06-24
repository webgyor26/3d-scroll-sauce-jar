import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./Hero.module.css";
gsap.registerPlugin(SplitText);

export default function Hero() {
  const heroWordRef = useRef(null);

  useEffect(() => {
    const el = heroWordRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(el, { type: "chars" });
      gsap.from(split.chars, {
        y: 120,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.06,
        delay: 0.3,
      });
      return () => split.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={styles.hero} id="sauce">
      <span className="label">Fire-Roasted · Sweet Heat · Small Batch</span>

      <h1 ref={heroWordRef} className={styles.heroWord}>FIRE</h1>

      <div className="dotted-line" style={{ margin: "1.5rem 0" }} />

      <p className={styles.accentSub}>Chilli Jam</p>

      <div className={styles.bottom}>
        <p className={styles.tagline}>
          Bold. Sticky. Unapologetically hot.<br />
          The one jar that changes everything.
        </p>
        <a href="#buy" className="pill-btn pill-btn--solid">Buy Now →</a>
      </div>
    </section>
  );
}
