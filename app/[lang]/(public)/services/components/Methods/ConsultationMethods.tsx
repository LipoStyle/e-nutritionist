// app/[lang]/(public)/services/components/Methods/ConsultationMethods.tsx
import styles from "./styles/ConsultationMethods.module.css";

const methods = [
  {
    title: "In-Person Consultations",
    desc: "Face-to-face meetings for comprehensive assessments.",
  },
  {
    title: "Virtual Consultations",
    desc: "Online sessions for convenience and accessibility from anywhere.",
  },
  {
    title: "Hybrid Approach",
    desc: "A combination of in-person and virtual sessions based on your needs.",
  },
];

export function ConsultationMethods({ lang }: { lang: "en" | "es" | "el" }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h2 className={styles.title}>Consultation Methods</h2>

          <ul className={styles.list}>
            {methods.map((m) => (
              <li key={m.title} className={styles.item}>
                <div className={styles.check} aria-hidden="true">
                  ✓
                </div>
                <div>
                  <div className={styles.itemTitle}>{m.title}</div>
                  <div className={styles.itemDesc}>{m.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <img
            className={styles.image}
            src="/images/services/consultation.jpg"
            alt="Consultation"
          />
        </div>
      </div>
    </section>
  );
}
