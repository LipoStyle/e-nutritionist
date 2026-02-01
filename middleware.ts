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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Exclude admin routes from locale prefixing
  if (isAdminPath(pathname)) {
    return NextResponse.next();
  }

  // ignore Next internals, api, and files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // already locale-prefixed -> continue
  if (hasLocalePrefix(pathname)) return NextResponse.next();

  // choose locale: cookie -> default
  const locale = getCookieLocale(req) ?? DEFAULT;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
