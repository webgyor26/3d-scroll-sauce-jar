import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ingredients } from "../../data/ingredients";
import styles from "./WhatsInside.module.css";
gsap.registerPlugin(ScrollTrigger);

export default function WhatsInside() {
  const listRef = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(listRef.current.children, {
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        scrollTrigger: { trigger: listRef.current, start: "top 80%" },
      });
      gsap.fromTo(
        imgRef.current,
        { scale: 1.1 },
        { scale: 1, scrollTrigger: { trigger: imgRef.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={styles.section} id="sauce">
      <div className={styles.left}>
        <h2 className={styles.heading}>What's Inside</h2>
        <div className="dotted-line" style={{ margin: "1.5rem 0" }} />
        <p className={styles.intro}>
          Six honest ingredients. Zero fillers. Infinitely complex flavour.
        </p>
        <ul ref={listRef} className={styles.list}>
          {ingredients.map((ing) => (
            <li key={ing.name} className={styles.item}>
              <span className={styles.icon}>{ing.icon}</span>
              <div>
                <strong>{ing.name}</strong>
                <span className={styles.note}> — {ing.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.right}>
        <div ref={imgRef} className={styles.imgWrap}>
          <img
            src="https://images.unsplash.com/photo-1593504049359-74330189a345?w=800&q=80"
            alt="Chilli Jam jar held by hand"
            className={styles.img}
          />
        </div>
      </div>
    </section>
  );
}
