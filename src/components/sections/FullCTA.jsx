import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "../ui/SplitReveal";
import styles from "./FullCTA.module.css";
gsap.registerPlugin(ScrollTrigger);

export default function FullCTA() {
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        bgRef.current,
        { y: -60 },
        { y: 60, scrollTrigger: { trigger: bgRef.current.parentElement, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={styles.section} id="buy">
      <div ref={bgRef} className={styles.bg} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <SplitReveal as="h2" className={styles.heading}>
          Unlock the Magic Inside the Jar
        </SplitReveal>
        <a href="#buy" className="pill-btn pill-btn--solid" style={{ fontSize: "1.1rem", padding: "1rem 2.5rem" }}>
          Buy Now →
        </a>
      </div>
    </section>
  );
}
