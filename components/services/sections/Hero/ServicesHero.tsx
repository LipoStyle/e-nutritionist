// components/services/sections/Hero/ServicesHero.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "@/styles/services/hero.css";

import { servicesHeroData } from "@/app/[lang]/(public)/services/data";
import { buildLocaleHref, normalizeLang } from "@/lib/i18n/locale";

export default function ServicesHero() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = servicesHeroData[lang];

  return (
    <section className="services-hero" aria-labelledby="services-hero-title">
      <div className="services-hero__container">
        <div className="services-hero__content">
          <h1 id="services-hero-title" className="services-hero__title">
            {content.title}
          </h1>

          <p className="services-hero__description">{content.description}</p>

          <div className="services-hero__actions">
            <Link
              className="services-hero__cta cta-button"
              href={buildLocaleHref(lang, content.cta.href)}
            >
              {content.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
