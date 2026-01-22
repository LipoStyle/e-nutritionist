"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";
import { useParams } from "next/navigation";
import "@/styles/about/aboutPhilosophySection.css";

import { aboutPhilosophyData } from "@/app/[lang]/(public)/about/data";

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
  delayMs = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: ElementType;
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
          observer.disconnect();
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

function Icon({ name }: { name: "check" | "user" | "target" }) {
  if (name === "check") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8.2 12.1 10.6 14.4 15.8 9.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M4.5 20c1.6-3.5 4.2-5 7.5-5s5.9 1.5 7.5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // target
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export default function AboutPhilosophySection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = aboutPhilosophyData[lang];

  return (
    <section
      className="about-philosophy"
      aria-labelledby="about-philosophy-title"
    >
      <div className="about-philosophy__container">
        <header className="about-philosophy__header">
          <Reveal as="h2" className="about-philosophy__title" delayMs={0}>
            <span id="about-philosophy-title">{content.title}</span>
          </Reveal>
        </header>

        <div className="about-philosophy__grid">
          {content.items.map((item, idx) => (
            <Reveal
              key={`${item.icon}-${idx}`}
              as="article"
              className="about-philosophy__item"
              delayMs={90 + idx * 80}
            >
              <div className="about-philosophy__icon" aria-hidden="true">
                <Icon name={item.icon} />
              </div>

              <h3 className="about-philosophy__item-title">{item.title}</h3>
              <p className="about-philosophy__item-desc">{item.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal as="figure" className="about-philosophy__quote" delayMs={120}>
          <blockquote className="about-philosophy__quote-text">
            “{content.quote.text}”
          </blockquote>
          <figcaption className="about-philosophy__quote-author">
            — {content.quote.author}
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
