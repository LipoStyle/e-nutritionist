// app/[lang]/page.tsx
import HeroHome from '../components/shared/hero-home/HeroHome'
import HomeServices from '../components/shared/home-services/HomeServices'
import HomeAbout from '../components/shared/home-about/HomeAbout'
import { resolveLocale } from './i18n/utils'
import { getHeroSettings } from '@/lib/hero'
import TrainingRecipe from '../components/shared/home-training-recipe/TrainingRecipe'

type Lang = 'en' | 'es' | 'el'
type PageProps = { params: { lang: Lang } }

export default async function HomePage(props: PageProps | Promise<PageProps>) {
  // ✅ Handles both: plain object in prod, promise-wrapped in dev replay
  const { params } = await Promise.resolve(props)
  const lang = params.lang
  const locale = resolveLocale(lang) as Lang

  // real async work (DB/API)
  await getHeroSettings('home', locale)

  return (
    <>
      <HeroHome lang={locale} />
      <HomeServices lang={locale} />
      <HomeAbout lang={locale} />
      <TrainingRecipe lang={locale} />
    </>
  )
}
