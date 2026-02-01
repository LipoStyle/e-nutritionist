import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { recipesComingSoonUI } from "@/app/[lang]/(public)/recipes/recipes.data";

type Lang = "en" | "es" | "el";

type Props = {
  params: Promise<{ lang: Lang }>;
};

export const metadata: Metadata = {
  title: "Recipes",
};

export default async function RecipesPage({ params }: Props) {
  const { lang } = await params;

  return (
    <ComingSoon lang={lang} ui={recipesComingSoonUI[lang]} kind="recipes" />
  );
}
