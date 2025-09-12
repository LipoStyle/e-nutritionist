'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './CircleNav.module.css';

type LangCode = 'en' | 'es' | 'el';

type CircleNavProps = {
  language?: LangCode;
  categoriesOverride?: string[];
  /** px diameter of the visual ring */
  ringSize?: number;
  /** px radius from center to each item; defaults to ringSize / 2 */
  radius?: number;
  /** degrees for where the first item starts (0 = right, 90 = down, -90 = up) */
  startDeg?: number;
  /** degrees of arc to cover across all items (use 360 for full clock) */
  sweepDeg?: number;
  /** center fallback content (used only if no image is found) */
  center?: React.ReactNode;
  /** Optional: transform a category to a URL. Default: /recipes/category/<slug> */
  categoryHref?: (category: string) => string;
  /** Optional: intercept clicks (e.g., set UI filter) */
  onCategorySelect?: (category: string) => void;
  /** Hero background per category */
  backgroundForCategory?: Record<string, string>;
  /** Center image per category (preferred source) */
  centerImageForCategory?: Record<string, string>;
  /** Which category is selected (to swap bg + active state) */
  selectedCategory?: string;
};

type OrbitVars = React.CSSProperties & {
  ['--x']?: string;
  ['--y']?: string;
};

type ApiCategory = { name: string; imageUrl: string | null };

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function CircleNav({
  language = 'en',
  categoriesOverride,
  ringSize = 360,
  radius,
  startDeg = -90, // 12 o’clock
  sweepDeg = 360, // full circle
  center,
  categoryHref = (cat) => `/recipes/category/${toSlug(cat)}`,
  onCategorySelect,
  backgroundForCategory,
  centerImageForCategory,
  selectedCategory,
}: CircleNavProps) {
  // Local state from DB
  const [dbCats, setDbCats] = useState<string[]>([]);
  const [dbCenterImageMap, setDbCenterImageMap] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);

  // Fetch categories from API whenever language changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/recipes/categories?language=${language}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Failed to load categories (${res.status})`);
        const json = (await res.json()) as { categories: ApiCategory[] };
        if (cancelled) return;

        const names = json.categories.map((c) => c.name);
        const map: Record<string, string | undefined> = {};
        for (const c of json.categories) {
          if (c.imageUrl) map[c.name] = c.imageUrl;
        }

        setDbCats(names);
        setDbCenterImageMap(map);
      } catch {
        // If API fails, keep empty → component will render nothing (same as before when no categories)
        setDbCats([]);
        setDbCenterImageMap({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [language]);

  // Default radius to the ring perimeter
  const r = typeof radius === 'number' ? radius : ringSize / 2;

  // Categories (unique, optionally filtered by override)
  const categories = useMemo(() => {
    const base = dbCats;
    if (!base.length) return [];

    if (categoriesOverride?.length) {
      const set = new Set(base);
      return categoriesOverride.filter((c) => set.has(c));
    }
    return base;
  }, [dbCats, categoriesOverride]);

  const count = categories.length;
  if (!loading && count === 0) return null;

  const isFullCircle = Math.abs(sweepDeg) >= 360;
  const step = count
    ? isFullCircle
      ? sweepDeg / count
      : count > 1
        ? sweepDeg / (count - 1)
        : 0
    : 0;

  // Background image for the hero area:
  // 1) prop map, 2) DB center image for selected category, 3) default
  const selectedImg =
    (selectedCategory && dbCenterImageMap[selectedCategory]) || undefined;

  const bg =
    (selectedCategory && backgroundForCategory?.[selectedCategory]) ||
    selectedImg ||
    '/assets/recipes/cards/default.jpg';

  // Center image for the selected category:
  // 1) preferred prop map, 2) DB image, 3) undefined → use fallback center node/text
  const centerImgSrc = useMemo(() => {
    if (!selectedCategory) return undefined;
    const byMap = centerImageForCategory?.[selectedCategory];
    if (byMap) return byMap;
    return dbCenterImageMap[selectedCategory];
  }, [selectedCategory, centerImageForCategory, dbCenterImageMap]);

  // Choose semantic element: button when intercepting, anchor otherwise
  const useButton = Boolean(onCategorySelect);

  return (
    <div className={styles.heroWrapper} style={{ backgroundImage: `url(${bg})` }}>
      <div className={styles.overlay} />

      <nav aria-label="Recipe categories" className={styles.wrapper}>
        <div
          className={styles.ring}
          role="list"
          style={{ width: ringSize, height: ringSize }}
        >
          {/* Outer circle hidden via CSS */}
          <div className={styles.circle} aria-hidden="true" />

          {/* Center hub: selected category image (fallback to text) */}
          <div className={`${styles.center} ${styles.plate}`}>
            {centerImgSrc ? (
              <Image
                key={centerImgSrc} // forces re-render on change
                src={centerImgSrc}
                alt={`${selectedCategory ?? 'Category'} preview`}
                fill
                sizes="(max-width: 768px) 40vw, 260px"
                priority
                className="rotate-in"
              />
            ) : (
              center ?? <span className={styles.centerText}>Categories</span>
            )}
          </div>

          {categories.map((cat, i) => {
            const angleDeg = startDeg + i * step;
            const angle = (angleDeg * Math.PI) / 180;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            const style: OrbitVars = {
              ['--x']: `${x}px`,
              ['--y']: `${y}px`,
            };

            const selected = cat === selectedCategory;

            if (useButton) {
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategorySelect?.(cat)}
                  aria-label={`Category: ${cat}`}
                  aria-current={selected ? 'true' : undefined}
                  className={`${styles.item} ${selected ? styles.active : ''}`}
                  style={style}
                  role="listitem"
                >
                  <span className={styles.inner}>
                    <span className={styles.label}>{cat}</span>
                  </span>
                </button>
              );
            }

            const href = categoryHref(cat);
            return (
              <a
                key={cat}
                href={href}
                aria-label={`Category: ${cat}`}
                aria-current={selected ? 'page' : undefined}
                className={`${styles.item} ${selected ? styles.active : ''}`}
                style={style}
                role="listitem"
              >
                <span className={styles.inner}>
                  <span className={styles.label}>{cat}</span>
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
