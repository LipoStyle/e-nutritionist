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

export default function RecipeGrid({ language, category }: Props) {
  const recipes = useMemo(
    () =>
      recipesData.filter(
        (r) => r.language === language && r.category === category
      ),
    [language, category]
  );

  if (recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <p>
          No recipes found for <strong>{category}</strong>.
        </p>
      </div>
    );
  }

  return (
    <section className={styles.gridSection} aria-label={`${category} recipes`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{category}</h2>
        <p className={styles.subtitle}>
          {recipes.length} recipe{recipes.length > 1 ? "s" : ""} found
        </p>
      </header>

      <div className={styles.grid}>
        {recipes.map((r) => {
          const href = `/${language}/recipes/${toSlug(r.slug)}`;

          return (
            <article key={r.id} className={styles.card}>
              <div className={styles.media}>
                <Image
                  src={(r as any).image_url ?? (r as any).image}
                  alt={r.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className={styles.body}>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                {/* If you have an excerpt/short description in your data, show it here */}
                {/* <p className={styles.excerpt}>{r.excerpt}</p> */}
                <div className={styles.metaRow}>
                  <span className={styles.badge}>{r.category}</span>
                  <span className={styles.badge}>{language.toUpperCase()}</span>
                </div>
              </div>

              <div className={styles.footer}>
                <Link className={styles.button} href={href}>
                  View recipe
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
