// src/app/[lang]/about/page.tsx
import Hero from '@/app/components/shared/Hero/Hero'
import { aboutHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = aboutHeroTranslations[locale]

  const hs = await getHeroSettings('about', locale)

  return (
    <Hero
      title={hs?.title || undefined}
      description={hs?.description ?? t.description}
      message={hs?.message ?? t.message}
      bookText={hs?.bookText ?? t.bookText}
      bookHref={hs?.bookHref ?? `/${locale}/book-consultation`}
      bgImage={hs?.bgImage ?? '/assets/images/hero/about.jpg'}
      overlayOpacity={hs?.overlayOpacity ?? 0.65}
      offsetHeader={hs?.offsetHeader ?? true}
      height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
      headingLevel={1}
      imagePriority={false}
      ariaLabel={t.ariaLabel}
    />
  )
}
