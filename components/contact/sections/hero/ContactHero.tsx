"use client";

import { useParams } from "next/navigation";
import "@/styles/contact/contactHero.css";

import { contactHeroData } from "@/app/[lang]/(public)/contact/data";

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

export default function ContactHero() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = contactHeroData[lang];

  return (
    <section className="contact-hero" aria-labelledby="contact-hero-title">
      <div className="contact-hero__container">
        <h1 id="contact-hero-title" className="contact-hero__title">
          {content.title}
        </h1>

        <p className="contact-hero__description">{content.description}</p>
      </div>
    </section>
  );
}
