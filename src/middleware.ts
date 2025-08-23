import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SUPPORTED_LOCALES = ['en', 'es', 'el'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]
const DEFAULT_LOCALE: Locale = 'en'

// ---- Secrets & JWT settings
const RAW_ADMIN_SECRET = process.env.ADMIN_JWT_SECRET
if (process.env.NODE_ENV === 'production' && !RAW_ADMIN_SECRET) {
  throw new Error('ADMIN_JWT_SECRET is required in production')
}
const ADMIN_SECRET = new TextEncoder().encode(RAW_ADMIN_SECRET ?? 'dev-secret-change-me')
const JWT_OPTS = { /* enforce these if you add them to your token:
  issuer: 'e-nutritionist',
  audience: 'admin',
*/ }

// ---- Helpers
const secureCookieOpts = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}
const clientCookieOpts = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

function getLocaleFromPath(pathname: string): Locale | null {
  const seg = pathname.split('/').filter(Boolean)[0]
  return SUPPORTED_LOCALES.includes(seg as Locale) ? (seg as Locale) : null
}
function negotiateLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE
  const langs = header.split(',').map(p => p.trim().split(';')[0].toLowerCase())
  for (const l of langs) {
    const base = l.split('-')[0]
    if (SUPPORTED_LOCALES.includes(base as Locale)) return base as Locale
  }
  return DEFAULT_LOCALE
}
function isSafeAdminPath(pathname: string, lang: Locale) {
  return pathname.startsWith(`/${lang}/admin`)
}

export async function middleware(req: NextRequest) {
  const { nextUrl, headers, cookies } = req
  const { pathname, searchParams } = nextUrl

  // 0) Ensure locale prefix
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
    // set only if changed
    if (cookies.get('lang')?.value !== desiredLocale) {
      res.cookies.set('lang', desiredLocale, clientCookieOpts)
    }
    return res
  }

  // 0.1) Legacy normalization + query cleanup
  if (pathname.startsWith(`/${pathLocale}/admin-dashboard`)) {
    const url = nextUrl.clone()
    url.pathname = `/${pathLocale}/admin`
    return NextResponse.redirect(url, 308)
  }

  // Normalize ?next → ?from ONLY on login, and strip ?next elsewhere
  if (searchParams.has('next')) {
    const url = nextUrl.clone()
    const nextVal = url.searchParams.get('next') || ''
    url.searchParams.delete('next')

    if (pathname.startsWith(`/${pathLocale}/admin/login`)) {
      const normalized = nextVal.startsWith(`/${pathLocale}/admin-dashboard`)
        ? `/${pathLocale}/admin`
        : nextVal

      const safeFrom = isSafeAdminPath(normalized, pathLocale)
        ? normalized
        : `/${pathLocale}/admin`

      if (url.searchParams.get('from') !== safeFrom) {
        url.searchParams.set('from', safeFrom)
      }
    }
    return NextResponse.redirect(url, 307)
  }

  // Keep ?lang consistent with path
  if (qLang && qLang !== pathLocale) {
    const url = nextUrl.clone()
    url.searchParams.delete('lang')
    const res = NextResponse.redirect(url, 307)
    if (cookies.get('lang')?.value !== pathLocale) {
      res.cookies.set('lang', pathLocale, clientCookieOpts)
    }
    return res
  }

  // 1) Admin area protection
  const isAdminArea = pathname.startsWith(`/${pathLocale}/admin`)
  const isLoginPage = pathname.startsWith(`/${pathLocale}/admin/login`)
  const safeFrom = isSafeAdminPath(pathname, pathLocale) ? pathname : `/${pathLocale}/admin`

  if (isAdminArea) {
    const token = cookies.get('admin_token')?.value

    if (isLoginPage) {
      if (token) {
        try {
          const { payload } = await jwtVerify(token, ADMIN_SECRET, JWT_OPTS)
          if (payload?.role === 'admin') {
            const url = nextUrl.clone()
            url.pathname = `/${pathLocale}/admin`
            return NextResponse.redirect(url, 307)
          }
        } catch {
          // invalid/expired -> show login
        }
      }
    } else {
      if (!token) {
        const url = nextUrl.clone()
        url.pathname = `/${pathLocale}/admin/login`
        url.searchParams.set('from', safeFrom)
        return NextResponse.redirect(url, 307)
      }
      try {
        const { payload } = await jwtVerify(token, ADMIN_SECRET, JWT_OPTS)
        if (payload?.role !== 'admin') throw new Error('Invalid role')
      } catch {
        const url = nextUrl.clone()
        url.pathname = `/${pathLocale}/admin/login`
        url.searchParams.set('from', safeFrom)
        return NextResponse.redirect(url, 307)
      }
    }
  }

  // 2) Theme persistence
  const qTheme = searchParams.get('theme')
  const theme = qTheme === 'dark' || qTheme === 'light' ? qTheme : cookies.get('theme')?.value

  const res = NextResponse.next()
  if (cookies.get('lang')?.value !== pathLocale) {
    res.cookies.set('lang', pathLocale, clientCookieOpts)
  }
  if (theme) {
    if (cookies.get('theme')?.value !== theme) {
      res.cookies.set('theme', theme, clientCookieOpts)
    }
    res.headers.set('x-theme', theme)
  }
  return res
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
