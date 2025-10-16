"use client";

import React from "react";
import "./Mission.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };

export default function AboutMission({ lang }: Props) {
  const t = translations[lang];

  return (
    <section className="aboutMission">
      <div className="aboutMission__inner">
        <h2>{t.title}</h2>
        <p>{t.body}</p>
        <a href={`/${lang}/book-consultation`} className="aboutMission__cta">
          {t.cta}
        </a>
      </div>
    </section>
  );
}
