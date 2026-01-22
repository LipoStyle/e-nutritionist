"use client";

import { useParams } from "next/navigation";
import "@/styles/contact/contactExpectSection.css";

import { contactExpectData } from "@/app/[lang]/(public)/contact/data";

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12l4 4 10-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactExpectSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = contactExpectData[lang];

  return (
    <div className="contact-expect" aria-label={content.title}>
      <h3 className="contact-expect__title">{content.title}</h3>

      <ul className="contact-expect__list">
        {content.items.map((item, idx) => (
          <li key={idx} className="contact-expect__item">
            <span className="contact-expect__icon" aria-hidden="true">
              <CheckIcon />
            </span>

            <div className="contact-expect__text">
              <p className="contact-expect__item-title">{item.title}</p>
              <p className="contact-expect__item-desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
