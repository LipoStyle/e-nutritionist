"use client";

import React from "react";
import "./AboutSection.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };

export default function AboutSection({ lang }: Props) {
  const t = translations[lang];

  return (
    <section className="aboutSection">
      <div className="aboutSection__inner">
        <h2 className="aboutSection__headline">{t.headline}</h2>
        <p className="aboutSection__paragraph">{t.intro1}</p>
        <p className="aboutSection__paragraph">{t.intro2}</p>
      </div>
    </section>
  );
}
