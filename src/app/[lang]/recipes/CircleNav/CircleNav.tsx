"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import styles from "./CircleNav.module.css";
import { recipesData } from "./recipesData";

type LangCode = "en" | "es" | "el";

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
  ["--x"]?: string;
  ["--y"]?: string;
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CircleNav({
  language,
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
  // Default radius to the ring perimeter
  const r = typeof radius === "number" ? radius : ringSize / 2;

  // Categories (unique, optionally filtered by override)
  const categories = useMemo(() => {
    const base = language
      ? recipesData.filter((re) => re.language === language)
      : recipesData;

    const uniq: string[] = [];
    for (const rec of base) {
      if (rec.category && !uniq.includes(rec.category)) uniq.push(rec.category);
    }

    if (categoriesOverride?.length) {
      const set = new Set(uniq);
      return categoriesOverride.filter((c) => set.has(c));
    }
    return uniq;
  }, [language, categoriesOverride]);

  const count = categories.length;
  if (count === 0) return null;

  const isFullCircle = Math.abs(sweepDeg) >= 360;
  const step = isFullCircle ? sweepDeg / count : count > 1 ? sweepDeg / (count - 1) : 0;

  // Background image for the hero area
  const bg =
    (selectedCategory && backgroundForCategory?.[selectedCategory]) ??
    "/assets/recipes/cards/default.jpg";

  // Center image for the selected category
  const centerImgSrc = useMemo(() => {
    if (!selectedCategory) return undefined;
    // 1) preferred: provided map
    const byMap = centerImageForCategory?.[selectedCategory];
    if (byMap) return byMap;

    // 2) fallback: first recipe image from this category
    const candidate = recipesData.find(
      (r) => r.category === selectedCategory && !!r.image
    );
    return candidate?.image;
  }, [selectedCategory, centerImageForCategory]);

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
                alt={`${selectedCategory ?? "Category"} preview`}
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
              ["--x"]: `${x}px`,
              ["--y"]: `${y}px`,
            };

            const selected = cat === selectedCategory;

            if (useButton) {
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategorySelect?.(cat)}
                  aria-label={`Category: ${cat}`}
                  aria-current={selected ? "true" : undefined}
                  className={`${styles.item} ${selected ? styles.active : ""}`}
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
                aria-current={selected ? "page" : undefined}
                className={`${styles.item} ${selected ? styles.active : ""}`}
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
