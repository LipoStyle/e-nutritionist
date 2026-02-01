"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildLocaleHref } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

export async function adminSignIn(lang: Lang, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      buildLocaleHref(
        lang,
        `/admin/login?error=${encodeURIComponent(error.message)}`,
      ),
    );
  }

  // non-localized admin dashboard
  redirect("/admin");
}
