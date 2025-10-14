// app/[lang]/page.tsx
import HeroHome from '../components/shared/hero-home/HeroHome'
import HomeServices from '../components/shared/home-services/HomeServices'
import HomeAbout from '../components/shared/home-about/HomeAbout'
import TrainingRecipe from '../components/shared/home-training-recipe/TrainingRecipe'
import CTABanner from '../components/shared/cta-banner/CTABanner'

import { resolveLocale } from './i18n/utils'
import { getHeroSettings } from '@/lib/hero'

type Lang = 'en' | 'es' | 'el'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>
}) {
  const { lang } = await params
  const locale = resolveLocale(lang) as Lang
  await getHeroSettings('home', locale)
  return (
    <>
      <HeroHome lang={locale} />
      <HomeServices lang={locale} />
      <HomeAbout lang={locale} />
      <TrainingRecipe lang={locale} />
      <CTABanner lang={locale} />
    </>
  )
}


// (Optional but nice: pre-generate the three locale routes)
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }, { lang: 'el' }]
}
