// src/app/[lang]/admin/service-plans/[id]/page.tsx
export const runtime = 'nodejs';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import '../ServicePlansAdmin.css';          // optional: shared button styles
import './ServicePlanView.css';
import DeletePlanButton from '../DeletePlanButton';

type Lang = 'en' | 'es' | 'el';

function formatPrice(cents: number | null | undefined) {
  const value = typeof cents === 'number' ? cents : 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value / 100);
}

function isMissingTableError(e: unknown) {
  const code = (e as { code?: string } | null)?.code;
  const msg = String((e as { message?: string } | null)?.message ?? '').toLowerCase();
  return (
    code === 'P2021' ||
    msg.includes('does not exist') ||
    (msg.includes('relation') && msg.includes('does not exist'))
  );
}

export default async function ViewPlan({
  params,
}: {
  params: Promise<{ lang: Lang; id: string }>;
}) {
  const { lang, id } = await params;

  let item:
    | (Awaited<
        ReturnType<typeof prisma.servicePlan.findUnique>
      > & { language: Lang })
    | null = null;

  try {
    item = await prisma.servicePlan.findUnique({
      where: { id },
      include: { features: { orderBy: { order: 'asc' } } },
    });
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return (
        <div className="spv">
          <div className="spv__header">
            <h1 className="spv__title">Service Plan</h1>
            <Link className="sp-btn sp-btn--outline" href={`/${lang}/admin/service-plans`}>
              ← Back to plans
            </Link>
          </div>
          <div className="sp-alert sp-alert--warn">
            <p className="sp-alert__title">Database tables not found.</p>
            <p className="sp-alert__text">
              Run <code>npx prisma db push</code> (or apply your migrations).
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="spv">
        <div className="spv__header">
          <h1 className="spv__title">Service Plan</h1>
          <Link className="sp-btn sp-btn--outline" href={`/${lang}/admin/service-plans`}>
            ← Back to plans
          </Link>
        </div>
        <p className="sp-error">Failed to load: {String((e as { message?: string } | null)?.message ?? e)}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="spv">
        <div className="spv__header">
          <h1 className="spv__title">Service Plan</h1>
          <Link className="sp-btn sp-btn--outline" href={`/${lang}/admin/service-plans`}>
            ← Back to plans
          </Link>
        </div>
        <div className="sp-alert sp-alert--warn">
          <p className="sp-alert__title">Not found</p>
          <p className="sp-alert__text">The requested service plan does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spv">
      <div className="spv__header">
        <h1 className="spv__title">{item.title}</h1>
        <div className="spv__actions">
          <Link className="sp-btn sp-btn--outline" href={`/${lang}/admin/service-plans`}>
            ← Back
          </Link>
          <Link className="sp-btn sp-btn--primary" href={`/${lang}/admin/service-plans/${item.id}/edit`}>
            Edit
          </Link>
          <DeletePlanButton id={item.id} lang={item.language} />
        </div>
      </div>

      <div className="spv__meta">
        <div className="spv__meta-row">
          <span className="spv__meta-label">Slug</span>
          <code className="spv__meta-value">{item.slug}</code>
        </div>
        <div className="spv__meta-row">
          <span className="spv__meta-label">Language</span>
          <span className="spv__meta-value">{item.language.toUpperCase()}</span>
        </div>
        <div className="spv__meta-row">
          <span className="spv__meta-label">Status</span>
          <span className={`sp-chip ${item.isActive ? 'sp-chip--ok' : ''}`}>
            {item.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
        <div className="spv__meta-row">
          <span className="spv__meta-label">Order</span>
          <span className="spv__meta-value">{item.order}</span>
        </div>
        <div className="spv__meta-row">
          <span className="spv__meta-label">Price</span>
          <span className="spv__meta-value">{formatPrice(item.priceCents)}</span>
        </div>
        <div className="spv__meta-row">
          <span className="spv__meta-label">Updated</span>
          <span className="spv__meta-value" title={new Date(item.updatedAt).toLocaleString()}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {item.coverImage && (
        <div className="spv__cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.coverImage} alt="" />
        </div>
      )}

      {item.summary && <p className="spv__summary">{item.summary}</p>}

      <section className="spv__desc">
        <pre className="spv__pre">{item.description}</pre>
      </section>

      {item.features.length > 0 && (
        <section className="spv__features">
          <h2 className="spv__h2">Features</h2>
          <ol className="spv__feature-list">
            {item.features.map((f) => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
