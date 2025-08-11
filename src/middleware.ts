// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SUPPORTED_LOCALES = ['en', 'es', 'el'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]
const DEFAULT_LOCALE: Locale = 'en'

// HS256 secret for verifying admin JWT (set in .env.local)
const ADMIN_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me'
)

function getLocaleFromPath(pathname: string): Locale | null {
  const seg = pathname.split('/').filter(Boolean)[0]
  return SUPPORTED_LOCALES.includes(seg as Locale) ? (seg as Locale) : null
}

function negotiateLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE
  const langs = header
    .split(',')
    .map((p) => p.trim().split(';')[0].toLowerCase())
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
  // 1) Locale handling
  // ---------------------------
  const pathLocale = getLocaleFromPath(pathname)
  const qLang = (searchParams.get('lang') || '').toLowerCase()
  const cookieLang = (cookies.get('lang')?.value || '').toLowerCase()
  const headerLang = negotiateLocale(headers.get('accept-language'))

  const desiredLocale: Locale =
    (SUPPORTED_LOCALES.includes(qLang as Locale) && (qLang as Locale)) ||
    (SUPPORTED_LOCALES.includes(cookieLang as Locale) && (cookieLang as Locale)) ||
    headerLang

  // If no locale in path, redirect to /{locale}{pathname}
  if (!pathLocale) {
    const url = nextUrl.clone()
    url.pathname = `/${desiredLocale}${pathname}`
    const res = NextResponse.redirect(url, 307)
    res.cookies.set('lang', desiredLocale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    return res
  }

  // Clean up ?lang when it disagrees with path
  if (qLang && qLang !== pathLocale) {
    const url = nextUrl.clone()
    url.searchParams.delete('lang')
    const res = NextResponse.redirect(url, 307)
    res.cookies.set('lang', pathLocale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    return res
  }

  // ---------------------------
  // 2) Admin area protection
  //    Protect /{lang}/admin/** except /{lang}/admin/login
  // ---------------------------
  const isAdminArea = pathname.startsWith(`/${pathLocale}/admin`)
  const isLoginPage = pathname.startsWith(`/${pathLocale}/admin/login`)

  if (isAdminArea) {
    const token = cookies.get('admin_token')?.value

    if (isLoginPage) {
      // If already authenticated, skip login and go to dashboard
      if (token) {
        try {
          const { payload } = await jwtVerify(token, ADMIN_SECRET)
          if (payload?.role === 'admin') {
            const url = nextUrl.clone()
            url.pathname = `/${pathLocale}/admin`
            return NextResponse.redirect(url, 307)
          }
        } catch {
          // invalid/expired token -> fall through to show login
        }
      }
    } else {
      // Any admin page (not login) requires a valid token
      if (!token) {
        const url = nextUrl.clone()
        url.pathname = `/${pathLocale}/admin/login`
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url, 307)
      }
      try {
        const { payload } = await jwtVerify(token, ADMIN_SECRET)
        if (payload?.role !== 'admin') {
          throw new Error('Invalid role')
        }
      } catch {
        const url = nextUrl.clone()
        url.pathname = `/${pathLocale}/admin/login`
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url, 307)
      }
    }
  }

  // ---------------------------
  // 3) Theme persistence (?theme=light|dark)
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
  // Excludes api/_next/static files/etc.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
