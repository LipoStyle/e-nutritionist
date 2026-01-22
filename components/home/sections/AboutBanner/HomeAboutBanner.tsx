// components/home/sections/AboutBanner/HomeAboutBanner.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";

import "@/styles/home/about-banner.css";
import { normalizeLang } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

const aboutBannerData: Record<
  Lang,
  {
    titleA: string;
    titleAccent: string;
    paragraph: string;
    stats: { value: string; label: string }[];
    bullets: string[];
    cta: { label: string; href: string };
    imageAlt: string;
  }
> = {
  en: {
    titleA: "Meet Your Certified",
    titleAccent: "Sports Nutritionist",
    paragraph:
      "With over 10 years of experience in sports nutrition and athletic performance, I specialize in helping athletes and active individuals optimize their nutrition for peak performance and long-term health.",
    stats: [
      { value: "500+", label: "Athletes Coached" },
      { value: "10+", label: "Years Experience" },
    ],
    bullets: [
      "Certified Sports Nutritionist (CISSN)",
      "Registered Dietitian Nutritionist (RDN)",
      "Master's in Sports Nutrition",
    ],
    cta: { label: "Learn More About Me", href: "/about" },
    imageAlt: "Sports nutritionist portrait in office",
  },
  es: {
    titleA: "Conoce a Tu",
    titleAccent: "Nutricionista Deportivo Certificado",
    paragraph:
      "Con más de 10 años de experiencia en nutrición deportiva y rendimiento, ayudo a atletas y personas activas a optimizar su alimentación para un rendimiento máximo y una salud duradera.",
    stats: [
      { value: "500+", label: "Atletas Acompañados" },
      { value: "10+", label: "Años de Experiencia" },
    ],
    bullets: [
      "Nutricionista Deportivo Certificado (CISSN)",
      "Dietista-Nutricionista Registrado (RDN)",
      "Máster en Nutrición Deportiva",
    ],
    cta: { label: "Conoce Más Sobre Mí", href: "/about" },
    imageAlt: "Retrato de nutricionista deportiva en oficina",
  },
  el: {
    titleA: "Γνώρισε τον/την Πιστοποιημένο/η",
    titleAccent: "Sports Nutritionist",
    paragraph:
      "Με πάνω από 10 χρόνια εμπειρίας στην αθλητική διατροφή και την απόδοση, βοηθάω αθλητές και δραστήρια άτομα να βελτιστοποιήσουν τη διατροφή τους για κορυφαία απόδοση και μακροχρόνια υγεία.",
    stats: [
      { value: "500+", label: "Αθλητές που Υποστηρίχθηκαν" },
      { value: "10+", label: "Χρόνια Εμπειρίας" },
    ],
    bullets: [
      "Certified Sports Nutritionist (CISSN)",
      "Registered Dietitian Nutritionist (RDN)",
      "Master’s in Sports Nutrition",
    ],
    cta: { label: "Μάθε Περισσότερα", href: "/about" },
    imageAlt: "Πορτρέτο αθλητικού διατροφολόγου σε γραφείο",
  },
};

export default function HomeAboutBanner() {
  const params = useParams<{ lang?: string }>();
  const lang = (normalizeLang(params?.lang) as Lang) ?? "en";
  const content = useMemo(
    () => aboutBannerData[lang] ?? aboutBannerData.en,
    [lang],
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

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
      className={`home-about ${visible ? "is-visible" : ""}`}
      aria-labelledby="home-about-title"
    >
      <div className="home-about__container">
        <div className="home-about__grid">
          <div className="home-about__content">
            <h2 id="home-about-title" className="home-about__title">
              <span className="home-about__title-main">{content.titleA} </span>
              <span className="home-about__title-accent">
                {content.titleAccent}
              </span>
            </h2>

            <p className="home-about__paragraph">{content.paragraph}</p>

            <div className="home-about__stats" aria-label="Key stats">
              {content.stats.map((s) => (
                <div key={s.label} className="home-about__stat">
                  <div className="home-about__stat-value">{s.value}</div>
                  <div className="home-about__stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <ul className="home-about__bullets" aria-label="Credentials">
              {content.bullets.map((b) => (
                <li key={b} className="home-about__bullet">
                  <span className="home-about__check" aria-hidden="true">
                    ✓
                  </span>
                  <span className="home-about__bullet-text">{b}</span>
                </li>
              ))}
            </ul>

            <div className="home-about__actions">
              <Link
                className="home-about__cta"
                href={`/${lang}${content.cta.href}`}
              >
                <span>{content.cta.label}</span>
                <span className="home-about__cta-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="home-about__media" aria-hidden="true">
            <div className="home-about__image-wrap">
              <Image
                src="/assets/about/profile-image.png"
                alt={content.imageAlt}
                fill
                className="home-about__image"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
