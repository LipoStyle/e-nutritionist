"use client";

import React from "react";
import "./FinalCta.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };

export default function AboutFinalCta({ lang }: Props) {
  const t = translations[lang];

  return (
    <section className="aboutFinalCta">
      <h2>{t.title}</h2>
      <p>{t.body}</p>
      <a href={`/${lang}/book-consultation`} className="aboutFinalCta__button">
        {t.cta}
      </a>
    </section>
  );
}
