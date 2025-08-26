// src/app/[lang]/recipes/page.tsx
export const runtime = 'nodejs';
export const revalidate = 0;

import Link from 'next/link';
import Hero from '@/app/components/shared/Hero/Hero';
import { serviceHeroTranslations } from './translations';
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
  coverImage: string | null;
  order: number;
  features: { id: string; name: string; order: number }[];
};

function formatPrice(cents: number | null | undefined) {
  const value = typeof cents === 'number' ? cents : 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value / 100);
}

export default async function RecipesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang) as Lang;
  const t = serviceHeroTranslations[locale];

  const hs = await getHeroSettings('recipes', locale);
  const bookingHref = hs?.bookHref ?? `/${locale}/book-consultation`;

  let plans: PublicPlan[] = [];
  try {
    plans = await prisma.servicePlan.findMany({
      where: { language: locale, isActive: true },
      orderBy: [{ order: 'asc' }, { priceCents: 'asc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        priceCents: true,
        coverImage: true,
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
        title={hs?.title || undefined}
        description={hs?.description ?? t.description}
        message={hs?.message ?? t.message}
        bookText={hs?.bookText ?? t.bookText}
        bookHref={bookingHref}
        bgImage={hs?.bgImage ?? '/assets/images/hero/recipes.jpg'}
        overlayOpacity={hs?.overlayOpacity ?? 0.6}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
        headingLevel={1}
        imagePriority={false}
        ariaLabel={t.ariaLabel}
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
                {/* Optional image on top */}
                {p.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverImage}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }}
                  />
                )}

                <h3 className="service-title">{p.title}</h3>

                <div className="service-price">
                  {formatPrice(p.priceCents)} <span>EUR</span>
                </div>

                <div className="seperator-line" />

                {p.features.length > 0 && (
                  <ul className="features-list">
                    {p.features.map((f) => (
                      <li key={f.id} className="feature-item">
                        <span className="feature-tick">✓</span>
                        <span className="feature-name">{f.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {p.summary && <p className="service-description">{p.summary}</p>}

                <Link
                  href={`${bookingHref}?plan=${encodeURIComponent(p.slug)}`}
                  className="cta-button"
                >
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
