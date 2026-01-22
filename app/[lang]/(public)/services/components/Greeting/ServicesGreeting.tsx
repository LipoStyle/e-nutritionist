// app/[lang]/(public)/services/components/Greeting/ServicesGreeting.tsx
import styles from "./styles/ServicesGreeting.module.css";

export function ServicesGreeting({ lang }: { lang: "en" | "es" | "el" }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Our Services</h2>
        <p className={styles.subtitle}>
          Choose from our range of professional nutrition services designed to
          help you achieve your health and performance goals.
        </p>
      </div>
    </section>
  );
}
