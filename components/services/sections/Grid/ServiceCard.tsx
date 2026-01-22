// components/services/sections/Grid/ServiceCard.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import "@/styles/services/card.css";

import type { ServiceCardModel } from "@/app/[lang]/(public)/services/services.queries";
import { normalizeLang } from "@/lib/i18n/locale";
import { servicesGridUiData } from "@/app/[lang]/(public)/services/data";

function formatPriceEUR(value: number) {
  const rounded = Math.round(value);
  return `€${rounded}`;
}

export default function ServiceCard({ card }: { card: ServiceCardModel }) {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const ui = servicesGridUiData[lang];

  const href = `/${lang}/services/${card.slug}`;
  const imageSrc = card.image_url ?? "/images/services/placeholder.jpg";

  return (
    <article className="service-card" aria-label={card.title}>
      <div className="service-card__media">
        {/* Can be swapped to next/image later */}
        <img className="service-card__img" src={imageSrc} alt={card.title} />

        <div className="service-card__price-pill" aria-label="Price">
          {formatPriceEUR(card.price)}
        </div>
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{card.title}</h3>

        <p className="service-card__summary">{card.summary}</p>

        <div className="service-card__meta">
          {card.duration_minutes ? (
            <span className="service-card__duration">
              {ui.durationLabel(card.duration_minutes)}
            </span>
          ) : (
            <span className="service-card__duration service-card__duration--empty">
              &nbsp;
            </span>
          )}

          <div className="service-card__price-inline">
            {formatPriceEUR(card.price)}
          </div>
        </div>

        <Link className="cta-button service-card__cta" href={href}>
          {ui.cardCtaLabel}
        </Link>
      </div>
    </article>
  );
}
