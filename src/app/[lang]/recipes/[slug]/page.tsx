// src/app/[lang]/recipes/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import pageStyles from "./PageShell.module.css";
import { getRecipeBySlug } from "./recipe-data.server";

import RecipeHero from "./RecipeHero";
import RecipeDescription from "./RecipeDescription";
import RecipePhoto from "./RecipePhoto";
import CookSection from "./CookSection";
import NutritionSection from "./NutritionSection";

import {
  getDescriptionForSEO,
  normalizeImage,
  normalizeValuableInfo,
  sortInstructions,
} from "./helpers";
import type { Params, Recipe } from "./types";

/* ── Metadata ─────────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params; // ✅ await params
  const recipe = (await getRecipeBySlug(slug)) as Recipe | null;
  if (!recipe) return {};

  const title = recipe.meta_info?.meta_title ?? recipe.title;
  const description = getDescriptionForSEO(recipe);
  const img = normalizeImage(recipe);
  const keywords = recipe.meta_info?.meta_keywords ?? undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description, images: [{ url: img }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { lang, slug } = await params; // ✅ await params
  const recipe = (await getRecipeBySlug(slug)) as Recipe | null;
  if (!recipe) notFound();

  const img = normalizeImage(recipe);
  const { duration, difficulty, portions } = normalizeValuableInfo(
    recipe?.valuable_info
  );

  const ingredients = recipe?.ingredients ?? [];
  const instructions = sortInstructions(recipe?.instructions ?? []);
  const nutrition = recipe?.nutritional_facts ?? [];

  return (
    <article className={pageStyles.page}>
      <RecipeHero
        lang={lang}
        title={recipe.title}
        img={img}
        duration={duration}
        difficulty={difficulty}
        portions={portions}
      />

      {recipe.description?.trim() && (
        <RecipeDescription text={recipe.description} />
      )}

      <RecipePhoto img={img} title={recipe.title} />

      <CookSection
        lang={lang}
        ingredients={ingredients}
        instructions={instructions}
      />

      <NutritionSection lang={lang} nutrition={nutrition} />
    </article>
  );
}
