// src/app/[lang]/services/page.tsx
import Hero from '@/app/components/shared/Hero/Hero'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'
import { serviceHeroTranslations } from './translations' // keep your existing translations

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = serviceHeroTranslations[locale]

  // Pull per-page, per-language hero settings from DB
  const hs = await getHeroSettings('services', locale)

  return (
    <Hero
      title={hs?.title || undefined}
      description={hs?.description ?? t.description}
      message={hs?.message ?? t.message}
      bookText={hs?.bookText ?? t.bookText}
      bookHref={hs?.bookHref ?? `/${locale}/book-consultation`}
      bgImage={hs?.bgImage ?? '/assets/images/hero/services.jpg'}
      overlayOpacity={hs?.overlayOpacity ?? 0.6}
      offsetHeader={hs?.offsetHeader ?? true}
      height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
      headingLevel={1}
      imagePriority={false}
      ariaLabel={t.ariaLabel}
    />
  )
}
