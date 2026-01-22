// components/services/sections/Greeting/ServicesGreeting.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/services/greeting.css";

import { servicesGreetingData } from "@/app/[lang]/(public)/services/data";
import { normalizeLang } from "@/lib/i18n/locale";

export default function ServicesGreeting() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);
  const content = servicesGreetingData[lang];

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
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`services-greeting ${visible ? "is-visible" : ""}`}
      aria-labelledby="services-greeting-title"
    >
      <div className="services-greeting__inner">
        <h2 id="services-greeting-title" className="services-greeting__title">
          {content.title}
        </h2>

        <p className="services-greeting__subtitle">{content.subtitle}</p>
      </div>
    </section>
  );
}
