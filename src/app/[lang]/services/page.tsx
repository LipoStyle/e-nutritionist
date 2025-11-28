export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

import Hero from '@/app/components/shared/Hero/Hero'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'
import { prisma } from '@/lib/prisma'
import ServiceCardsClient from './ServiceCardsClient'

type Lang = 'en' | 'es' | 'el'

export type PublicPlan = {
  id: string
  slug: string
  title: string
  description: string | null
  summary?: string | null
  priceCents: number
  order: number
  features: { id: string; name: string; order: number }[]
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = resolveLocale(lang) as Lang

  // Pull hero copy for "services"
  const hs = await getHeroSettings('services', locale)
  const bookingHref = hs?.bookHref ?? `/${locale}/contact`

  // Load active plans for the current language
  let plans: PublicPlan[] = []
  try {
    plans = await prisma.servicePlan.findMany({
      where: { language: locale, isActive: true },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        description: true,
        priceCents: true,
        order: true,
        features: { orderBy: { order: 'asc' }, select: { id: true, name: true, order: true } },
      },
    })
  } catch {
    plans = []
  }

  return (
    <>
      <Hero
        title={hs?.title || 'Service Plans'}
        description={hs?.description ?? 'Choose the plan that fits your goals.'}
        message={hs?.message ?? ''}
        bookText={hs?.bookText ?? 'Book a Consultation'}
        bookHref={bookingHref}
        bgImage={hs?.bgImage ?? '/assets/images/hero/services.jpg'}
        overlayOpacity={hs?.overlayOpacity ?? 0.6}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
        headingLevel={1}
        imagePriority={false}
        ariaLabel="Services hero"
      />

      {/* Pass plans and bookingHref to the client component */}
      <ServiceCardsClient plans={plans} bookingHref={bookingHref} />
    </>
  )
}
