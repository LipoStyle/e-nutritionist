// components/services/sections/Methods/ConsultationMethods.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import "@/styles/services/consultation-methods.css";

import { normalizeLang } from "@/lib/i18n/locale";
import { consultationMethodsData } from "@/app/[lang]/(public)/services/data";

export default function ConsultationMethods() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = consultationMethodsData[lang];

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
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`consultation-methods ${visible ? "is-visible" : ""}`}
      aria-labelledby="consultation-methods-title"
    >
      <div className="consultation-methods__inner">
        <div className="consultation-methods__card">
          <div className="consultation-methods__left">
            <h2
              id="consultation-methods-title"
              className="consultation-methods__title"
            >
              {content.title}
            </h2>

            <ul className="consultation-methods__list">
              {content.methods.map((m, i) => (
                <li
                  key={`${m.title}-${i}`}
                  className="consultation-methods__item"
                  style={{ ["--stagger" as any]: `${i * 90}ms` }}
                >
                  <span
                    className="consultation-methods__check"
                    aria-hidden="true"
                  >
                    ✓
                  </span>

                  <div className="consultation-methods__text">
                    <div className="consultation-methods__item-title">
                      {m.title}
                    </div>
                    <div className="consultation-methods__item-desc">
                      {m.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="consultation-methods__right" aria-hidden="true">
            <img
              className="consultation-methods__image"
              src="/images/services/consultation.jpg"
              alt={content.imageAlt}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
