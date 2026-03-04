import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isAdminUser } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "@/styles/admin-dashboard.css"; // Import your new CSS here

import { normalizeLang } from "@/lib/i18n/locale";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localeCookie = (await cookies()).get("locale")?.value;
  const lang = normalizeLang(localeCookie);
  const adminLoginPath = `/${lang}/admin/login`;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect(adminLoginPath);
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    redirect(
      `${adminLoginPath}?error=${encodeURIComponent(
        "You are not authorized for admin access.",
      )}`,
    );
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
