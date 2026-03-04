import type { User } from "@supabase/supabase-js";

function splitCsv(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getConfiguredAdminEmails() {
  const single = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const many = splitCsv(process.env.ADMIN_EMAILS);
  return new Set([...(single ? [single] : []), ...many]);
}

export function isAdminUser(user: User | null) {
  if (!user) return false;

  const email = user.email?.trim().toLowerCase();
  const admins = getConfiguredAdminEmails();

  if (email && admins.has(email)) return true;
  if (user.app_metadata?.role === "admin") return true;
  if (user.user_metadata?.role === "admin") return true;

  return false;
}
