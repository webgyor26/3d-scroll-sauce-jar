import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

const navLinks = ["sauce", "about", "recipes", "game"];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${hidden ? styles.hidden : ""}`}>
        <nav className={styles.navLeft}>
          {navLinks.map((link, i) => (
            <a key={link} href={`#${link}`} className={styles.navLink}>
              {link}
              {i < navLinks.length - 1 && <span className={styles.dot}>·</span>}
            </a>
          ))}
        </nav>

        <a href="#" className={styles.wordmark}>Chilli Jam</a>

        <div className={styles.navRight}>
          <a href="#contact" className={styles.navLink}>contact</a>
          <a href="#buy" className={`pill-btn pill-btn--solid ${styles.buyBtn}`}>Buy Now</a>
          <button className={styles.cartBtn} aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
          <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>
      <div className="dotted-line" style={{ position: "fixed", top: "64px", zIndex: 999 }} />

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
          {navLinks.map((link) => (
            <a key={link} href={`#${link}`} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
          <a href="#buy" className={`pill-btn pill-btn--solid`} onClick={() => setMenuOpen(false)}>Buy Now</a>
        </div>
      )}
    </>
  );
}
