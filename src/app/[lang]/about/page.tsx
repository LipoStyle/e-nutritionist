import Hero from '@/app/components/shared/Hero/Hero'

import { aboutHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang)
  const t = aboutHeroTranslations[locale]

  return (
    <Hero
      description={t.description}
      message={t.message}
      ariaLabel={t.ariaLabel}
      bookText={t.bookText}
      bookHref={`/${locale}/book-consultation`}
      bgImage="/assets/images/hero/about.jpg"
      overlayOpacity={0.65}
      offsetHeader
      height="default"
    />
  )
}
