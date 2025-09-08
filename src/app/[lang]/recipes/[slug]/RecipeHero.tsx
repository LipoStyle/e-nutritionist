import Image from "next/image";
import styles from "./RecipeHero.module.css";
import { servingLabel } from "./helpers";
import type { Lang } from "./types";

type Props = {
  lang: Lang;
  title: string;
  img: string;
  duration: string;
  difficulty: string;
  portions: string;
};

export default function RecipeHero({
  lang,
  title,
  img,
  duration,
  difficulty,
  portions,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImageWrap}>
        <Image
          src={img}
          alt={title}
          fill
          priority
          className={styles.heroImage}
          sizes="100vw"
        />
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{title}</h1>
        {(duration || difficulty || portions) && (
          <ul className={styles.heroMeta}>
            {duration ? (
              <li className={styles.metaPill}>
                <span className={styles.metaDot} aria-hidden />
                {duration}
              </li>
            ) : null}
            {difficulty ? (
              <li className={styles.metaPill}>
                <span className={styles.metaDot} aria-hidden />
                {difficulty}
              </li>
            ) : null}
            {portions ? (
              <li className={styles.metaPill}>
                <span className={styles.metaDot} aria-hidden />
                {portions} {servingLabel(portions, lang)}
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </section>
  );
}
