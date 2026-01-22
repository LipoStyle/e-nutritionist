"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";
import { useParams } from "next/navigation";
import "@/styles/about/aboutExpertiseSection.css";

import { aboutExpertiseData } from "@/app/[lang]/(public)/about/data";

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

function Icon({ name }: { name: "bolt" | "target" | "heart" | "calendar" }) {
  // Simple inline SVGs (no installs needed)
  if (name === "bolt") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M13 2 3 14h7l-1 8 12-14h-7l-1-6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "target") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      </svg>
    );
  }
  if (name === "heart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21
           C12 21 4.5 15.6 4.5 10.5
           C4.5 8.2 6.3 6.5 8.6 6.5
           C10.1 6.5 11.4 7.3 12 8.6
           C12.6 7.3 13.9 6.5 15.4 6.5
           C17.7 6.5 19.5 8.2 19.5 10.5
           C19.5 15.6 12 21 12 21 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // calendar
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3M4 8h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M8 12h4M8 16h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AboutExpertiseSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = aboutExpertiseData[lang];

  return (
    <section
      className="about-expertise"
      aria-labelledby="about-expertise-title"
    >
      <div className="about-expertise__container">
        <header className="about-expertise__header">
          <Reveal as="h2" className="about-expertise__title" delayMs={0}>
            <span id="about-expertise-title">{content.title}</span>
          </Reveal>

          <Reveal as="p" className="about-expertise__subtitle" delayMs={80}>
            {content.subtitle}
          </Reveal>
        </header>

        <div className="about-expertise__grid">
          {content.items.map((item, idx) => (
            <Reveal
              key={`${item.icon}-${idx}`}
              as="article"
              className="about-expertise__card"
              delayMs={120 + idx * 70}
            >
              <div className="about-expertise__icon" aria-hidden="true">
                <Icon name={item.icon} />
              </div>

              <div className="about-expertise__text">
                <h3 className="about-expertise__card-title">{item.title}</h3>
                <p className="about-expertise__card-desc">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
