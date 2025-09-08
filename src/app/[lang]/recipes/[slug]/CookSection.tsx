import styles from "./CookSection.module.css";
import { copy } from "./copy";
import type { Ingredient, Instruction, Lang } from "./types";

type Props = { lang: Lang; ingredients: Ingredient[]; instructions: Instruction[]; };

export default function CookSection({ lang, ingredients, instructions }: Props) {
  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <div className={styles.twoColSeamless}>
        {/* LEFT: Ingredients */}
        <div className={styles.slabLeft}>
          <h3 className={styles.slabTitle}>{t.ingredients}</h3>

          <div className={styles.tipBar}>
            <span className={styles.tipBadge}>{t.tip}</span>
            <p className={styles.tipText}>{t.tipIngredients}</p>
          </div>

          {ingredients.length ? (
            <ul className={styles.listRows}>
              {ingredients.map((ing, i) => {
                const id = `ing-${ing.id ?? i}`;
                return (
                  <li key={ing.id ?? `${ing.name}-${i}`} className={styles.row}>
                    <input id={id} type="checkbox" className={styles.rowCheck} />
                    <label htmlFor={id} className={styles.rowText}>
                      {ing.quantity ? (
                        <strong className={styles.rowStrong}>
                          {ing.quantity}
                          {ing.size ? ` ${ing.size}` : ""}{" "}
                        </strong>
                      ) : null}
                      <span className={styles.rowName}>{ing.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.emptyNote}>{t.emptyIngredients}</p>
          )}
        </div>

        {/* RIGHT: Instructions */}
        <div className={styles.slabRight}>
          <h3 className={styles.slabTitle}>{t.instructions}</h3>

          <div className={styles.tipBar}>
            <span className={styles.tipBadge}>{t.tip}</span>
            <p className={styles.tipText}>{t.tipSteps}</p>
          </div>

          {instructions.length ? (
            <ol className={styles.listRows}>
              {instructions.map((st, i) => {
                const id = `st-${st.id ?? st.step_number ?? i}`;
                return (
                  <li key={st.id ?? st.step_number ?? i} className={styles.row}>
                    <input id={id} type="checkbox" className={styles.rowCheck} />
                    <label htmlFor={id} className={styles.rowText}>
                      <strong className={styles.rowStepNo}>
                        Step {st.step_number ?? i + 1} →{" "}
                      </strong>
                      <span className={styles.rowName}>{st.step_content}</span>
                    </label>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className={styles.emptyNote}>{t.emptyInstructions}</p>
          )}
        </div>
      </div>
    </section>
  );
}
