import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "../ui/SplitReveal";
import styles from "./NoFillers.module.css";
gsap.registerPlugin(ScrollTrigger);

export default function NoFillers() {
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.1 },
        { scale: 1, scrollTrigger: { trigger: imgRef.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <SplitReveal as="h2" className={styles.statement}>NO FILLERS.</SplitReveal>
        <SplitReveal as="h2" className={styles.statement}>NO SHORTCUTS.</SplitReveal>
        <p className={styles.tag}>just bold taste in every jar</p>
      </div>
      <div className={styles.right}>
        <div ref={imgRef} className={styles.imgWrap}>
          <img
            src="https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=800&q=80"
            alt="Chilli Jam close-up"
            className={styles.img}
          />
        </div>
      </div>
    </section>
  );
}
