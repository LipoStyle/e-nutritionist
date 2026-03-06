import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en", "es", "el"] as const;
const DEFAULT = "en";

/**
 * Checks if the URL starts with a supported locale prefix.
 */
function hasLocalePrefix(pathname: string) {
  const seg = pathname.split("/")[1];
  return SUPPORTED.includes(seg as any);
}

/**
 * Retrieves the locale from the user's cookies.
 */
function getCookieLocale(req: NextRequest) {
  const v = req.cookies.get("locale")?.value;
  return SUPPORTED.includes(v as any)
    ? (v as (typeof SUPPORTED)[number])
    : null;
}

/**
 * Detects if a path is an admin path, even if prefixed with a locale.
 * Matches: /admin, /admin/services, /en/admin, /el/admin/recipes, etc.
 */
function isAdminPath(pathname: string) {
  const adminRegex = /^\/([a-z]{2}\/)?admin(\/.*)?$/;
  return adminRegex.test(pathname);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Create the initial response
  let response = NextResponse.next({
    request: req,
  });

  // 2. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Refresh the session (Recommended for Auth security)
  await supabase.auth.getUser();

  // 4. Ignore static files and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return response;
  }

  // 5. Admin & Locale Logic
  // If it's already localized (e.g., /en/admin), we just let it through.
  if (hasLocalePrefix(pathname)) {
    return response;
  }

  // If it's NOT localized (e.g., /admin or /services), redirect to /[locale]/path
  const locale = getCookieLocale(req) ?? DEFAULT;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  // Create the redirect response
  const redirectResponse = NextResponse.redirect(url);

  // CRITICAL: Copy Supabase auth cookies to the redirect response
  // so the user stays logged in after the redirect.
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value);
  });

  return redirectResponse;
}

export const config = {
  matcher: [
    // Optimized matcher to exclude static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
