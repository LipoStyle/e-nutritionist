"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LANGS = ["en", "el", "es"] as const;
type BlogLang = (typeof LANGS)[number];

function getStr(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

function parseCategories(csv: string) {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseKeywords(csv: string) {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function updateBlogDraft(formData: FormData) {
  const currentLang = getStr(formData, "current_lang") || "en";
  const lang = (LANGS.includes(currentLang as BlogLang) ? currentLang : "en") as BlogLang;
  const blogId = getStr(formData, "blog_id");
  if (!blogId) redirect(`/${lang}/admin/blogs?error=${encodeURIComponent("Missing blog id.")}`);

  const enSlug = getStr(formData, "tr_en_slug");
  const enTitle = getStr(formData, "tr_en_title");
  if (!enSlug || !enTitle) {
    redirect(`/${lang}/admin/blogs/edit/${blogId}?error=${encodeURIComponent("EN title and EN slug are required.")}`);
  }

  const supabase = await createSupabaseServerClient();

  // Update translations (upsert per language)
  for (const l of LANGS) {
    const title = getStr(formData, `tr_${l}_title`) || (l === "en" ? enTitle : "(Untitled)");
    const slug = getStr(formData, `tr_${l}_slug`) || (l === "en" ? enSlug : `${enSlug}-${l}`);
    const excerpt = getStr(formData, `tr_${l}_excerpt`) || null;
    const categoriesCsv = getStr(formData, `tr_${l}_categories`);
    const categories = parseCategories(categoriesCsv);
    const cover_image_url = getStr(formData, `tr_${l}_cover_image_url`) || null;
    const meta_title = getStr(formData, `tr_${l}_meta_title`) || null;
    const meta_description = getStr(formData, `tr_${l}_meta_description`) || null;
    const og_image_url = getStr(formData, `tr_${l}_og_image_url`) || null;
    const meta_keywords = parseKeywords(getStr(formData, `tr_${l}_meta_keywords`));

    const bodyJsonStr = getStr(formData, `tr_${l}_body_json`) || '{"blocks":[]}';
    let body_json: unknown = { blocks: [] };
    try {
      body_json = JSON.parse(bodyJsonStr);
    } catch {
      // keep default
    }

    const { error: trErr } = await supabase.from("blog_translations").upsert(
      {
        blog_id: blogId,
        language_code: l,
        title,
        slug,
        excerpt,
        categories,
        cover_image_url,
        meta_title,
        meta_description,
        og_image_url,
        meta_keywords,
        body_json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "blog_id,language_code" }
    );

    if (trErr) {
      redirect(`/${lang}/admin/blogs/edit/${blogId}?error=${encodeURIComponent(trErr.message)}`);
    }
  }

  // Touch master updated_at
  const { error: blogErr } = await supabase.from("blogs").update({ updated_at: new Date().toISOString() }).eq("id", blogId);
  if (blogErr) redirect(`/${lang}/admin/blogs/edit/${blogId}?error=${encodeURIComponent(blogErr.message)}`);

  redirect(`/${lang}/admin/blogs?updated=1`);
}

