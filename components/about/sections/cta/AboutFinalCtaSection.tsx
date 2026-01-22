"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "@/styles/about/aboutFinalCtaSection.css";

import { aboutFinalCtaData } from "@/app/[lang]/(public)/about/data";

type Lang = "en" | "es" | "el";
const SUPPORTED: Lang[] = ["en", "es", "el"];

function normalizeLang(value: unknown): Lang {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v !== "string") return "en";

  const mapped = v === "eng" ? "en" : v;

  return (SUPPORTED as readonly string[]).includes(mapped)
    ? (mapped as Lang)
    : "en";
}

function buildLocaleHref(lang: Lang, href: string) {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith(`/${lang}/`)) return href;
  if (!href.startsWith("/")) return `/${lang}/${href}`;
  return `/${lang}${href}`;
}

export default function AboutFinalCtaSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = aboutFinalCtaData[lang];

  return (
    <section
      className="about-final-cta"
      aria-labelledby="about-final-cta-title"
    >
      <div className="about-final-cta__container">
        <div className="about-final-cta__content">
          <h2 id="about-final-cta-title" className="about-final-cta__title">
            {content.title}
          </h2>

          <p className="about-final-cta__description">{content.description}</p>

          <div className="about-final-cta__actions">
            <Link
              className="cta-button about-final-cta__primary"
              href={buildLocaleHref(lang, content.cta.primary.href)}
            >
              {content.cta.primary.label}
            </Link>

            <Link
              className="cta-button cta-button--secondary about-final-cta__secondary"
              href={buildLocaleHref(lang, content.cta.secondary.href)}
            >
              {content.cta.secondary.label}
            </Link>
          </div>

          {content.note && (
            <p className="about-final-cta__note">{content.note}</p>
          )}
        </div>
      </div>
    </section>
  );
}
