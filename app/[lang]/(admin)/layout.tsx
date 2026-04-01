import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logout } from "./admin/actions"; // Ensure this points to your actions.ts
import { Home, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import "@/styles/admin-dashboard.css";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { lang } = await params; // Next.js 15 async params

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  // Protect the route
  if (error || !data.user) redirect(`/${lang}/admin/login`);

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    redirect(`/${lang}/admin/login?error=Unauthorized`);
  }

  return (
    <div className="admin-page-container">
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

            {/* --- FIXED LOGOUT FORM --- */}
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
    </div>
  );
}
