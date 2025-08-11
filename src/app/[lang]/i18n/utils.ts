export const SUPPORTED_LANGS = ['en', 'es', 'el'] as const
export type Locale = (typeof SUPPORTED_LANGS)[number]

export function resolveLocale(input?: string): Locale {
  const lower = (input || '').toLowerCase()
  return (SUPPORTED_LANGS.includes(lower as Locale) ? lower : 'en') as Locale
}
