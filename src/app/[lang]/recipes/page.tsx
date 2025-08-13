// src/app/[lang]/recipes/page.tsx
import Hero from '@/app/components/shared/Hero/Hero'
import { recipesHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'

export default async function RecipesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = recipesHeroTranslations[locale]

  const hs = await getHeroSettings('recipes', locale)

  return (
    <Hero
      title={hs?.title || undefined}
      description={hs?.description ?? t.description}
      message={hs?.message ?? t.message}
      bookText={hs?.bookText ?? t.bookText}
      bookHref={hs?.bookHref ?? `/${locale}/book-consultation`}
      bgImage={hs?.bgImage ?? '/assets/images/hero/recipes.jpg'}
      overlayOpacity={hs?.overlayOpacity ?? 0.6}
      offsetHeader={hs?.offsetHeader ?? true}
      height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
      headingLevel={1}
      imagePriority={false}
      ariaLabel={t.ariaLabel}
    />
  )
}
