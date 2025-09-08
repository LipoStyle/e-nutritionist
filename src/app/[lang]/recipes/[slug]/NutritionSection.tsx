import styles from "./NutritionSection.module.css";
import { copy } from "./copy";
import type { Lang, Nutrition } from "./types";

export default function NutritionSection({
  lang,
  nutrition,
}: {
  lang: Lang;
  nutrition: Nutrition[];
}) {
  if (!nutrition.length) return null;
  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t.nutritionTitle}</h3>
      <div className={styles.nutriGrid}>
        {nutrition.map((nf, i) => (
          <div key={nf.id ?? `${nf.name}-${i}`} className={styles.nutriCard}>
            <div className={styles.nutriName}>{nf.name}</div>
            <div className={styles.nutriValue}>
              {nf.quantity} {nf.size}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
