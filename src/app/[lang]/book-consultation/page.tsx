// src/app/[lang]/book-consultation/page.tsx
import Hero from '@/app/components/shared/Hero/Hero'
import { bookingHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'

export default async function BookPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = bookingHeroTranslations[locale]

  // Use the same key you seeded: 'booking'
  const hs = await getHeroSettings('booking', locale)

  return (
    <Hero
      title={hs?.title || undefined}
      description={hs?.description ?? t.description}
      message={hs?.message ?? t.message}
      bookText={hs?.bookText ?? t.bookText}
      /* Usually no CTA link on this page; allow DB to override if provided */
      bookHref={hs?.bookHref ?? undefined}
      bgImage={hs?.bgImage ?? '/assets/images/hero/book-consultation.jpg'}
      overlayOpacity={hs?.overlayOpacity ?? 0.55}
      offsetHeader={hs?.offsetHeader ?? true}
      height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
      headingLevel={1}
      imagePriority={false}
      ariaLabel={t.ariaLabel}
    />
  )
}
