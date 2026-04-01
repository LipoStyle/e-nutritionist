"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LANGS = ["en", "el", "es"] as const;
type BlogLang = (typeof LANGS)[number];

function getStr(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

function getLang(raw: string): BlogLang {
  return (LANGS.includes(raw as BlogLang) ? raw : "en") as BlogLang;
}

export async function deleteBlog(formData: FormData) {
  const lang = getLang(getStr(formData, "current_lang") || "en");
  const id = getStr(formData, "id");
  if (!id) redirect(`/${lang}/admin/blogs?error=${encodeURIComponent("Missing blog id.")}`);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) redirect(`/${lang}/admin/blogs?error=${encodeURIComponent(error.message)}`);

  redirect(`/${lang}/admin/blogs?deleted=1`);
}

export async function togglePublishBlog(formData: FormData) {
  const lang = getLang(getStr(formData, "current_lang") || "en");
  const id = getStr(formData, "id");
  const next = getStr(formData, "next_published") === "true";
  if (!id) redirect(`/${lang}/admin/blogs?error=${encodeURIComponent("Missing blog id.")}`);

  const supabase = await createSupabaseServerClient();
  const published_at = next ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("blogs")
    .update({ is_published: next, published_at, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) redirect(`/${lang}/admin/blogs?error=${encodeURIComponent(error.message)}`);

  redirect(`/${lang}/admin/blogs?updated=1`);
}

