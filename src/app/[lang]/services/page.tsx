import Hero from '@/app/components/shared/Hero/Hero'

import { serviceHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang)
  const t = serviceHeroTranslations[locale]

  return (
    <Hero
      description={t.description}
      message={t.message}
      ariaLabel={t.ariaLabel}
      bookText={t.bookText}
      bookHref={`/${locale}/book-consultation`}
      bgImage="/assets/images/hero/services.jpg"
      overlayOpacity={0.6}
      offsetHeader
      height="default"
    />
  )
}
