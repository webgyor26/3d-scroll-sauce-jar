import styles from "./SpinBadge.module.css";

export default function SpinBadge({ text = "10% OFF · FIRST JAR · 10% OFF · FIRST JAR ·" }) {
  return (
    <div className={styles.badge}>
      <svg viewBox="0 0 120 120" className={styles.svg}>
        <path id="circle" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" fill="none" />
        <text className={styles.text}>
          <textPath href="#circle">{text}</textPath>
        </text>
      </svg>
      <span className={styles.center}>✦</span>
    </div>
  );
}
