// app/[lang]/(public)/services/components/CTA/ServicesCta.tsx
import styles from "./styles/ServicesCta.module.css";

export function ServicesCta({ lang }: { lang: "en" | "es" | "el" }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Ready to Start Your Nutrition Journey?</h2>
        <p className={styles.subtitle}>
          Take the first step towards better health and performance. Book your
          free consultation today.
        </p>

        <div className={styles.actions}>
          <a className={styles.primaryBtn} href={`/${lang}/contact`}>
            Book Free Consultation
          </a>
          <a className={styles.secondaryBtn} href={`/${lang}/about`}>
            Learn About Our Approach
          </a>
        </div>
      </div>
    </section>
  );
}
