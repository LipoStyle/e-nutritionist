"use client";

import React from "react";
import "./Credentials.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };

export default function AboutCredentials({ lang }: Props) {
  const t = translations[lang];

  return (
    <section className="aboutCredentials">
      <h2 className="aboutCredentials__title">{t.title}</h2>
      <ul className="aboutCredentials__list">
        {t.items.map((c, i) => (
          <li key={i} className="aboutCredentials__item">
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
