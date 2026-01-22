import styles from "./styles/ServicesGrid.module.css";
import { ServiceCard } from "./ServiceCard";
import type { Lang, ServiceCardModel } from "../../services.queries";

export function ServicesGrid({
  lang,
  cards,
}: {
  lang: Lang;
  cards: ServiceCardModel[];
}) {
  return (
    <section className={styles.wrap}>
      <div className={styles.grid}>
        {cards.map((c) => (
          <ServiceCard key={c.id} lang={lang} card={c} />
        ))}
      </div>
    </section>
  );
}
