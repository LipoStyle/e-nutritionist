'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

const LANGS = ['en', 'es', 'el'] as const;
type Lang = typeof LANGS[number];

type FormState = {
  language: Lang;
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: string; // € string -> convert to cents
  coverImage: string;
  order: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  featuresText: string; // one per line
};

export default function NewServicePlan({ params }: { params: { lang: Lang } }) {
  const router = useRouter();
  const sp = useSearchParams();

  const initialLang = ((): Lang => {
    const q = (sp.get('lang') || params.lang) as Lang;
    return LANGS.includes(q) ? q : 'en';
  })();

  const [form, setForm] = useState<FormState>({
    language: initialLang,
    title: '',
    slug: '',
    summary: '',
    description: '',
    price: '60.00',
    coverImage: '',
    order: 1,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    featuresText: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toSlug(s: string) {
    return s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 64);
  }

  const priceCents = useMemo(() => Math.round((parseFloat(form.price || '0') || 0) * 100), [form.price]);

  async function handleCreate() {
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/service-plans', {
        method: 'POST',
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
          featuresText: form.featuresText,
        }),
      });

      if (res.status === 401) {
        router.push(`/${params.lang}/admin/login?from=/${params.lang}/admin/service-plans/new`);
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || 'Failed to create');
      }
      router.push(`/${form.language}/admin/service-plans`);
    } catch (e: any) {
      setErr(e.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create Service Plan</h1>

      {err && <div className="mb-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{err}</div>}

      <div className="grid gap-4">
        <label className="grid gap-1">
          <span>Language</span>
          <select
            value={form.language}
            onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as Lang }))}
            className="border rounded px-2 py-1"
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span>Title</span>
          <input
            className="border rounded px-2 py-1"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: f.slug ? f.slug : toSlug(title) }));
            }}
          />
        </label>

        <label className="grid gap-1">
          <span>Slug</span>
          <input
            className="border rounded px-2 py-1"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))}
          />
        </label>

        <div className="grid gap-1">
          <span>Summary (card blurb, ~200 chars)</span>
          <input
            className="border rounded px-2 py-1"
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          />
        </div>

        <div className="grid gap-1">
          <span>Description</span>
          <textarea
            className="border rounded px-2 py-2 min-h-[140px]"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="grid gap-1">
          <span>Price (€)</span>
          <input
            type="number"
            step="0.01"
            className="border rounded px-2 py-1"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <small className="opacity-70">= {priceCents} cents</small>
        </div>

        <label className="grid gap-1">
          <span>Cover image URL</span>
          <input
            className="border rounded px-2 py-1"
            value={form.coverImage}
            onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span>Order</span>
            <input
              type="number"
              className="border rounded px-2 py-1"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value || 1) }))}
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            <span>Active</span>
          </label>
        </div>

        <label className="grid gap-1">
          <span>Meta title</span>
          <input
            className="border rounded px-2 py-1"
            value={form.metaTitle}
            onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
          />
        </label>

        <label className="grid gap-1">
          <span>Meta description</span>
          <input
            className="border rounded px-2 py-1"
            value={form.metaDescription}
            onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
          />
        </label>

        <label className="grid gap-1">
          <span>Features (one per line)</span>
          <textarea
            className="border rounded px-2 py-2 min-h-[120px]"
            value={form.featuresText}
            onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
          />
        </label>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            disabled={saving}
            onClick={handleCreate}
          >
            {saving ? 'Creating…' : 'Create'}
          </button>
          <button className="px-4 py-2 rounded border" onClick={() => history.back()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
