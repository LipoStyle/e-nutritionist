// app/[lang]/(public)/services/components/Grid/ServiceCard.tsx
import styles from "./styles/ServiceCard.module.css";
import type { Lang, ServiceCardModel } from "../../services.queries";

export function ServiceCard({
  lang,
  card,
}: {
  lang: Lang;
  card: ServiceCardModel;
}) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {/* Replace with next/image later if you want */}
        <img
          className={styles.image}
          src={card.image_url ?? "/images/services/placeholder.jpg"}
          alt={card.title}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{card.title}</h3>
        <p className={styles.summary}>{card.summary}</p>

        <div className={styles.meta}>
          <span className={styles.price}>€{card.price}</span>
          {card.duration_minutes ? (
            <span className={styles.duration}>{card.duration_minutes} min</span>
          ) : null}
        </div>

        <a className={styles.cta} href={`/${lang}/services/${card.slug}`}>
          Learn More &amp; Book →
        </a>
      </div>
    </article>
  );
}
