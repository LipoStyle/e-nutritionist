"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import styles from "./RecipeGrid.module.css";
import { recipesData } from "@/app/[lang]/recipes/CircleNav/recipesData";

type LangCode = "en" | "es" | "el";

type Props = {
  language: LangCode;
  category: string;
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function excerpt(text?: string, max = 140) {
  if (!text) return "";
  const clean = text.replace(/\r?\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

export default function RecipeGrid({ language, category }: Props) {
  const recipes = useMemo(
    () =>
      recipesData.filter(
        (r) => r.language === language && r.category === category
      ),
    [language, category]
  );

  return (
    <section className={styles.gridSection} aria-label={`${category} recipes`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{category}</h2>
        <p className={styles.subtitle}>
          {recipes.length} recipe{recipes.length === 1 ? "" : "s"} found
        </p>
      </header>

      {recipes.length === 0 ? (
        <div className={styles.empty}>
          <p>No recipes yet for <strong>{category}</strong>.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {recipes.map((r) => {
            const href = `/${language}/recipes/${toSlug(r.slug ?? r.title)}`;
            const img = (r as any).image_url ?? (r as any).image;

            const duration =
              (r as any).valuable_info?.duration ??
              (r as any).valuable_info?.time ??
              null;
            const difficulty = (r as any).valuable_info?.difficulty ?? null;
            const portions = (r as any).valuable_info?.portions ?? null;

            return (
              <Link key={r.id} href={href} className={styles.card}>
                <div className={styles.media}>
                  {img && (
                    <Image
                      src={img}
                      alt={r.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  )}
                </div>

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <p className={styles.excerpt}>
                    {excerpt((r as any).description)}
                  </p>

                  <div className={styles.metaRow} aria-label="Recipe facts">
                    <span className={styles.meta}>
                      <span className={styles.metaIcon} aria-hidden>⏱</span>
                      {duration ? `${duration} min` : "—"}
                    </span>
                    <span className={styles.meta}>
                      <span className={styles.metaIcon} aria-hidden>🍳</span>
                      {difficulty ?? "—"}
                    </span>
                    <span className={styles.meta}>
                      <span className={styles.metaIcon} aria-hidden>🍽</span>
                      {portions ?? "—"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
