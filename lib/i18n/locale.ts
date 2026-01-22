// lib/i18n/locale.ts
export type Lang = "en" | "es" | "el";

export const SUPPORTED_LANGS: readonly Lang[] = ["en", "es", "el"] as const;

export function normalizeLang(value: unknown): Lang {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v !== "string") return "en";

  // Optional legacy mapping; remove later if not needed
  const mapped = v === "eng" ? "en" : v;

  return (SUPPORTED_LANGS as readonly string[]).includes(mapped)
    ? (mapped as Lang)
    : "en";
}

export function buildLocaleHref(lang: Lang, href: string) {
  // External links unchanged
  if (href.startsWith("http://") || href.startsWith("https://")) return href;

  // Already localized
  if (href.startsWith(`/${lang}/`)) return href;

  // Normalize relative hrefs
  if (!href.startsWith("/")) return `/${lang}/${href}`;

  // Prefix locale
  return `/${lang}${href}`;
}
