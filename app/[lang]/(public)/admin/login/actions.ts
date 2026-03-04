"use server";

import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth/admin";
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

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !isAdminUser(userData.user)) {
    await supabase.auth.signOut();
    redirect(
      buildLocaleHref(
        lang,
        `/admin/login?error=${encodeURIComponent(
          "You are not authorized for admin access.",
        )}`,
      ),
    );
  }

  // non-localized admin dashboard
  redirect("/admin");
}
