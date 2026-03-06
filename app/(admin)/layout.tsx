import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isAdminUser } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logout } from "./admin/actions";
import { Home, LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import "@/styles/admin-dashboard.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("locale")?.value || "en";
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  // 1. Auth & Admin Protection
  if (error || !data.user) redirect(`/${lang}/admin/login`);
  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    redirect(`/${lang}/admin/login?error=Unauthorized`);
  }

  return (
    <html lang={lang}>
      <body className="admin-page-container">
        {/* Persistent Admin Header */}
        <nav className="admin-nav-header">
          <div className="admin-nav-content">
            <div className="admin-nav-left">
              <ShieldCheck className="admin-logo-icon" />
              <span className="admin-nav-title">Admin Terminal</span>
            </div>

            <div className="admin-nav-right">
              <Link
                href={`/${lang}`}
                className="nav-icon-link"
                title="View Website"
              >
                <Home size={20} />
                <span>Live Site</span>
              </Link>

              <form action={logout}>
                <button type="submit" className="nav-icon-link logout-btn">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </div>
        </nav>

        <main className="admin-main-wrapper">{children}</main>
      </body>
    </html>
  );
}
