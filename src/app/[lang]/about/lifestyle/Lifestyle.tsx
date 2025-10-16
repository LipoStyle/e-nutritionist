"use client";

import React from "react";
import "./Lifestyle.css";
import { translations } from "./translations";

type Props = { lang: "en" | "es" | "el" };

export default function AboutLifestyle({ lang }: Props) {
  const t = translations[lang];

  return (
    <section className="aboutLifestyle">
      <h2>{t.title}</h2>
      <p>{t.body}</p>
    </section>
  );
}
