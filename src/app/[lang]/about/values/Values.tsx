"use client";

import React from "react";
import "./Values.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };

export default function AboutValues({ lang }: Props) {
  const t = translations[lang];

  return (
    <section className="aboutValues">
      <h2 className="aboutValues__title">{t.title}</h2>
      <div className="aboutValues__grid">
        {t.values.map((val, i) => (
          <div key={i} className="aboutValues__card">
            <h3>{val.title}</h3>
            <p>{val.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
