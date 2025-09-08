import styles from "./RecipeDescription.module.css";

export default function RecipeDescription({ text }: { text: string }) {
  if (!text.trim()) return null;
  const normalized = text.replace(/\s*\n+\s*/g, " ").trim();
  return (
    <section className={styles.section}>
      <p className={styles.lead}>{normalized}</p>
    </section>
  );
}
