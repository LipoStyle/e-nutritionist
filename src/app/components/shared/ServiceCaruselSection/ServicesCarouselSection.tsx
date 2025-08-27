// Server Component (SSR data fetch)
export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import { resolveLocale } from '@/app/[lang]/i18n/utils';
import './ServicesCarousel.css';
import ServicesCarouselClient from './ServicesCarouselClient';
import { getServicesCarouselStrings } from './translations';

type Lang = 'en' | 'es' | 'el';

type PublicPlan = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  order: number;
};

export default async function ServicesCarouselSection({
  params,
  title, // optional override
}: {
  params: Promise<{ lang: string }>;
  title?: string;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang) as Lang;

  // i18n strings (fallback handled inside helper)
  const t = getServicesCarouselStrings(locale);
  const heading = title ?? t.title;

  const bookingHref = `/${locale}/book-consultation`;

  let plans: PublicPlan[] = [];
  try {
    plans = await prisma.servicePlan.findMany({
      where: { language: locale, isActive: true },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      select: { id: true, slug: true, title: true, summary: true, order: true },
    });
  } catch {
    plans = [];
  }

  if (!plans.length) return null;

  return (
    <section className="carusel-section-services" aria-label="Service plans carousel">
      <h2 className="animated-title animate">{heading}</h2>
      <ServicesCarouselClient plans={plans} bookingHref={bookingHref} />
    </section>
  );
}
