import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "../ui/SplitReveal";
import styles from "./WhyTheJar.module.css";
gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "❄️",
    title: "Freshness",
    desc: "Air-tight sealing locks freshness from the moment it's made. Once opened, keeps for 8 weeks in the fridge.",
    img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80",
  },
  {
    icon: "👃",
    title: "Aroma & Flavour",
    desc: "The glass jar preserves volatile aromatics that plastic strips away. Open it and the room smells alive.",
    img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80",
  },
  {
    icon: "💪",
    title: "Nutrients Locked In",
    desc: "Our low-heat process protects the capsaicin and antioxidants that make chilli so good for you.",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  },
];

const tags = ["sealed in", "locked freshness", "full flavour", "pure heat"];
const tagAngles = [-12, 8, -5, 14];

export default function WhyTheJar() {
  const colsRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(colsRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: { trigger: colsRef.current, start: "top 80%" },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.topRow}>
        <SplitReveal as="h2" className={styles.heading}>Why the Jar Matters</SplitReveal>
        <div className={styles.tags}>
          {tags.map((t, i) => (
            <span key={t} className={styles.tag} style={{ rotate: `${tagAngles[i]}deg` }}>{t}</span>
          ))}
        </div>
      </div>
      <div ref={colsRef} className={styles.cols}>
        {features.map((f) => (
          <div key={f.title} className={styles.col}>
            <div className={styles.iconCircle}>{f.icon}</div>
            <h3 className={styles.colTitle}>{f.title}</h3>
            <p className={styles.colDesc}>{f.desc}</p>
            <div className={styles.colImg}>
              <img src={f.img} alt={f.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
