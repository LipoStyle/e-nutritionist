"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import "@/styles/about/aboutStorySection.css";

import { aboutStoryData } from "@/app/[lang]/(public)/about/data";

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

function Reveal({
  children,
  className = "",
  delayMs = 1.8,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate once
        }
      },
      { threshold: 0.2, root: null, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? "reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}

export default function AboutStorySection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = aboutStoryData[lang];

  return (
    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-story__container">
        <header className="about-story__header">
          <Reveal as="h2" className="about-story__title" delayMs={0}>
            <span id="about-story-title">{content.title}</span>
          </Reveal>

          {content.subtitle && (
            <Reveal as="p" className="about-story__subtitle" delayMs={80}>
              {content.subtitle}
            </Reveal>
          )}
        </header>

        <div className="about-story__content">
          {content.paragraphs.map((p, idx) => (
            <Reveal
              key={idx}
              as="p"
              className="about-story__paragraph"
              delayMs={idx * 60}
            >
              {p}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
