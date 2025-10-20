"use client";

import React, { useEffect, useRef, CSSProperties } from "react";
import "./AboutSection.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };
type VarStyles = CSSProperties & { ["--i"]?: string | number; ["--base-delay"]?: string | number };

export default function AboutSection({ lang }: Props) {
  const t = translations[lang];
  const ref = useRef<HTMLElement | null>(null);

  // Minimal reveal engine (same pattern as contact)
  useEffect(() => {
  const root = ref.current;
  if (!root) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ✅ include the root itself + any nested reveal items
  const items: HTMLElement[] = [
    root.matches("[data-reveal]") ? root : null,
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
    <section ref={ref} className="aboutSection" aria-label="About intro" data-reveal="up" style={{ ["--base-delay"]: "0ms" } as VarStyles}>
      <div className="aboutSection__inner">
        <h2 className="aboutSection__headline reveal-child" style={i(0)}>
          {t.headline}
        </h2>
        <p className="aboutSection__paragraph reveal-child" style={i(1)}>
          {t.intro1}
        </p>
        <p className="aboutSection__paragraph reveal-child" style={i(2)}>
          {t.intro2}
        </p>
      </div>
    </section>
  );
}
