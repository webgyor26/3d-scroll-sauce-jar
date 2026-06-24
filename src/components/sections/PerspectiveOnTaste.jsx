import SplitReveal from "../ui/SplitReveal";
import styles from "./PerspectiveOnTaste.module.css";

export default function PerspectiveOnTaste() {
  return (
    <section className={`section ${styles.section}`}>
      <SplitReveal as="h2" className={styles.heading}>
        A New Perspective on Taste
      </SplitReveal>
      <div className={styles.cta}>
        <p className={styles.sub}>
          Once you taste it, everything else is ordinary.
        </p>
        <a href="#buy" className="pill-btn pill-btn--solid">Get Your Jar →</a>
      </div>
    </section>
  );
}
