import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "../ui/SplitReveal";
import styles from "./Tradition.module.css";
gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    numeral: "१",
    title: "Rooted in Tradition",
    desc: "Recipes passed down through generations, updated with a modern fire-roasting technique.",
    img: "https://images.unsplash.com/photo-1505409628601-edc9af17fda6?w=600&q=80",
  },
  {
    numeral: "२",
    title: "Small Batches Only",
    desc: "We never scale beyond what a single person can taste-check. Quality over quantity, always.",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
  },
  {
    numeral: "३",
    title: "Made with Warmth",
    desc: "Every lid is sealed by hand. Every label applied with care. You can taste the difference.",
    img: "https://images.unsplash.com/photo-1591189863430-ab87e120f312?w=600&q=80",
  },
];

export default function Tradition() {
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(cardsRef.current.children, {
        scale: 0.88,
        rotate: 8,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={`section ${styles.section}`}>
      <SplitReveal as="h2" className={styles.heading}>Tradition & Creation</SplitReveal>
      <p className={styles.sub}>Where heritage meets fearless flavour.</p>
      <div ref={cardsRef} className={styles.cards}>
        {cards.map((c) => (
          <div key={c.numeral} className={styles.card}>
            <span className={styles.numeral}>{c.numeral}</span>
            <div className={styles.cardImg}>
              <img src={c.img} alt={c.title} />
            </div>
            <h3 className={styles.cardTitle}>{c.title}</h3>
            <p className={styles.cardDesc}>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
