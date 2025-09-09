// src/app/[lang]/recipes/[slug]/NutritionSection.tsx
import styles from "./NutritionSection.module.css";
import { copy } from "./copy";
import NutritionCard from "./NutritionCard";
import type { Lang, Nutrition } from "./types";

/** Daily Value (DV) reference table.
 * Units are noted in comments; values are the *base unit* shown below.
 * Base units used internally:
 *  - mass: grams (g)
 *  - sodium/cholesterol/potassium/calcium/iron/etc: grams (convert mg → g)
 *  - vitamins that are mcg/mg are converted to grams for math, but we store DV in their native unit then convert
 *
 * These are approximate, general adult DVs (not age/sex-specific).
 */
const DV_REFERENCE: Record<
  string,
  { value: number; unit: "g" | "mg" | "mcg" | "kcal" }
> = {
  // Macronutrients
  Protein: { value: 50, unit: "g" },
  Fat: { value: 78, unit: "g" },                // Total fat
  "Saturated Fat": { value: 20, unit: "g" },
  Carbs: { value: 275, unit: "g" },             // Total carbohydrate
  Fiber: { value: 28, unit: "g" },
  "Added Sugars": { value: 50, unit: "g" },     // Added sugar DV (cap)

  // Minerals & electrolytes
  Sodium: { value: 2300, unit: "mg" },          // 2.3 g
  Potassium: { value: 4700, unit: "mg" },       // 4.7 g
  Calcium: { value: 1300, unit: "mg" },         // 1.3 g
  Iron: { value: 18, unit: "mg" },
  Cholesterol: { value: 300, unit: "mg" },

  // Vitamins (common)
  "Vitamin A": { value: 900, unit: "mcg" },     // mcg RAE
  "Vitamin C": { value: 90, unit: "mg" },
  "Vitamin D": { value: 20, unit: "mcg" },      // 800 IU
  "Vitamin E": { value: 15, unit: "mg" },
  "Vitamin K": { value: 120, unit: "mcg" },

  // Others (optional examples)
  "Sugars": { value: 50, unit: "g" },           // treat as added sugars if you want
};

/** Alias map so different labels still resolve (case-insensitive) */
const DV_ALIASES: Record<string, string> = {
  "total fat": "Fat",
  "saturated fat": "Saturated Fat",
  carbohydrate: "Carbs",
  carbohydrates: "Carbs",
  carbs: "Carbs",
  fibre: "Fiber",
  sugars: "Sugars",
  "added sugar": "Added Sugars",
  "vitamin a": "Vitamin A",
  "vit a": "Vitamin A",
  "vitamin c": "Vitamin C",
  "vit c": "Vitamin C",
  "vitamin d": "Vitamin D",
  "vit d": "Vitamin D",
  "vitamin e": "Vitamin E",
  "vit e": "Vitamin E",
  "vitamin k": "Vitamin K",
  "vit k": "Vitamin K",
};

function normalizeName(name: string): string {
  const key = name.trim().toLowerCase();
  if (DV_ALIASES[key]) return DV_ALIASES[key];
  // Title-case the original for lookup
  return name;
}

function toGrams(value: number, unit: "g" | "mg" | "mcg"): number {
  if (unit === "g") return value;
  if (unit === "mg") return value / 1000;
  return value / 1_000_000; // mcg → g
}

function fromToSameBase(value: number, from: "g" | "mg" | "mcg", to: "g" | "mg" | "mcg"): number {
  // convert 'value' from 'from' to 'to'
  if (from === to) return value;
  // convert to grams first
  const grams = toGrams(value, from);
  if (to === "g") return grams;
  if (to === "mg") return grams * 1000;
  return grams * 1_000_000; // mcg
}

function parseAmount(qty: unknown): number | null {
  if (qty == null) return null;
  const n = Number(qty);
  return Number.isFinite(n) ? n : null;
}

function parseUnit(raw: unknown): "g" | "mg" | "mcg" | "kcal" | null {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (s === "g" || s === "gram" || s === "grams") return "g";
  if (s === "mg") return "mg";
  if (s === "mcg" || s === "μg" || s === "ug") return "mcg";
  if (s === "kcal" || s === "cal") return "kcal";
  return null;
}

function computeDailyPercent(name: string, qty: unknown, unit: unknown): number | null {
  const normalized = normalizeName(name);
  const ref = DV_REFERENCE[normalized];
  const amount = parseAmount(qty);
  const u = parseUnit(unit);

  if (!ref || amount == null || !u) return null;

  // Calories have no simple %DV here; skip
  if (u === "kcal" || ref.unit === "kcal") return null;

  // Convert both to a common base in grams (or in their own unit via same-base conversion)
  // We'll convert the "amount" to the *reference unit* first for clean math.
  const amountInRefUnit = fromToSameBase(amount, u, ref.unit);
  if (!Number.isFinite(amountInRefUnit) || ref.value <= 0) return null;

  const pct = (amountInRefUnit / ref.value) * 100;
  // Round to 0.1%
  return Math.round(pct * 10) / 10;
}

function coalesceProvidedDaily(nf: Nutrition): number | null {
  const v =
    (nf as any).daily_percent ??
    (nf as any).daily_value_percent ??
    (nf as any).dv_percent ??
    (nf as any).percent ??
    null;
  if (v == null || v === "") return null;
  const s = String(v).trim().replace(/%$/, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function formatDailyStr(pct: number | null): string | null {
  if (pct == null) return null;
  return `${pct}%`;
}

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
        {nutrition.map((nf, i) => {
          // Prefer explicitly provided daily percent if present; else compute
          const provided = coalesceProvidedDaily(nf);
          const computed = computeDailyPercent(nf.name, nf.quantity, nf.size);
          const dailyPercent = provided ?? computed ?? null;

          return (
            <div key={nf.id ?? `${nf.name}-${i}`} className={styles.nutriCard}>
              <div className={styles.nutriName}>{nf.name}</div>
              <div className={styles.nutriValue}>
                {nf.quantity} {nf.size}
              </div>
              <div className={styles.nutriRule} aria-hidden="true" />
              {dailyPercent != null ? (
                <div className={styles.nutriSub}>
                  {formatDailyStr(dailyPercent)} of daily recommended value
                </div>
              ) : (
                <div className={styles.nutriSubPlaceholder} aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
