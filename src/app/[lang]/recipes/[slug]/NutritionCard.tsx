// src/app/[lang]/recipes/[slug]/NutritionCard.tsx
import styles from "./NutritionSection.module.css";

type Props = {
  name: string;
  /** e.g., 16 */
  quantity?: number | string | null;
  /** e.g., "g", "mg", "kcal" */
  unit?: string | null;
  /** e.g., "21.3%" or 21.3 or "21.3" */
  dailyPercent?: string | number | null;
};

function formatDaily(val: Props["dailyPercent"]): string | null {
  if (val == null || val === "") return null;
  const s = String(val).trim();
  if (!s) return null;
  if (/%$/.test(s)) return s;             // already has %
  const n = Number(s);
  if (Number.isFinite(n)) return `${Math.round(n * 10) / 10}%`;
  return s;
}

export default function NutritionCard({ name, quantity, unit, dailyPercent }: Props) {
  const daily = formatDaily(dailyPercent);
  return (
    <div className={styles.nutriCard}>
      <div className={styles.nutriName}>{name}</div>
      <div className={styles.nutriValue}>
        {quantity ?? ""} {unit ?? ""}
      </div>
      <div className={styles.nutriRule} aria-hidden="true" />
      {daily ? (
        <div className={styles.nutriSub}>{daily} of daily recommended value</div>
      ) : (
        <div className={styles.nutriSubPlaceholder} aria-hidden="true" />
      )}
    </div>
  );
}
