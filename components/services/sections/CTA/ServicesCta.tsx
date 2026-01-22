// components/services/sections/CTA/ServicesCta.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import "@/styles/services/services-cta.css";

import { normalizeLang, buildLocaleHref } from "@/lib/i18n/locale";
import { servicesCtaData } from "@/app/[lang]/(public)/services/data";

export default function ServicesCta() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = servicesCtaData[lang];

  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
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
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`services-cta ${visible ? "is-visible" : ""}`}
      aria-labelledby="services-cta-title"
    >
      <div className="services-cta__container">
        <h2 id="services-cta-title" className="services-cta__title">
          {content.title}
        </h2>

        <p className="services-cta__subtitle">{content.subtitle}</p>

        <div className="services-cta__actions">
          <Link
            className="cta-button services-cta__primary"
            href={buildLocaleHref(lang, content.primary.href)}
          >
            {content.primary.label}
          </Link>

          <Link
            className="cta-button cta-button--secondary services-cta__secondary"
            href={buildLocaleHref(lang, content.secondary.href)}
          >
            {content.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
