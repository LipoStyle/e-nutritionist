"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  // Clear the locale to redirect to the default login or home
  const cookieStore = await cookies();
  const lang = cookieStore.get("locale")?.value || "en";

  redirect(`/${lang}/admin/login`);
}
