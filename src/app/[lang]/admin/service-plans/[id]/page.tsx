// src/app/[lang]/admin/service-plans/[id]/page.tsx
export const runtime = 'nodejs';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type Ctx = { lang: string; id: string };

// Explicit Prisma payload type with features included
type PlanWithFeatures = Prisma.ServicePlanGetPayload<{
  include: { features: { orderBy: { order: 'asc' } } };
}>;

export default async function ViewPlan({
  params,
}: {
  params: Promise<Ctx>;
}) {
  const { lang, id } = await params;

  // Ensure features are included and tell TS about it
  const item = (await prisma.servicePlan.findUnique({
    where: { id },
    include: { features: { orderBy: { order: 'asc' } } },
  })) as PlanWithFeatures | null;

  if (!item) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="flex gap-2">
          <Link
            className="px-3 py-2 rounded border"
            href={`/${lang}/admin/service-plans/${item.id}/edit`}
          >
            Edit
          </Link>
          <Link
            className="px-3 py-2 rounded border"
            href={`/${lang}/admin/service-plans`}
          >
            Back
          </Link>
        </div>
      </div>

      <section className="space-y-1">
        <div>
          Slug: <code>{item.slug}</code>
        </div>
        <div>Language: {item.language.toUpperCase()}</div>
        <div>Status: {item.isActive ? 'Active' : 'Hidden'}</div>
        <div>Order: {item.order}</div>
        <div>Price: €{(item.priceCents / 100).toFixed(2)}</div>
        {item.summary && <p>{item.summary}</p>}
      </section>

      <article className="prose dark:prose-invert">
        <pre className="whitespace-pre-wrap">{item.description}</pre>
      </article>

      {item.features && item.features.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mt-4 mb-2">Features</h2>
          <ol className="list-decimal pl-6 space-y-1">
            {item.features.map((f) => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
