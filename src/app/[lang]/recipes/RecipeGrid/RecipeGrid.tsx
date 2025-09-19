"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
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
  shortDescription: string | null;
  description: string | null;
  category: string;
  imageUrl: string | null;
  publishedDate: string | null;
  valuable_info: {
    duration?: string | number | null;
    difficulty?: string | null;
    portions?: number | null;
    persons?: number | null;
  } | null;
};

const STRINGS: Record<LangCode, {
  loading: string;
  error: string;
  none: string;
  found: (n: number) => string;
  minutes: string;
  factsLabel: string;
}> = {
  en: {
    loading: "Loading…",
    error: "Could not load recipes",
    none: "No recipes yet for",
    found: (n) => `${n} recipe${n === 1 ? "" : "s"} found`,
    minutes: "min",
    factsLabel: "Recipe facts",
  },
  es: {
    loading: "Cargando…",
    error: "No se pudieron cargar las recetas",
    none: "No hay recetas todavía para",
    found: (n) => `${n} receta${n === 1 ? "" : "s"} encontrada${n === 1 ? "" : "s"}`,
    minutes: "min",
    factsLabel: "Datos de la receta",
  },
  el: {
    loading: "Φόρτωση…",
    error: "Δεν ήταν δυνατή η φόρτωση συνταγών",
    none: "Δεν υπάρχουν συνταγές ακόμη για",
    found: (n) => `${n} συνταγ${n === 1 ? "ή" : "ές"} βρέθηκαν`,
    minutes: "λεπ",
    factsLabel: "Στοιχεία συνταγής",
  },
};

function toSlug(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function excerpt(text?: string | null, max = 140) {
  if (!text) return "";
  const clean = text.replace(/\r?\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

// ✅ Accept a broad union so TS doesn't complain about null
function normalizeMinutes(v: string | number | null | undefined): string | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseInt(String(v).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? String(n) : null;
}

/** Image that fails over to a default asset if the source 404s */
function SafeImage({
  src,
  alt,
  fallback = "/assets/recipes/cards/default.jpg",
  ...rest
}: {
  src?: string | null;
  alt: string;
  fallback?: string;
} & Omit<ComponentProps<typeof Image>, "src" | "alt">) {
  const [current, setCurrent] = useState<string>(src || fallback);
  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);
  return (
    <Image
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      {...rest}
    />
  );
}

export default function RecipeGrid({ language, category }: Props) {
  const t = STRINGS[language];
  const [items, setItems] = useState<ApiRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const params = new URLSearchParams({
          language,
          category,
          page: "1",
          perPage: "24",
        });
        const res = await fetch(`/api/public/recipes?${params.toString()}`, {
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`Failed to load recipes (${res.status})`);
        const json = (await res.json()) as { items: ApiRecipe[] };
        if (!ac.signal.aborted) setItems(json.items ?? []);
      } catch (e) {
        if (!ac.signal.aborted) setErr(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [language, category]);

  const headerSubtitle = useMemo(() => {
    if (loading) return t.loading;
    if (err) return t.error;
    return t.found(items.length);
  }, [items.length, loading, err, t]);

  const categoryFallbackImage = useMemo(() => {
    const slug = toSlug(category || "default");
    return `/assets/recipes/categories/${slug}.jpg`;
  }, [category]);

  return (
    <section className={styles.gridSection} aria-label={`${category} recipes`}>
      <header className={styles.header}>
        <h2 className={styles.title}>{category}</h2>
        <p className={styles.subtitle} aria-live="polite">{headerSubtitle}</p>
      </header>

      {err ? (
        <div className={styles.empty}>
          <p>{t.error}</p>
        </div>
      ) : loading ? (
        <div className={styles.grid} aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {t.none} <strong>{category}</strong>.
          </p>
        </div>
      ) : (
        <div className={styles.grid} role="list">
          {items.map((r) => {
            const href = `/${language}/recipes/${r.slug}`;
            const imgSrc = r.imageUrl || categoryFallbackImage;
            const minutes = normalizeMinutes(r.valuable_info?.duration);
            const difficulty = r.valuable_info?.difficulty ?? null;
            const portions = r.valuable_info?.portions ?? r.valuable_info?.persons ?? null;
            const summary = excerpt(r.shortDescription ?? r.description);

            return (
              <Link key={r.id} href={href} className={styles.card} role="listitem">
                <div className={styles.media}>
                  <SafeImage
                    src={imgSrc}
                    alt={r.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    unoptimized
                  />
                </div>

                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <p className={styles.excerpt}>{summary}</p>

                  <div className={styles.metaRow} aria-label={t.factsLabel}>
                    <span className={styles.meta}>
                      <span className={styles.metaIcon} aria-hidden>⏱</span>
                      {minutes ? `${minutes} ${t.minutes}` : "—"}
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
