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

export async function saveBlogDraft(formData: FormData) {
  const currentLang = getStr(formData, "current_lang") || "en";
  const lang = (LANGS.includes(currentLang as BlogLang) ? currentLang : "en") as BlogLang;

  const supabase = await createSupabaseServerClient();

  // 1) Create blog master (always draft)
  const { data: blog, error: blogErr } = await supabase
    .from("blogs")
    .insert([{ is_published: false, published_at: null }])
    .select("id")
    .single();

  if (blogErr || !blog?.id) {
    redirect(`/${lang}/admin/blogs/new?error=${encodeURIComponent(blogErr?.message ?? "Failed to create blog.")}`);
  }

  const enSlug = getStr(formData, "tr_en_slug");
  const enTitle = getStr(formData, "tr_en_title");
  if (!enSlug || !enTitle) {
    redirect(`/${lang}/admin/blogs/new?error=${encodeURIComponent("EN title and EN slug are required.")}`);
  }

  // 2) Insert translations
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

    const { error: trErr } = await supabase.from("blog_translations").insert({
      blog_id: blog.id,
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
    });

    if (trErr) {
      redirect(`/${lang}/admin/blogs/new?error=${encodeURIComponent(trErr.message)}`);
    }
  }

  redirect(`/${lang}/admin/blogs?created=1`);
}

