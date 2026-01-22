// app/[lang]/(public)/home/home.queries.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lang } from "@/lib/i18n/locale";

export type HeroSlideModel = {
  id: string;
  order_index: number;
  background_image_url: string | null;
  is_active: boolean;

  layer_type: string | null; // e.g. gradient_2, single
  layer_direction: string | null; // horizontal | vertical
  layer_opacity: number | null;

  layer_color_1: string | null;
  layer_color_2: string | null;
  layer_color_3: string | null;

  content: {
    language_code: Lang;
    h1_title: string;
    paragraph: string;
    primary_button_text: string;
    primary_button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
  };
};

type SlideRow = {
  id: string;
  order_index: number;
  background_image_url: string | null;
  is_active: boolean;

  layer_type: string | null;
  layer_direction: string | null;
  layer_opacity: number | null;

  layer_color_1: string | null;
  layer_color_2: string | null;
  layer_color_3: string | null;
};

type TranslationRow = {
  slide_id: string;
  language_code: string;
  h1_title: string;
  paragraph: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
};

export async function fetchHeroSlides(lang: Lang): Promise<HeroSlideModel[]> {
  const supabase = await createSupabaseServerClient();

  const { data: slides, error: sErr } = await supabase
    .from("hero_slides_2025_12_11_15_30")
    .select(
      "id, order_index, background_image_url, is_active, layer_type, layer_direction, layer_opacity, layer_color_1, layer_color_2, layer_color_3",
    )
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (sErr) throw new Error(`hero slides query failed: ${sErr.message}`);

  const slideRows = (slides ?? []) as SlideRow[];
  if (!slideRows.length) return [];

  const ids = slideRows.map((s) => s.id);

  const { data: tr, error: tErr } = await supabase
    .from("slide_translations_2025_12_11_15_30")
    .select(
      "slide_id, language_code, h1_title, paragraph, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url",
    )
    .in("slide_id", ids)
    .in("language_code", [lang, "en"]);

  if (tErr) throw new Error(`slide translations query failed: ${tErr.message}`);

  const trRows = (tr ?? []) as TranslationRow[];

  // Build a lookup: slide_id -> { lang, en }
  const bySlide = new Map<
    string,
    { preferred?: TranslationRow; fallback?: TranslationRow }
  >();

  for (const row of trRows) {
    const cur = bySlide.get(row.slide_id) ?? {};
    if (row.language_code === lang) cur.preferred = row;
    if (row.language_code === "en") cur.fallback = row;
    bySlide.set(row.slide_id, cur);
  }

  return slideRows.map((s) => {
    const entry = bySlide.get(s.id);
    const t = entry?.preferred ?? entry?.fallback;

    return {
      id: s.id,
      order_index: s.order_index,
      background_image_url: s.background_image_url,
      is_active: s.is_active,

      layer_type: s.layer_type,
      layer_direction: s.layer_direction,
      layer_opacity: s.layer_opacity,

      layer_color_1: s.layer_color_1,
      layer_color_2: s.layer_color_2,
      layer_color_3: s.layer_color_3,

      content: {
        language_code: (t?.language_code as Lang) ?? lang,
        h1_title: t?.h1_title ?? "",
        paragraph: t?.paragraph ?? "",
        primary_button_text: t?.primary_button_text ?? "",
        primary_button_url: t?.primary_button_url ?? "/contact",
        secondary_button_text: t?.secondary_button_text ?? "",
        secondary_button_url: t?.secondary_button_url ?? "/services",
      },
    };
  });
}
