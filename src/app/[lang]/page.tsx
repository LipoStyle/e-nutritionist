import Hero from '@/app/components/shared/Hero/Hero'
import { resolveLocale } from './i18n/utils'
import { homeHeroTranslations } from './translations'
import { getHeroSettings } from '@/lib/hero' // <- helper we added earlier

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = homeHeroTranslations[locale]

  // DB row for (pageKey='home', language=locale). Might be null if not created yet.
  const hs = await getHeroSettings('home', locale)

  return (
    <Hero
      // prefer DB values, otherwise fall back to your existing translations/defaults
      title={hs?.title || undefined}
      description={hs?.description ?? t.description}
      message={hs?.message ?? t.message}
      bookText={hs?.bookText ?? t.bookText}
      bookHref={hs?.bookHref ?? `/${locale}/book-consultation`}
      bgImage={hs?.bgImage ?? '/assets/images/hero/home.jpg'}
      overlayOpacity={hs?.overlayOpacity ?? 0.6}
      offsetHeader={hs?.offsetHeader ?? true}
      height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'tall'}
      headingLevel={1}
      imagePriority={true} // homepage: improve LCP
      ariaLabel={t.ariaLabel}
    />
  )
}
