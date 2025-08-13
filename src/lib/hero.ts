import { prisma } from './prisma'

export type PageKey =
  | 'home'
  | 'about'
  | 'services'
  | 'recipes'
  | 'blogs'
  | 'contact'
  | 'booking'

export async function getHeroSettings(pageKey: PageKey, language: 'en' | 'es' | 'el') {
  // Using findFirst avoids relying on the composite-unique selector name
  return prisma.heroSetting.findFirst({
    where: { pageKey, language },
  })
}
