"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./RecipeGrid.module.css";

type LangCode = "en" | "es" | "el";

type Props = {
  language: LangCode;
  category: string;
};

type ApiRecipe = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  published_date: string | null;
  valuable_info: {
    duration: string | null;
    difficulty: string | null;
    portions: number | null;
  } | null;
};

function excerpt(text?: string, max = 140) {
  if (!text) return "";
  const clean = text.replace(/\r?\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

export default function RecipeGrid({ language, category }: Props) {
  const [items, setItems] = useState<ApiRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const params = new URLSearchParams({
          language,
          category,
          page: "1",
          perPage: "24",
        });
        const res = await fetch(`/api/public/recipes?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load recipes (${res.status})`);
        const json = (await res.json()) as { items: ApiRecipe[] };
        if (!cancel) setItems(json.items);
      } catch (e) {
        if (!cancel) setErr(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    load();
    return () => { cancel = true; };
  }, [language, category]);

  const headerSubtitle = useMemo(() => {
    if (loading) return "Loading…";
    if (err) return "Could not load recipes";
    return `${items.length} recipe${items.length === 1 ? "" : "s"} found`;
  }, [items.length, loading, err]);

  return (
    <section className={styles.gridSection} aria-label={`${category} recipes`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{category}</h2>
        <p className={styles.subtitle}>{headerSubtitle}</p>
      </header>

      {err ? (
        <div className={styles.empty}><p>{err}</p></div>
      ) : loading ? (
        <div className={styles.grid}>
          {/* simple skeletons */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p>No recipes yet for <strong>{category}</strong>.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((r) => {
            const href = `/${language}/recipes/${r.slug}`;
            const img =  "/assets/recipes/categories/breakfast.jpg";
            const duration = r.valuable_info?.duration ?? null;
            const difficulty = r.valuable_info?.difficulty ?? null;
            const portions = r.valuable_info?.portions ?? null;

            return (
              <Link key={r.id} href={href} className={styles.card}>
                <div className={styles.media}>
                  {img && (
                    <Image
                      src={img}
                      alt={r.title}
                      fill unoptimized
                      priority={false}
                    />
                  )}
                </div>

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <p className={styles.excerpt}>{excerpt(r.description ?? undefined)}</p>

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
                      {typeof portions === "number" ? portions : "—"}
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
