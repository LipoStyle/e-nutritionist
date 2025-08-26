// src/app/[lang]/admin/service-plans/[id]/edit/EditServicePlanClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import '../../ServicePlansAdmin.css';
import './EditServicePlan.css';

type Lang = 'en' | 'es' | 'el';

type EditState = {
  language: Lang;
  slug: string;
  title: string;
  summary: string;
  description: string;
  price: string;         // display € string
  coverImage: string;
  order: number;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  featuresText: string;  // textarea; one per line
};

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);
}

export default function EditServicePlanClient({ lang, id }: { lang: Lang; id: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<EditState | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldIssues, setFieldIssues] = useState<string[] | null>(null);

  // Load item
  useEffect(() => {
    (async () => {
      setErr(null);
      setFieldIssues(null);
      setLoading(true);

      const res = await fetch(`/api/admin/service-plans/${id}`, { credentials: 'include' });

      if (res.status === 401) {
        const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans/${id}/edit`);
        router.push(`/${lang}/admin?from=${from}`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
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
        featuresText: (p.features || []).map((f: any) => f.name).join('\n'),
      });
      setLoading(false);
    })();
  }, [id, lang, pathname, router]);

  const priceCents = useMemo(
    () => Math.round((parseFloat(form?.price || '0') || 0) * 100),
    [form?.price]
  );

  if (loading) {
    return (
      <div className="esp">
        <div className="esp__title">Edit Service Plan</div>
        <div>Loading…</div>
      </div>
    );
  }
  if (!form) {
    return (
      <div className="esp">
        <div className="esp__title">Edit Service Plan</div>
        <div>{err || 'Not found'}</div>
      </div>
    );
  }

  async function handleSave() {
    if (!form) return; // TS guard (shouldn’t hit due to early returns above)
    setSaving(true);
    setErr(null);
    setFieldIssues(null);
    try {
      const features =
        (form.featuresText || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((name, i) => ({ name, order: i + 1 }));

      const res = await fetch(`/api/admin/service-plans/${id}`, {
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
        const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans/${id}/edit`);
        router.push(`/${lang}/admin?from=${from}`);
        return;
      }

      if (res.status === 422) {
        const j = await res.json().catch(() => null);
        const issues: string[] =
          j?.issues?.map((i: any) => (i?.message ? `${i.path?.join('.') || ''}: ${i.message}` : 'Invalid input')) ??
          [j?.error || 'Validation error'];
        setFieldIssues(issues);
        throw new Error('Please correct the highlighted fields.');
      }

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || 'Update failed');
      }

      const nextLang = form.language || lang;
      router.replace(`/${nextLang}/admin/service-plans?updated=1`);
    } catch (e: any) {
      setErr(e?.message || 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const nextLang = form?.language || lang; // guard
    if (!confirm('Delete this service plan?')) return;
    const res = await fetch(`/api/admin/service-plans/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.status === 401) {
      const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans/${id}/edit`);
      router.push(`/${lang}/admin?from=${from}`);
      return;
    }
    if (res.ok) {
      router.replace(`/${nextLang}/admin/service-plans?deleted=1`);
    } else {
      setErr('Delete failed');
    }
  }

  return (
    <div className="esp">
      <div className="esp__header">
        <h1 className="esp__title">Edit Service Plan</h1>
        <div className="esp__actions">
          <button className="sp-btn sp-btn--outline" onClick={() => router.back()}>← Back</button>
          <button className="sp-btn sp-btn--danger" onClick={handleDelete}>Delete</button>
          <button className="sp-btn sp-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {err && <div className="esp-alert esp-alert--error">{err}</div>}
      {fieldIssues && fieldIssues.length > 0 && (
        <div className="esp-alert esp-alert--error">
          <ul className="esp-list">
            {fieldIssues.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="esp-form">
        <label className="esp-field">
          <span className="esp-label">Language</span>
          <input disabled className="esp-input esp-input--ro" value={form.language} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Title</span>
          <input className="esp-input" value={form.title}
                 onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Slug</span>
          <input className="esp-input" value={form.slug}
                 onChange={(e) => setForm({ ...form, slug: toSlug(e.target.value) })} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Summary</span>
          <input className="esp-input" value={form.summary}
                 onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Description</span>
          <textarea className="esp-textarea esp-textarea--lg" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Price (€)</span>
          <input type="number" step="0.01" className="esp-input" value={form.price}
                 onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <small className="esp-hint">= {priceCents} cents</small>
        </label>

        <label className="esp-field">
          <span className="esp-label">Cover image URL</span>
          <input className="esp-input" value={form.coverImage}
                 onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
        </label>

        <div className="esp-row">
          <label className="esp-field">
            <span className="esp-label">Order</span>
            <input type="number" className="esp-input" value={form.order}
                   onChange={(e) => setForm({ ...form, order: Number(e.target.value || 1) })} />
          </label>

          <label className="esp-checkbox">
            <input type="checkbox" checked={form.isActive}
                   onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            <span>Active</span>
          </label>
        </div>

        <label className="esp-field">
          <span className="esp-label">Meta title</span>
          <input className="esp-input" value={form.metaTitle}
                 onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Meta description</span>
          <input className="esp-input" value={form.metaDescription}
                 onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
        </label>

        <label className="esp-field">
          <span className="esp-label">Features (one per line — replaces existing)</span>
          <textarea className="esp-textarea" value={form.featuresText}
                    onChange={(e) => setForm({ ...form, featuresText: e.target.value })} />
        </label>
      </div>
    </div>
  );
}
