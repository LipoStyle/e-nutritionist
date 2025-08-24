import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const runtime = 'nodejs';

export const metadata: Metadata = { title: 'Admin • Service Plans' };

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format((cents || 0) / 100);
}

export default async function ServicePlansAdminPage({ params }: { params: { lang: string } }) {
  const items = await prisma.servicePlan.findMany({
    orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
    select: {
      id: true, slug: true, title: true, priceCents: true, isActive: true,
      language: true, summary: true, coverImage: true, order: true, updatedAt: true,
    },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Service Plans</h1>
        <Link className="px-3 py-2 rounded bg-black text-white" href={`/${params.lang}/admin/service-plans/new`}>
          + New plan
        </Link>
      </div>

      {items.length === 0 ? (
        <p>No service plans yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl border p-4 shadow-sm bg-white/50 dark:bg-white/5">
              <div className="text-xs opacity-70">{p.language.toUpperCase()} • Order {p.order}</div>
              <h3 className="text-lg font-medium mt-1">{p.title}</h3>
              <div className="mt-1">
                {formatPrice(p.priceCents)}{' '}
                {p.isActive ? <span className="ml-2 text-green-600">● Active</span> : <span className="ml-2 text-gray-500">● Hidden</span>}
              </div>
              {p.summary && <p className="mt-2 line-clamp-2 text-sm opacity-80">{p.summary}</p>}
              <div className="mt-4 flex gap-2">
                <Link href={`/${params.lang}/admin/service-plans/${p.id}`} className="px-2 py-1 rounded border">View</Link>
                <Link href={`/${params.lang}/admin/service-plans/${p.id}/edit`} className="px-2 py-1 rounded border">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
