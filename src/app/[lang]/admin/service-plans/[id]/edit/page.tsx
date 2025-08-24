'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Lang = 'en' | 'es' | 'el';

type EditState = {
  language: Lang;
  slug: string;
  title: string;
  summary: string;
  description: string;
  price: string; // display
  coverImage: string;
  order: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  featuresText: string;
};

export default function EditPlan({ params }: { params: { lang: Lang; id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<EditState | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setErr(null);
      const res = await fetch(`/api/admin/service-plans/${params.id}`, { credentials: 'include' });
      if (res.status === 401) {
        router.push(`/${params.lang}/admin/login?from=/${params.lang}/admin/service-plans/${params.id}/edit`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data?.error || 'Failed to load');
        setLoading(false);
        return;
      }
      const p = data.item;
      setForm({
        language: p.language,
        slug: p.slug,
        title: p.title,
        summary: p.summary || '',
        description: p.description,
        price: (p.priceCents / 100).toFixed(2),
        coverImage: p.coverImage || '',
        order: p.order,
        isActive: p.isActive,
        metaTitle: p.metaTitle || '',
        metaDescription: p.metaDescription || '',
        featuresText: p.features.map((f: any) => f.name).join('\n'),
      });
      setLoading(false);
    })();
  }, [params.id, params.lang, router]);

  const priceCents = useMemo(
    () => Math.round((parseFloat(form?.price || '0') || 0) * 100),
    [form?.price],
  );

  if (loading) return <div className="p-6">Loading…</div>;
  if (!form) return <div className="p-6">{err || 'Not found'}</div>;

  async function handleSave() {
    setSaving(true);
    setErr(null);
    try {
      const features = form.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, i) => ({ name, order: i + 1 }));

      const res = await fetch(`/api/admin/service-plans/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          language: form.language,
          slug: form.slug,
          title: form.title,
          summary: form.summary || null,
          description: form.description,
          priceCents,
          coverImage: form.coverImage || null,
          order: form.order,
          isActive: form.isActive,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
          features,
        }),
      });

      if (res.status === 401) {
        router.push(`/${params.lang}/admin/login?from=/${params.lang}/admin/service-plans/${params.id}/edit`);
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || 'Update failed');
      }
      router.push(`/${params.lang}/admin/service-plans`);
    } catch (e: any) {
      setErr(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this service plan?')) return;
    const res = await fetch(`/api/admin/service-plans/${params.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.status === 401) {
      router.push(`/${params.lang}/admin/login?from=/${params.lang}/admin/service-plans/${params.id}/edit`);
      return;
    }
    if (res.ok || res.status === 204) router.push(`/${params.lang}/admin/service-plans`);
    else setErr('Delete failed');
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Service Plan</h1>

      {err && <div className="mb-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{err}</div>}

      <div className="grid gap-4">
        <label className="grid gap-1">
          <span>Language</span>
          <input disabled className="border rounded px-2 py-1 bg-gray-100 dark:bg-gray-800" value={form.language} />
        </label>

        <label className="grid gap-1">
          <span>Title</span>
          <input className="border rounded px-2 py-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>

        <label className="grid gap-1">
          <span>Slug</span>
          <input className="border rounded px-2 py-1" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })} />
        </label>

        <label className="grid gap-1">
          <span>Summary</span>
          <input className="border rounded px-2 py-1" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </label>

        <label className="grid gap-1">
          <span>Description</span>
          <textarea className="border rounded px-2 py-2 min-h-[140px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <div className="grid gap-1">
          <span>Price (€)</span>
          <input type="number" step="0.01" className="border rounded px-2 py-1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>

        <label className="grid gap-1">
          <span>Cover image URL</span>
          <input className="border rounded px-2 py-1" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span>Order</span>
            <input type="number" className="border rounded px-2 py-1" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value || 1) })} />
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <span>Active</span>
          </label>
        </div>

        <label className="grid gap-1">
          <span>Meta title</span>
          <input className="border rounded px-2 py-1" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
        </label>

        <label className="grid gap-1">
          <span>Meta description</span>
          <input className="border rounded px-2 py-1" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
        </label>

        <label className="grid gap-1">
          <span>Features (one per line — replaces existing)</span>
          <textarea className="border rounded px-2 py-2 min-h-[120px]" value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} />
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-black text-white disabled:opacity-60" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="px-4 py-2 rounded border" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
