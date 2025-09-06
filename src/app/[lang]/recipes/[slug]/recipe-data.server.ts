// src/app/[lang]/recipes/[slug]/recipe-data.server.ts
// Server-only utility: do NOT add "use client"
import { recipesData } from "@/app/[lang]/recipes/CircleNav/recipesData";

export type Recipe = (typeof recipesData)[number];

/** Normalize a string into a URL-safe slug */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip non-alphanumeric
    .replace(/\s+/g, "-") // spaces → dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
}

/** Find a recipe by slug (case-insensitive) */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const s = toSlug(slug);
  return (
    recipesData.find((r) => toSlug(r.slug ?? r.title) === s) ?? null
  );
}
