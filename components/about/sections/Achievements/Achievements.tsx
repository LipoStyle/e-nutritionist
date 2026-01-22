"use client";

import "@/styles/about/achievements.css";
import { useParams } from "next/navigation";
import { aboutAchievementsData } from "@/app/[lang]/(public)/about/data";

import { Users, CalendarDays, Target, BookOpen } from "lucide-react";

type Lang = "en" | "es" | "el";
const SUPPORTED: Lang[] = ["en", "es", "el"];

function normalizeLang(v: unknown): Lang {
  const val = Array.isArray(v) ? v[0] : v;
  if (typeof val !== "string") return "en";
  return (SUPPORTED as readonly string[]).includes(val) ? (val as Lang) : "en";
}

const ICONS = {
  users: Users,
  calendar: CalendarDays,
  target: Target,
  bookOpen: BookOpen,
} as const;

export default function Achievements() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);
  const content = aboutAchievementsData[lang];

  return (
    <section
      className="about-achievements"
      aria-labelledby="about-achievements-title"
    >
      <div className="about-achievements__container">
        <header className="about-achievements__header">
          <h2
            id="about-achievements-title"
            className="about-achievements__title"
          >
            {content.title}
          </h2>
          <p className="about-achievements__subtitle">{content.subtitle}</p>
        </header>

        <div className="about-achievements__stats" role="list">
          {content.items.map((item, idx) => {
            const Icon = ICONS[item.icon];
            return (
              <article
                className="about-achievements__stat"
                role="listitem"
                key={`${item.label}-${idx}`}
              >
                <div className="about-achievements__icon" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <div className="about-achievements__value">{item.value}</div>
                <div className="about-achievements__label">{item.label}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
