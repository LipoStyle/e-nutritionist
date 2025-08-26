'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import './NewServicePlan.css';

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

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);
}

function parseErr(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  return 'Error';
}

export default function NewServicePlanClient({ lang }: { lang: Lang }) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  const initialLang: Lang = (() => {
    const q = (sp.get('lang') || lang) as Lang;
    return (LANGS as readonly string[]).includes(q) ? q : 'en';
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

  // For showing Zod field errors (422)
  const [fieldIssues, setFieldIssues] = useState<string[] | null>(null);

  const priceCents = useMemo(
    () => Math.round((parseFloat(form.price || '0') || 0) * 100),
    [form.price]
  );

  const safeLang: Lang = form.language || initialLang || 'en';

  async function handleCreate() {
    setSaving(true);
    setErr(null);
    setFieldIssues(null);
    try {
      // Convert featuresText -> features[]
      const features = (form.featuresText || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, idx) => ({ name, order: idx + 1 }));

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
          features, // ✅ send the array the API expects
          // NOTE: do NOT send featuresText — Zod .strict() would reject unknown keys
        }),
      });

      if (res.status === 401) {
        const from = encodeURIComponent(pathname || `/${safeLang}/admin/service-plans/new`);
        router.push(`/${safeLang}/admin?from=${from}`);
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
        throw new Error(j?.error || 'Failed to create');
      }

      // ✅ Success
      router.replace(`/${safeLang}/admin/service-plans?created=1`);
    } catch (e: unknown) {
      setErr(parseErr(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nsp">
      <h1 className="nsp__title">Create Service Plan</h1>

      {err && (
        <div className="nsp-alert nsp-alert--error" role="alert">
          {err}
        </div>
      )}

      {fieldIssues && fieldIssues.length > 0 && (
        <div className="nsp-alert nsp-alert--error" role="alert">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {fieldIssues.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="nsp-form">
        <label className="nsp-field">
          <span className="nsp-label">Language</span>
          <select
            value={form.language}
            onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as Lang }))}
            className="nsp-input"
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Title</span>
          <input
            className="nsp-input"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: f.slug ? f.slug : toSlug(title) }));
            }}
          />
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Slug</span>
          <input
            className="nsp-input"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))}
          />
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Summary (card blurb, ~200 chars)</span>
          <input
            className="nsp-input"
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          />
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Description</span>
          <textarea
            className="nsp-textarea nsp-textarea--lg"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Price (€)</span>
          <input
            type="number"
            step="0.01"
            className="nsp-input"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <small className="nsp-hint">= {priceCents} cents</small>
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Cover image URL</span>
          <input
            className="nsp-input"
            value={form.coverImage}
            onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
          />
        </label>

        <div className="nsp-row">
          <label className="nsp-field">
            <span className="nsp-label">Order</span>
            <input
              type="number"
              className="nsp-input"
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({ ...f, order: Number(e.target.value || 1) }))
              }
            />
          </label>

          <label className="nsp-checkbox">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            <span>Active</span>
          </label>
        </div>

        <label className="nsp-field">
          <span className="nsp-label">Meta title</span>
          <input
            className="nsp-input"
            value={form.metaTitle}
            onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
          />
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Meta description</span>
          <input
            className="nsp-input"
            value={form.metaDescription}
            onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
          />
        </label>

        <label className="nsp-field">
          <span className="nsp-label">Features (one per line)</span>
          <textarea
            className="nsp-textarea"
            value={form.featuresText}
            onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
          />
        </label>

        <div className="nsp-actions">
          <button className="nsp-btn nsp-btn--primary" disabled={saving} onClick={handleCreate}>
            {saving ? 'Creating…' : 'Create'}
          </button>
          <button className="nsp-btn nsp-btn--outline" onClick={() => history.back()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
