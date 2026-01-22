// app/[lang]/(public)/services/services.queries.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lang } from "@/lib/i18n/locale";

export type ServiceCardModel = {
  id: string;
  slug: string;
  service_type: string;
  price: number;
  duration_minutes: number | null;
  image_url: string | null;

  title: string;
  summary: string;
  description: string;
  features: string[];

  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
  };
};

type ServiceRow = {
  id: string;
  slug: string;
  price: number;
  service_type: string;
  duration_minutes: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string | null;
};

type TranslationRow = {
  service_id: string;
  language_code: string;
  title: string;
  summary: string;
  description: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
};

type FeatureRow = {
  service_id: string;
  language_code: string;
  feature_text: string;
  order_index: number | null;
};

/**
 * List view: returns cards for a given language with EN fallback.
 * Uses *_current views so DB versioning doesn't affect code.
 */
export async function fetchServiceCards(
  lang: Lang
): Promise<ServiceCardModel[]> {
  const supabase = await createSupabaseServerClient();

  // 1) Base services (active)
  const { data: services, error: sErr } = await supabase
    .from("services_current")
    .select(
      "id, slug, price, service_type, duration_minutes, image_url, is_active, created_at"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (sErr) throw new Error(`services_current query failed: ${sErr.message}`);
  const serviceRows = (services ?? []) as ServiceRow[];
  if (!serviceRows.length) return [];

  const serviceIds = serviceRows.map((s) => s.id);

  // 2) Translations (lang + EN fallback)
  const { data: tr, error: tErr } = await supabase
    .from("service_translations_current")
    .select(
      "service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords"
    )
    .in("service_id", serviceIds)
    .in("language_code", [lang, "en"]);

  if (tErr)
    throw new Error(
      `service_translations_current query failed: ${tErr.message}`
    );

  const translationRows = (tr ?? []) as TranslationRow[];

  // Prefer exact lang, else fallback to EN
  const trByService = new Map<string, TranslationRow>();
  for (const row of translationRows) {
    if (!trByService.has(row.service_id)) trByService.set(row.service_id, row);
    // overwrite EN with preferred lang if encountered
    if (row.language_code === lang) trByService.set(row.service_id, row);
  }

  // 3) Features (lang + EN fallback)
  const { data: ft, error: fErr } = await supabase
    .from("service_features_current")
    .select("service_id, language_code, feature_text, order_index")
    .in("service_id", serviceIds)
    .in("language_code", [lang, "en"])
    .order("order_index", { ascending: true });

  if (fErr)
    throw new Error(`service_features_current query failed: ${fErr.message}`);

  const featureRows = (ft ?? []) as FeatureRow[];

  // Group features by (service_id, language) then choose preferred
  const featuresByServiceLang = new Map<string, string[]>();
  for (const row of featureRows) {
    const key = `${row.service_id}:${row.language_code}`;
    const arr = featuresByServiceLang.get(key) ?? [];
    arr.push(row.feature_text);
    featuresByServiceLang.set(key, arr);
  }

  return serviceRows.map((s) => {
    const t = trByService.get(s.id);

    const preferred = featuresByServiceLang.get(`${s.id}:${lang}`) ?? [];
    const fallback = featuresByServiceLang.get(`${s.id}:en`) ?? [];
    const features = preferred.length ? preferred : fallback;

    return {
      id: s.id,
      slug: s.slug,
      service_type: s.service_type,
      price: Number(s.price),
      duration_minutes: s.duration_minutes ?? null,
      image_url: s.image_url ?? null,

      title: t?.title ?? s.slug,
      summary: t?.summary ?? "",
      description: t?.description ?? "",
      features,

      seo: {
        title: t?.seo_title ?? null,
        description: t?.seo_description ?? null,
        keywords: t?.seo_keywords ?? null,
      },
    };
  });
}

/**
 * Detail view: fetch one service by slug with translation + features.
 * Uses EN fallback.
 */
export async function fetchServiceBySlug(lang: Lang, slug: string) {
  const supabase = await createSupabaseServerClient();

  // 1) Base service
  const { data: service, error: sErr } = await supabase
    .from("services_current")
    .select(
      "id, slug, price, service_type, duration_minutes, image_url, is_active"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (sErr) throw new Error(`services_current by slug failed: ${sErr.message}`);
  if (!service || service.is_active === false) return null;

  // 2) Translation (lang, fallback EN)
  const { data: tr, error: tErr } = await supabase
    .from("service_translations_current")
    .select(
      "service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords"
    )
    .eq("service_id", service.id)
    .in("language_code", [lang, "en"]);

  if (tErr)
    throw new Error(
      `service_translations_current by id failed: ${tErr.message}`
    );

  const trRows = (tr ?? []) as TranslationRow[];

  const translation =
    trRows.find((x) => x.language_code === lang) ??
    trRows.find((x) => x.language_code === "en") ??
    null;

  // 3) Features (lang, fallback EN)
  const { data: ft, error: fErr } = await supabase
    .from("service_features_current")
    .select("id, service_id, language_code, feature_text, order_index")
    .eq("service_id", service.id)
    .in("language_code", [lang, "en"])
    .order("order_index", { ascending: true });

  if (fErr)
    throw new Error(`service_features_current by id failed: ${fErr.message}`);

  const preferred = (ft ?? []).filter((x: any) => x.language_code === lang);
  const fallback = (ft ?? []).filter((x: any) => x.language_code === "en");
  const features = preferred.length ? preferred : fallback;

  return {
    ...service,
    price: Number(service.price),
    translation,
    features,
  };
}
