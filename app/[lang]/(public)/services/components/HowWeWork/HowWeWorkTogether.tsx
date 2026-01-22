// app/[lang]/(public)/services/components/HowWeWork/HowWeWorkTogether.tsx
import styles from "./styles/HowWeWorkTogether.module.css";

const steps = [
  {
    n: 1,
    title: "Initial Consultation",
    desc: "Comprehensive assessment of your goals, lifestyle, and preferences.",
  },
  {
    n: 2,
    title: "Custom Plan Creation",
    desc: "A personalized plan tailored to your needs and objectives.",
  },
  {
    n: 3,
    title: "Implementation Support",
    desc: "Ongoing guidance to successfully apply your plan.",
  },
  {
    n: 4,
    title: "Progress Monitoring",
    desc: "Regular check-ins and adjustments for continued results.",
  },
];

export function HowWeWorkTogether({ lang }: { lang: "en" | "es" | "el" }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>How We Work Together</h2>
        <p className={styles.subtitle}>
          Our proven process ensures you get effective and personalized
          guidance.
        </p>
      </div>

      <div className={styles.steps}>
        {steps.map((s) => (
          <div key={s.n} className={styles.step}>
            <div className={styles.badge}>{s.n}</div>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepDesc}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
