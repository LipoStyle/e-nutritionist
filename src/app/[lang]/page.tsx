import Hero from '@/app/components/shared/Hero/Hero'
import { resolveLocale } from './i18n/utils'
import { homeHeroTranslations } from './translations'
import { getHeroSettings } from '@/lib/hero' // <- helper we added earlier
import ServicesCarouselSection from '@/app/components/shared/ServiceCaruselSection/ServicesCarouselSection';
import HeroHome from '../components/shared/hero-home/HeroHome';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = homeHeroTranslations[locale]

  // DB row for (pageKey='home', language=locale). Might be null if not created yet.
  const hs = await getHeroSettings('home', locale)

  return (
    <>
    <HeroHome />
    </>
   
  )
}
