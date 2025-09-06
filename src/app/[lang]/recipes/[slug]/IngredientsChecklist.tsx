// src/app/[lang]/recipes/[slug]/IngredientsChecklist.tsx
"use client";

import { useState } from "react";
import styles from "./RecipeDetail.module.css";

type Ingredient = { id: number | string; name: string; quantity?: number | string; size?: string };

export default function IngredientsChecklist({ items }: { items: Ingredient[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <ul className={styles.ingList}>
      {items.map((ing) => {
        const key = String(ing.id ?? ing.name);
        const on = !!checked[key];
        const showQty = ing.quantity || ing.size;

        return (
          <li key={key} className={`${styles.ingRow} ${on ? styles.ingRowOn : ""}`}>
            <label className={styles.ingLabel}>
              <input
                type="checkbox"
                className={styles.ingCheck}
                checked={on}
                onChange={() => setChecked((s) => ({ ...s, [key]: !s[key] }))}
                aria-label={`Mark ${ing.name} as prepared`}
              />
              {showQty ? (
                <span className={styles.ingQty}>
                  {ing.quantity ?? ""} {ing.size ?? ""}
                </span>
              ) : null}
              <span className={styles.ingName}>{ing.name}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
