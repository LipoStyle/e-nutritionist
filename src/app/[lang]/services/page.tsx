import Hero from '@/app/components/shared/Hero/Hero'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'
import { prisma } from '@/lib/prisma'
import ServiceCardsClient from './ServiceCardsClient'

type Lang = 'en' | 'es' | 'el'

export default async function ServicesPage({ params }: { params: { lang: string } }) {
  const { lang } = params
  const locale = resolveLocale(lang) as Lang

  const hs = await getHeroSettings('services', locale)

  let plans = []
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

  const bookingHref = hs?.bookHref ?? `/${locale}/contact`

  return (
    <>
      <Hero
        title={hs?.title || 'Service Plans'}
        description={hs?.description ?? 'Choose the plan that fits your goals.'}
        message={hs?.message ?? ''}
        bookText={hs?.bookText ?? 'Book a Consultation'}
        bookHref={
          'https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA='
        }
        bgImage={hs?.bgImage ?? '/assets/images/hero/services.jpg'}
        overlayOpacity={hs?.overlayOpacity ?? 0.6}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
        headingLevel={1}
        imagePriority={false}
        ariaLabel="Services hero"
      />

      <ServiceCardsClient plans={plans} bookingHref={bookingHref} />
    </>
  )
}
