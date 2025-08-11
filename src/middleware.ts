// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SUPPORTED_LOCALES = ['en', 'es', 'el'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]
const DEFAULT_LOCALE: Locale = 'en'

// HS256 secret for verifying admin JWT (set in .env.local / Vercel)
const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me')

function getLocaleFromPath(pathname: string): Locale | null {
  const seg = pathname.split('/').filter(Boolean)[0]
  return SUPPORTED_LOCALES.includes(seg as Locale) ? (seg as Locale) : null
}

function negotiateLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE
  const langs = header.split(',').map((p) => p.trim().split(';')[0].toLowerCase())
  for (const l of langs) {
    const base = l.split('-')[0]
    if (SUPPORTED_LOCALES.includes(base as Locale)) return base as Locale
  }
  return DEFAULT_LOCALE
}

export async function middleware(req: NextRequest) {
  const { nextUrl, headers, cookies } = req
  const { pathname, searchParams } = nextUrl

  // ---------------------------
  // 0) Locale prefix (ensure /{lang}/...)
  // ---------------------------
  const pathLocale = getLocaleFromPath(pathname)
  const qLang = (searchParams.get('lang') || '').toLowerCase()
  const cookieLang = (cookies.get('lang')?.value || '').toLowerCase()
  const headerLang = negotiateLocale(headers.get('accept-language'))

  const desiredLocale: Locale =
    (SUPPORTED_LOCALES.includes(qLang as Locale) && (qLang as Locale)) ||
    (SUPPORTED_LOCALES.includes(cookieLang as Locale) && (cookieLang as Locale)) ||
    headerLang

  if (!pathLocale) {
    const url = nextUrl.clone()
    url.pathname = `/${desiredLocale}${pathname}`
    const res = NextResponse.redirect(url, 307)
    res.cookies.set('lang', desiredLocale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    return res
  }

  // ---------------------------
  // 0.1) Legacy route normalization + query cleanup
  // ---------------------------
  // /{lang}/admin-dashboard  ->  /{lang}/admin  (prevents legacy loops)
  if (pathname.startsWith(`/${pathLocale}/admin-dashboard`)) {
    const url = nextUrl.clone()
    url.pathname = `/${pathLocale}/admin`
    return NextResponse.redirect(url, 308)
  }

  // Strip old ?next=... param anywhere (it caused loops)
  if (searchParams.has('next')) {
    const url = nextUrl.clone()
    url.searchParams.delete('next')
    return NextResponse.redirect(url, 307)
  }

  // Keep ?lang consistent with path
  if (qLang && qLang !== pathLocale) {
    const url = nextUrl.clone()
    url.searchParams.delete('lang')
    const res = NextResponse.redirect(url, 307)
    res.cookies.set('lang', pathLocale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    return res
  }

  // ---------------------------
  // 1) Admin area protection
  //    Protect /{lang}/admin/** except /{lang}/admin/login
  // ---------------------------
  const isAdminArea = pathname.startsWith(`/${pathLocale}/admin`)
  const isLoginPage = pathname.startsWith(`/${pathLocale}/admin/login`)

  // Helper: build a safe 'from' value to avoid open-redirects / loops
  const safeFrom = pathname.startsWith(`/${pathLocale}/admin`) ? pathname : `/${pathLocale}/admin`

  if (isAdminArea) {
    const token = cookies.get('admin_token')?.value

    if (isLoginPage) {
      // Already authenticated? go to dashboard
      if (token) {
        try {
          const { payload } = await jwtVerify(token, ADMIN_SECRET)
          if (payload?.role === 'admin') {
            const url = nextUrl.clone()
            url.pathname = `/${pathLocale}/admin`
            return NextResponse.redirect(url, 307)
          }
        } catch {
          // invalid/expired token -> show login
        }
      }
    } else {
      // Any admin page (not login) requires a valid token
      if (!token) {
        const url = nextUrl.clone()
        url.pathname = `/${pathLocale}/admin/login`
        url.searchParams.set('from', safeFrom)
        return NextResponse.redirect(url, 307)
      }
      try {
        const { payload } = await jwtVerify(token, ADMIN_SECRET)
        if (payload?.role !== 'admin') throw new Error('Invalid role')
      } catch {
        const url = nextUrl.clone()
        url.pathname = `/${pathLocale}/admin/login`
        url.searchParams.set('from', safeFrom)
        return NextResponse.redirect(url, 307)
      }
    }
  }

  // ---------------------------
  // 2) Theme persistence (?theme=light|dark)
  // ---------------------------
  const qTheme = searchParams.get('theme')
  const theme = qTheme === 'dark' || qTheme === 'light' ? qTheme : cookies.get('theme')?.value

  const res = NextResponse.next()
  res.cookies.set('lang', pathLocale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  if (theme) {
    res.cookies.set('theme', theme, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    res.headers.set('x-theme', theme)
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
