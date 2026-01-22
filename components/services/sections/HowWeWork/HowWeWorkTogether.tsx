// components/services/sections/HowWeWork/HowWeWorkTogether.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import "@/styles/services/how-we-work.css";

import { normalizeLang } from "@/lib/i18n/locale";
import { howWeWorkData } from "@/app/[lang]/(public)/services/data";

export default function HowWeWorkTogether() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = howWeWorkData[lang];

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
          io.disconnect(); // animate once
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
      className={`how-we-work ${visible ? "is-visible" : ""}`}
      aria-labelledby="how-we-work-title"
    >
      <div className="how-we-work__inner">
        <header className="how-we-work__header">
          <h2 id="how-we-work-title" className="how-we-work__title">
            {content.title}
          </h2>
          <p className="how-we-work__subtitle">{content.subtitle}</p>
        </header>

        <div className="how-we-work__steps" role="list">
          {content.steps.map((s, i) => (
            <div
              key={s.n}
              className="how-we-work__step"
              role="listitem"
              style={{ ["--stagger" as any]: `${i * 90}ms` }}
            >
              <div className="how-we-work__badge" aria-hidden="true">
                {s.n}
              </div>
              <h3 className="how-we-work__step-title">{s.title}</h3>
              <p className="how-we-work__step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
