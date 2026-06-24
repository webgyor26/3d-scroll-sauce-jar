import { useState, useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { recipes } from "../../data/recipes";
import styles from "./Recipes.module.css";
gsap.registerPlugin(ScrollTrigger);

function RecipeModal({ recipe, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} data-lenis-prevent>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <div className={styles.modalImg}>
          <img src={recipe.image} alt={recipe.title} />
        </div>
        <div className={styles.modalBody}>
          <span className="label">{recipe.tag} · {recipe.time}</span>
          <h2 className={styles.modalTitle}>{recipe.title}</h2>
          <div className={styles.breakdown}>
            {Object.entries(recipe.breakdown).map(([k, v]) => (
              <div key={k} className={styles.stat}>
                <span className={styles.statVal}>{v}</span>
                <span className={styles.statKey}>{k}</span>
              </div>
            ))}
          </div>
          <div className="dotted-line" style={{ margin: "1.5rem 0" }} />
          <h3 className={styles.sectionTitle}>Ingredients</h3>
          <ul className={styles.ingList}>
            {recipe.ingredients.map((ing) => <li key={ing}>{ing}</li>)}
          </ul>
          <h3 className={styles.sectionTitle}>Method</h3>
          <ol className={styles.steps}>
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function Recipes() {
  const [active, setActive] = useState(null);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(cardsRef.current.children, {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className={`section ${styles.section}`} id="recipes">
      <div className={styles.intro}>
        <span className={styles.recipeIcon}>🍳</span>
        <SectionLabel>Let's Get Cooking</SectionLabel>
        <a href="#recipes" className="pill-btn pill-btn--outline" style={{ marginTop: "1rem" }}>All Recipes</a>
      </div>
      <div ref={cardsRef} className={styles.grid}>
        {recipes.map((r) => (
          <button key={r.id} className={styles.card} onClick={() => setActive(r)}>
            <div className={styles.cardImg}>
              <img src={r.image} alt={r.title} />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.chips}>
                <span className={styles.chip}>{r.tag}</span>
                <span className={styles.chip}>{r.time}</span>
              </div>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardBlurb}>{r.blurb}</p>
            </div>
          </button>
        ))}
      </div>
      {active && <RecipeModal recipe={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function SectionLabel({ children }) {
  return <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: "clamp(2rem,6vw,5rem)", textTransform: "uppercase", color: "var(--amber)", lineHeight: 0.92 }}>{children}</h2>;
}
