// components/about/sections/Hero/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import "@/styles/about/hero.css";

import { aboutHeroData } from "@/app/[lang]/(public)/about/data";
import { normalizeLang, buildLocaleHref } from "@/lib/i18n/locale";

export default function Hero() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = aboutHeroData[lang];

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero__container">
        <div className="about-hero__grid">
          <div className="about-hero__content">
            <p className="about-hero__eyebrow">{content.eyebrow}</p>

            <h1 id="about-hero-title" className="about-hero__title">
              {content.headline.main && (
                <span className="about-hero__title-main">
                  {content.headline.main}{" "}
                </span>
              )}
              <span className="about-hero__title-accent">
                {content.headline.accent}
              </span>
            </h1>

            <p className="about-hero__description">{content.description}</p>

            <div className="about-hero__actions">
              <Link
                className="cta-button"
                href={buildLocaleHref(lang, content.cta.primary.href)}
              >
                {content.cta.primary.label}
              </Link>

              <Link
                className="cta-button cta-button--secondary"
                href={buildLocaleHref(lang, content.cta.secondary.href)}
              >
                {content.cta.secondary.label}
              </Link>
            </div>
          </div>

          <div className="about-hero__media">
            <div className="about-hero__image-wrap">
              <Image
                src="/assets/about/profile-image.png"
                alt="Sports nutritionist portrait"
                fill
                priority
                className="about-hero__image"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
