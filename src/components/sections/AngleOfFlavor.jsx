import SplitReveal from "../ui/SplitReveal";
import styles from "./AngleOfFlavor.module.css";

export default function AngleOfFlavor() {
  return (
    <section className={`section ${styles.section}`} id="about">
      <SplitReveal as="h2" className={styles.heading}>
        A New Angle of Flavour
      </SplitReveal>
      <p className={styles.para}>
        We slow-roast our chillies until the sugars caramelise and the heat deepens
        into something complex — sweet on the front, fire on the finish.
        This isn't a condiment. It's a statement.
      </p>
    </section>
  );
}
