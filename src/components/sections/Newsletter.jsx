import { useState } from "react";
import SpinBadge from "../ui/SpinBadge";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) { setStatus("error"); return; }
    setStatus("success");
  };

  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <SpinBadge />
        <h2 className={styles.heading}>Updates + 10% off your first jar</h2>
        <p className={styles.sub}>
          Join the heat. Get early drops, recipes, and a discount on your first order.
        </p>
        {status === "success" ? (
          <div className={styles.success}>
            🌶️ You're in! Check your inbox for your discount code.
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className={`${styles.input} ${status === "error" ? styles.inputError : ""}`}
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setStatus("idle"); }}
              required
            />
            {status === "error" && <span className={styles.errorMsg}>Please enter a valid email.</span>}
            <button type="submit" className="pill-btn pill-btn--solid">Subscribe →</button>
            <p className={styles.privacy}>No spam, ever. Unsubscribe anytime.</p>
          </form>
        )}
      </div>
      <div className={styles.right}>
        <img
          src="https://images.unsplash.com/photo-1544025162-d76594e8bb9d?w=800&q=80"
          alt="Chilli jam food styling"
        />
      </div>
    </section>
  );
}
