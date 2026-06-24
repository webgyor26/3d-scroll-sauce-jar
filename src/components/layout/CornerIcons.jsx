import { useState, useEffect } from "react";
import { ingredients } from "../../data/ingredients";
import { nutrition } from "../../data/nutrition";
import styles from "./CornerIcons.module.css";

function NutritionModal({ onClose }) {
  const [tab, setTab] = useState("ingredients");

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
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} data-lenis-prevent>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "ingredients" ? styles.tabActive : ""}`}
            onClick={() => setTab("ingredients")}
          >Ingredients</button>
          <button
            className={`${styles.tab} ${tab === "nutrition" ? styles.tabActive : ""}`}
            onClick={() => setTab("nutrition")}
          >Nutrition</button>
        </div>

        {tab === "ingredients" ? (
          <div className={styles.ingGrid}>
            {ingredients.map((ing) => (
              <div key={ing.name} className={styles.ingCard}>
                <span className={styles.ingIcon}>{ing.icon}</span>
                <strong className={styles.ingName}>{ing.name}</strong>
                <span className={styles.ingNote}>{ing.note}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.nutWrap}>
            <p className={styles.serving}>Per serving: {nutrition.servingSize}</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nutrient</th>
                  <th>Per Serving</th>
                </tr>
              </thead>
              <tbody>
                {nutrition.perServing.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CornerIcons() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.corner}>
        <button
          className={styles.iconBtn}
          onClick={() => setOpen(true)}
          aria-label="Ingredients & Nutrition"
          title="Ingredients & Nutrition"
        >
          🫙
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Cart"
          title="Cart"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </button>
      </div>
      {open && <NutritionModal onClose={() => setOpen(false)} />}
    </>
  );
}
