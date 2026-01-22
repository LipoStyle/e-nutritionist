"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import "@/styles/contact/contactInfoSection.css";

import { contactInfoData } from "@/app/[lang]/(public)/contact/data";

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

function buildLocaleHref(lang: Lang, href: string) {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith(`/${lang}/`)) return href;
  if (!href.startsWith("/")) return `/${lang}/${href}`;
  return `/${lang}${href}`;
}

function Icon({ name }: { name: string }) {
  // Inline SVGs to avoid dependencies (consistent with your approach)
  switch (name) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 3h3l1 5-2 1c1.2 2.6 3.4 4.8 6 6l1.1-2 5 1v3c0 1.1-.9 2-2 2C10.8 19 5 13.2 5 6c0-1.1.9-2 2-2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 6h16v12H4V6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="m4 7 8 6 8-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "office":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s6-4.6 6-10a6 6 0 1 0-12 0c0 5.4 6 10 6 10Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    case "hours":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 6v6l4 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 3v3M17 3v3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 7h16v14H4V7Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export default function ContactInfoSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = contactInfoData[lang];

  return (
    <div className="contact-info">
      <div className="contact-info__card" aria-label={content.infoTitle}>
        <h3 className="contact-info__title">{content.infoTitle}</h3>

        <div className="contact-info__list">
          {content.items.map((item, idx) => (
            <div className="contact-info__item" key={idx}>
              <div className="contact-info__icon" aria-hidden="true">
                <Icon name={item.icon} />
              </div>

              <div className="contact-info__text">
                <p className="contact-info__label">{item.label}</p>
                <p className="contact-info__value">{item.value}</p>
                <p className="contact-info__helper">{item.helper}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contact-book" aria-label={content.book.title}>
        <div className="contact-book__icon" aria-hidden="true">
          <Icon name="calendar" />
        </div>

        <h3 className="contact-book__title">{content.book.title}</h3>
        <p className="contact-book__description">{content.book.description}</p>

        <Link
          className="cta-button contact-book__button"
          href={buildLocaleHref(lang, content.book.buttonHref)}
        >
          {content.book.buttonLabel}
        </Link>
      </div>
    </div>
  );
}
