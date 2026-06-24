import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "../ui/SplitReveal";
import styles from "./UnwrapAdventure.module.css";
gsap.registerPlugin(ScrollTrigger);

const badges = [
  { icon: "🌶️", label: "Fire-Roasted Chillies" },
  { icon: "🍯", label: "Pure Cane Sugar" },
  { icon: "🧄", label: "Roasted Garlic" },
];

export default function UnwrapAdventure() {
  const badgesRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(badgesRef.current.children, {
        y: 60,
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: {
          trigger: badgesRef.current,
          start: "top 80%",
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={`section ${styles.section}`}>
      <SplitReveal as="h2" className={styles.heading}>
        Unwrap the Adventure
      </SplitReveal>
      <div ref={badgesRef} className={styles.badges}>
        {badges.map((b) => (
          <div key={b.label} className={styles.badge}>
            <span className={styles.badgeIcon}>{b.icon}</span>
            <span className={styles.badgeLabel}>{b.label}</span>
          </div>
        ))}
      </div>
      <p className={styles.para}>
        Every jar is a handcrafted journey — from sun-ripened chillies to your table.
        No shortcuts. No compromises. Just pure, unadulterated flavour.
      </p>
    </section>
  );
}
