import Hero from '@/app/components/shared/Hero/Hero'

import { bookingHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'

export default async function BookPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang)
  const t = bookingHeroTranslations[locale]

  return (
    <Hero
      description={t.description}
      message={t.message}
      ariaLabel={t.ariaLabel}
      bookText={t.bookText}
      bgImage="/assets/images/hero/book-consultation.jpg"
      overlayOpacity={0.55}
      offsetHeader
      height="default"
    />
  )
}
