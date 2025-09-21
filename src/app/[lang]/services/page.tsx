export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import Hero from '@/app/components/shared/Hero/Hero';
import { resolveLocale } from '../i18n/utils';
import { getHeroSettings } from '@/lib/hero';
import { prisma } from '@/lib/prisma';
import './PublicPlans.css';

type Lang = 'en' | 'es' | 'el';

type PublicPlan = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  priceCents: number;
  order: number;
  features: { id: string; name: string; order: number }[];
};

function formatAmount(cents?: number | null) {
  const whole = Math.round((cents ?? 0) / 100);
  return `${whole}€`;
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang) as Lang;

  // Pull hero copy for "services" (fallbacks if not configured)
  const hs = await getHeroSettings('services', locale);
  const bookingHref = hs?.bookHref ?? `/${locale}/contact`;

  // Load active plans for the current language
  let plans: PublicPlan[] = [];
  try {
    plans = await prisma.servicePlan.findMany({
      where: { language: locale, isActive: true },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        priceCents: true,
        order: true,
        features: {
          orderBy: { order: 'asc' },
          select: { id: true, name: true, order: true },
        },
      },
    });
  } catch {
    plans = [];
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

      <section className="service-plans-container">
        <div className="service-plans-grid">
          {plans.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.8 }}>
              Plans are coming soon. Check back shortly!
            </div>
          ) : (
            plans.map((p) => (
              <article key={p.id} className="service-card" tabIndex={0}>
                <h3 className="service-title">{p.title}</h3>

                <div className="service-price">{formatAmount(p.priceCents)}</div>

                <div className="seperator-line" />

                {p.features.length > 0 && (
                  <ul className="features-list" aria-label="Included features">
                    {p.features.map((f) => (
                      <li key={f.id} className="feature-item">
                        <span className="feature-tick" aria-hidden>
                          ✓
                        </span>
                        <span className="feature-name">{f.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {p.summary && <p className="service-description">{p.summary}</p>}

                <Link href={`${bookingHref}?plan=${encodeURIComponent(p.slug)}`} className="cta-button">
                  Book now
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
