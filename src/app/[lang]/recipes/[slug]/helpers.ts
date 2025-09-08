import { copy } from "./copy";
import type { Instruction, Lang, Recipe, ValuableInfo } from "./types";

export function normalizeImage(recipe: Recipe | null): string {
  return recipe?.image_url || recipe?.image || "/assets/recipes/cards/default.jpg";
}

export function getDescriptionForSEO(recipe: Recipe | null): string | undefined {
  const raw =
    recipe?.meta_info?.meta_description ??
    recipe?.description?.replace(/\s+/g, " ").trim() ??
    "";
  if (!raw) return undefined;
  return raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
}

export function normalizeValuableInfo(vi?: ValuableInfo | null) {
  const durationRaw = vi?.duration;
  const portionsRaw = vi?.portions ?? vi?.persons;

  const duration =
    durationRaw == null || durationRaw === ""
      ? ""
      : /\bmin\b/i.test(String(durationRaw))
      ? String(durationRaw)
      : `${durationRaw} min`;

  const portions =
    portionsRaw == null || portionsRaw === "" ? "" : String(portionsRaw);

  const difficulty = vi?.difficulty ?? "";

  return { duration, portions, difficulty };
}

export function sortInstructions(list: Instruction[] = []): Instruction[] {
  return list.slice().sort((a, b) => (a?.step_number ?? 0) - (b?.step_number ?? 0));
}

export function servingLabel(n: string, lang: Lang): string {
  const num = Number(n);
  const t = copy[lang] ?? copy.en;
  if (!Number.isFinite(num)) return t.servingPlural;
  return num === 1 ? t.servingSingular : t.servingPlural;
}
