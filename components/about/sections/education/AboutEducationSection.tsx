"use client";

import { useParams } from "next/navigation";
import "@/styles/about/aboutEducationSection.css";

import { aboutEducationData } from "@/app/[lang]/(public)/about/data";

type Lang = "en" | "es" | "el";
const SUPPORTED: Lang[] = ["en", "es", "el"];

function normalizeLang(value: unknown): Lang {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v !== "string") return "en";

  // Optional legacy mapping; remove later if not needed
  const mapped = v === "eng" ? "en" : v;

  return (SUPPORTED as readonly string[]).includes(mapped)
    ? (mapped as Lang)
    : "en";
}

function CapIcon() {
  // Clean graduation cap icon (no external library)
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 2.5 8l9.5 5 9.5-5L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.6V16c0 1.2 2.6 3 5.5 3s5.5-1.8 5.5-3v-5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 9.2V14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AboutEducationSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = aboutEducationData[lang];

  return (
    <section
      className="about-education"
      aria-labelledby="about-education-title"
    >
      <div className="about-education__container">
        <header className="about-education__header">
          <h2 id="about-education-title" className="about-education__title">
            {content.title}
          </h2>
          <p className="about-education__subtitle">{content.subtitle}</p>
        </header>

        <div className="about-education__grid">
          {content.items.map((item, idx) => (
            <article key={idx} className="about-education__card">
              <div className="about-education__icon" aria-hidden="true">
                <CapIcon />
              </div>

              <div className="about-education__content">
                <div className="about-education__top">
                  <h3 className="about-education__card-title">{item.title}</h3>

                  {item.year && (
                    <span className="about-education__year">{item.year}</span>
                  )}
                </div>

                <p className="about-education__institution">
                  {item.institution}
                </p>

                <p className="about-education__description">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
