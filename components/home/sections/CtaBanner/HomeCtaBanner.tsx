"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@/styles/home/cta-banner.css";

import { normalizeLang, buildLocaleHref } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

const ui: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  }
> = {
  en: {
    title: "Ready to Transform Your Nutrition?",
    subtitle:
      "Book your free consultation today and take the first step towards optimal health and performance. Let's create a personalized nutrition plan that works for your lifestyle and goals.",
    primary: { label: "Book Free Consultation", href: "/contact" },
    secondary: { label: "Get In Touch", href: "/contact" },
  },
  es: {
    title: "¿Listo para Transformar Tu Nutrición?",
    subtitle:
      "Reserva tu consulta gratuita hoy y da el primer paso hacia una salud y rendimiento óptimos. Creemos un plan de nutrición personalizado para tu estilo de vida y objetivos.",
    primary: { label: "Reservar Consulta Gratuita", href: "/contact" },
    secondary: { label: "Contactar", href: "/contact" },
  },
  el: {
    title: "Έτοιμος/η να Μεταμορφώσεις τη Διατροφή σου;",
    subtitle:
      "Κλείσε τη δωρεάν σου συνεδρία σήμερα και κάνε το πρώτο βήμα προς βέλτιστη υγεία και απόδοση. Ας δημιουργήσουμε ένα εξατομικευμένο πλάνο που ταιριάζει στον τρόπο ζωής και τους στόχους σου.",
    primary: { label: "Κλείσε Δωρεάν Συνάντηση", href: "/contact" },
    secondary: { label: "Επικοινωνία", href: "/contact" },
  },
};

export default function HomeCtaBanner() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang) as Lang;
  const content = ui[lang] ?? ui.en;

  const rootRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // animate once
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    io.observe(el);

    return () => {
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={`home-cta ${inView ? "is-inview" : ""}`}
      aria-labelledby="home-cta-title"
    >
      <div className="home-cta__inner">
        <h2 id="home-cta-title" className="home-cta__title home-cta__reveal-up">
          {content.title}
        </h2>

        <p className="home-cta__subtitle home-cta__reveal-up home-cta__reveal-up--delay">
          {content.subtitle}
        </p>

        <div className="home-cta__actions">
          <Link
            className="cta-button home-cta__btn home-cta__reveal-left"
            href={buildLocaleHref(lang, content.primary.href)}
          >
            {content.primary.label}
          </Link>

          <Link
            className="cta-button cta-button--secondary home-cta__btn home-cta__reveal-right"
            href={buildLocaleHref(lang, content.secondary.href)}
          >
            {content.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
