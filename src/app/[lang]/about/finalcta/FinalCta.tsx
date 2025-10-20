"use client";

import React, { useEffect, useRef, CSSProperties } from "react";
import "./FinalCta.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };
type VarStyles = CSSProperties & { ["--i"]?: string | number; ["--base-delay"]?: string | number };

export default function AboutFinalCta({ lang }: Props) {
  const t = translations[lang];
  const ref = useRef<HTMLElement | null>(null);

  // Reveal-on-view (same engine as other sections)
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items: HTMLElement[] = [
      root.matches("[data-reveal]") ? (root as HTMLElement) : null,
      ...Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]")),
    ].filter(Boolean) as HTMLElement[];

    if (reduce) {
      items.forEach((el) => el.classList.add("is-visible"));
      root.querySelectorAll<HTMLElement>(".reveal-child").forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-visible");
          el.querySelectorAll<HTMLElement>(".reveal-child").forEach((k, i) => {
            if (!k.style.getPropertyValue("--i")) k.style.setProperty("--i", String(i));
            void k.offsetHeight;
            k.classList.add("child-visible");
          });
          io.unobserve(el);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const i = (n: number): VarStyles => ({ ["--i"]: n });

  return (
    <section
      ref={ref}
      className="aboutFinalCta"
      aria-label={t.title}
      data-reveal="up"
      style={{ ["--base-delay"]: "0ms" } as VarStyles}
    >
      <div className="aboutFinalCta__inner">
        <h2 className="reveal-child" style={i(0)}>{t.title}</h2>
        <p className="reveal-child" style={i(1)}>{t.body}</p>

        <a
          href={`/${lang}/book-consultation`}
          className="aboutFinalCta__button reveal-child"
          style={i(2)}
          aria-label={t.cta}
        >
          {t.cta}
        </a>
      </div>
    </section>
  );
}
