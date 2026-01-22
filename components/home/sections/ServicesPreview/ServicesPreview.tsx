// components/home/sections/ServicesPreview/HomeServicesPreview.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

import "@/styles/home/services-preview.css";

import type { ServiceCardModel } from "@/app/[lang]/(public)/services/services.queries";
import { normalizeLang } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

const uiByLang: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    viewAll: string;
    cardCta: string;
    durationLabel: (m: number) => string;
  }
> = {
  en: {
    title: "Our Professional Services",
    subtitle:
      "Comprehensive nutrition consulting tailored to your unique needs and goals",
    viewAll: "View All Services",
    cardCta: "Learn More",
    durationLabel: (m) => `${m} min`,
  },
  es: {
    title: "Nuestros Servicios Profesionales",
    subtitle:
      "Asesoría nutricional integral adaptada a tus necesidades y objetivos",
    viewAll: "Ver Todos los Servicios",
    cardCta: "Ver Más",
    durationLabel: (m) => `${m} min`,
  },
  el: {
    title: "Οι Επαγγελματικές Υπηρεσίες μας",
    subtitle:
      "Ολοκληρωμένες διατροφικές υπηρεσίες προσαρμοσμένες στους στόχους σου",
    viewAll: "Δείτε Όλες τις Υπηρεσίες",
    cardCta: "Περισσότερα",
    durationLabel: (m) => `${m} λεπτά`,
  },
};

function formatPriceEUR(value: number) {
  const rounded = Math.round(value);
  return `€${rounded}`;
}

export default function HomeServicesPreview({
  cards,
}: {
  cards: ServiceCardModel[];
}) {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang) as Lang;

  const ui = uiByLang[lang] ?? uiByLang.en;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const previewCards = useMemo(() => (cards ?? []).slice(0, 3), [cards]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-services-preview ${visible ? "is-visible" : ""}`}
      aria-labelledby="home-services-preview-title"
    >
      <div className="home-services-preview__container">
        <header className="home-services-preview__header">
          <h2
            id="home-services-preview-title"
            className="home-services-preview__title"
          >
            {ui.title}
          </h2>
          <p className="home-services-preview__subtitle">{ui.subtitle}</p>
        </header>

        <div className="home-services-preview__grid" role="list">
          {previewCards.map((card, i) => {
            const img = card.image_url ?? "/images/services/placeholder.jpg";
            const href = `/${lang}/services/${card.slug}`;

            return (
              <article
                key={card.id}
                className="home-service-mini"
                role="listitem"
                aria-label={card.title}
                style={{ ["--stagger" as any]: `${i * 90}ms` }}
              >
                <div className="home-service-mini__media">
                  <img
                    className="home-service-mini__img"
                    src={img}
                    alt={card.title}
                    loading="lazy"
                  />

                  <div className="home-service-mini__price" aria-label="Price">
                    {formatPriceEUR(card.price)}
                  </div>
                </div>

                <div className="home-service-mini__body">
                  <h3 className="home-service-mini__title">{card.title}</h3>

                  <div className="home-service-mini__bottom">
                    <div className="home-service-mini__duration">
                      {card.duration_minutes
                        ? ui.durationLabel(card.duration_minutes)
                        : "\u00A0"}
                    </div>

                    <Link className="home-service-mini__cta" href={href}>
                      <span>{ui.cardCta}</span>
                      <span
                        className="home-service-mini__arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="home-services-preview__actions">
          <Link
            className="home-services-preview__primary"
            href={`/${lang}/services`}
          >
            <span>{ui.viewAll}</span>
            <span className="home-services-preview__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
