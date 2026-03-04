import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en", "es", "el"] as const;
const DEFAULT = "en";

function hasLocalePrefix(pathname: string) {
  const seg = pathname.split("/")[1];
  return SUPPORTED.includes(seg as any);
}

function getCookieLocale(req: NextRequest) {
  const v = req.cookies.get("locale")?.value;
  return SUPPORTED.includes(v as any)
    ? (v as (typeof SUPPORTED)[number])
    : null;
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Create the initial response
  let response = NextResponse.next({
    request: req,
  });

  // 2. Initialize Supabase Client
  // This logic ensures that if Supabase refreshes a token, the new cookie
  // is passed both to the current request and the final response.
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

  // 3. Refresh the session
  // Using getUser() is the recommended way to handle session refreshes
  // safely in Next.js middleware.
  await supabase.auth.getUser();

  // 4. Your existing Admin Check
  if (isAdminPath(pathname)) {
    return response;
  }

  // 5. Your existing internal/file filter
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return response;
  }

  // 6. Your existing Locale logic
  if (hasLocalePrefix(pathname)) return response;

  const locale = getCookieLocale(req) ?? DEFAULT;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  // Create a redirect response but keep the Supabase cookies!
  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value);
  });

  return redirectResponse;
}

export const config = {
  // Updated matcher to be slightly more inclusive for auth routes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
