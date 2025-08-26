// src/app/[lang]/admin/service-plans/page.tsx
export const runtime = 'nodejs';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import './ServicePlansAdmin.css';
import DeletePlanButton from './DeletePlanButton'; // ⬅️ add this

type Lang = 'en' | 'es' | 'el';

type ServicePlanListItem = {
  id: string;
  slug: string;
  title: string;
  priceCents: number | null;
  isActive: boolean;
  language: Lang;
  summary: string | null;
  coverImage: string | null;
  order: number;
  updatedAt: Date;
};

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

export default async function ServicePlansAdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let items: ServicePlanListItem[] | null = null;

  try {
    items = await prisma.servicePlan.findMany({
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        priceCents: true,
        isActive: true,
        language: true,
        summary: true,
        coverImage: true,
        order: true,
        updatedAt: true,
      },
    });
  } catch (e: unknown) {
    if (isMissingTableError(e)) {
      return (
        <div className="sp-admin">
          <div className="sp-header">
            <h1 className="sp-title">Service Plans</h1>
          </div>
          <div className="sp-alert sp-alert--warn">
            <p className="sp-alert__title">Database tables not found.</p>
            <p className="sp-alert__text">
              Run <code>npx prisma db push</code> (or generate a diff migration) for the DB this app is using.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="sp-admin">
        <div className="sp-header">
          <h1 className="sp-title">Service Plans</h1>
        </div>
        <p className="sp-error">
          Failed to load plans: {String((e as { message?: string } | null)?.message ?? e)}
        </p>
      </div>
    );
  }

  return (
    <div className="sp-admin">
      <div className="sp-header">
        <h1 className="sp-title">Service Plans</h1>
        <Link className="sp-btn sp-btn--primary" href={`/${lang}/admin/service-plans/new`}>
          + New plan
        </Link>
      </div>

      {!items || items.length === 0 ? (
        <div className="sp-empty">
          <p className="sp-empty__text">No service plans yet.</p>
          <Link className="sp-btn sp-btn--primary sp-empty__cta" href={`/${lang}/admin/service-plans/new`}>
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="sp-grid">
          {items.map((p) => (
            <div key={p.id} className="sp-card">
              <div className="sp-card__meta">
                <span className="sp-card__lang">{p.language.toUpperCase()} • Order {p.order}</span>
                <span title={new Date(p.updatedAt).toLocaleString()}>
                  {p.isActive ? <span className="sp-status sp-status--active">● Active</span> : <span className="sp-status">● Hidden</span>}
                </span>
              </div>

              <h3 className="sp-card__title">{p.title}</h3>
              <div className="sp-card__price">{formatPrice(p.priceCents)}</div>

              {p.summary && <p className="sp-card__summary">{p.summary}</p>}

              <div className="sp-card__actions">
                <Link href={`/${lang}/admin/service-plans/${p.id}`} className="sp-btn sp-btn--outline">
                  View
                </Link>
                <Link href={`/${lang}/admin/service-plans/${p.id}/edit`} className="sp-btn sp-btn--outline">
                  Edit
                </Link>
                <DeletePlanButton id={p.id} lang={p.language} /> {/* ⬅️ NEW */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
