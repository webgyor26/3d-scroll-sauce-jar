import styles from "./Footer.module.css";

const year = new Date().getFullYear();

export default function Footer() {
  const copyEmail = () => {
    navigator.clipboard.writeText("hello@chillijam.co");
  };

  return (
    <footer className={styles.footer}>
      <div className="dotted-line" />
      <div className={styles.inner}>
        <div className={styles.wordmark}>Chilli Jam</div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <span className="label">The Jar</span>
            <a href="#sauce">Our Sauce</a>
            <a href="#recipes">Recipes</a>
            <a href="#about">About</a>
            <a href="#game">Game</a>
          </div>
          <div className={styles.col}>
            <span className="label">Get It</span>
            <a href="#buy">Where to Buy</a>
            <a href="#contact" id="contact">Contact</a>
          </div>
          <div className={styles.col}>
            <span className="label">Legal</span>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className={styles.col}>
            <span className="label">Find Us</span>
            <span className={styles.location}>London, UK</span>
            <button className={styles.emailCopy} onClick={copyEmail} title="Click to copy">
              hello@chillijam.co
            </button>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.insta}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              @chillijam
            </a>
          </div>
        </div>
      </div>
      <div className="dotted-line" style={{ marginTop: "3rem" }} />
      <div className={styles.bottom}>
        <span>© {year} Chilli Jam · All rights reserved</span>
        <span className={styles.credit}>Made with 🌶️</span>
      </div>
    </footer>
  );
}
