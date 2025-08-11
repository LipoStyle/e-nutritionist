import Hero from '@/app/components/shared/Hero/Hero'

import { recipesHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'

export default async function RecipesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang)
  const t = recipesHeroTranslations[locale]

  return (
    <Hero
      description={t.description}
      message={t.message}
      ariaLabel={t.ariaLabel}
      bookText={t.bookText}
      bookHref={`/${locale}/book-consultation`}
      bgImage="/assets/images/hero/recipes.jpg"
      overlayOpacity={0.6}
      offsetHeader
      height="default"
    />
  )
}
