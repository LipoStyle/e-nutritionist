import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export default async function ViewPlan({ params }: { params: { lang: string; id: string } }) {
  const item = await prisma.servicePlan.findUnique({
    where: { id: params.id },
    include: { features: { orderBy: { order: 'asc' } } },
  });
  if (!item) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <Link className="px-3 py-2 rounded border" href={`/${params.lang}/admin/service-plans/${item.id}/edit`}>
          Edit
        </Link>
      </div>
      <div>Slug: <code>{item.slug}</code></div>
      <div>Language: {item.language.toUpperCase()}</div>
      <div>Status: {item.isActive ? 'Active' : 'Hidden'}</div>
      <div>Order: {item.order}</div>
      <div>Price: €{(item.priceCents / 100).toFixed(2)}</div>
      {item.summary && <p>{item.summary}</p>}
      <article className="prose dark:prose-invert">
        <pre className="whitespace-pre-wrap">{item.description}</pre>
      </article>
      {item.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Features</h2>
          <ol className="list-decimal pl-6 space-y-1">
            {item.features.map((f) => <li key={f.id}>{f.name}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
