// app/[lang]/(public)/services/components/Hero/ServicesHero.tsx
import styles from "./styles/ServicesHero.module.css";

export function ServicesHero({ lang }: { lang: "en" | "es" | "el" }) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Professional Nutrition Services</h1>
        <p className={styles.subtitle}>
          Comprehensive nutrition consulting services tailored to your unique
          needs, goals, and lifestyle.
        </p>

        <div className={styles.actions}>
          <a className={styles.primaryBtn} href={`/${lang}/contact`}>
            Book Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
