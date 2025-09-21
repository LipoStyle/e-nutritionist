'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import './NewServicePlan.css';

type Lang = 'en' | 'es' | 'el';

type FeatureRow = { id?: string; name: string; order: number };

type FormState = {
  title: string;
  summary: string;
  description: string;
  price: string;          // euros string -> number
  billingPeriod: string;  // "one-time", "month", "3 months", ...
  order: number;
  isActive: boolean;
  features: FeatureRow[];
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
  const pathname = usePathname();

  const [form, setForm] = useState<FormState>({
    title: '',
    summary: '',
    description: '',
    price: '60.00',
    billingPeriod: 'one-time',
    order: 1,
    isActive: true,
    features: [{ name: '', order: 1 }],
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldIssues, setFieldIssues] = useState<string[] | null>(null);

  const priceCents = useMemo(
    () => Math.round((parseFloat(form.price || '0') || 0) * 100),
    [form.price]
  );
  const priceNumber = useMemo(
    () => (Number.isFinite(parseFloat(form.price)) ? parseFloat(form.price) : 0),
    [form.price]
  );

  // --- Features editor helpers
  function renumber(features: FeatureRow[]) {
    return features.map((f, i) => ({ ...f, order: i + 1 }));
  }
  function setFeatureName(idx: number, name: string) {
    setForm((f) => {
      const next = [...f.features];
      next[idx] = { ...next[idx], name };
      return { ...f, features: next };
    });
  }
  function addFeature(afterIndex?: number) {
    setForm((f) => {
      const next = [...f.features];
      const insertAt = typeof afterIndex === 'number' ? afterIndex + 1 : next.length;
      next.splice(insertAt, 0, { name: '', order: insertAt + 1 });
      return { ...f, features: renumber(next) };
    });
  }
  function removeFeature(idx: number) {
    setForm((f) => {
      const next = [...f.features];
      next.splice(idx, 1);
      return { ...f, features: renumber(next.length ? next : [{ name: '', order: 1 }]) };
    });
  }
  function moveFeature(idx: number, dir: -1 | 1) {
    setForm((f) => {
      const next = [...f.features];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return f;
      const [row] = next.splice(idx, 1);
      next.splice(j, 0, row);
      return { ...f, features: renumber(next) };
    });
  }

  async function handleCreate() {
    setSaving(true);
    setErr(null);
    setFieldIssues(null);
    try {
      const features = form.features
        .map((r, idx) => ({ name: r.name.trim(), order: idx + 1 }))
        .filter((r) => r.name.length > 0);

      // slug is generated behind the scenes from title (DB/API still require it)
      const slug = toSlug(form.title);

      const res = await fetch('/api/admin/service-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          language: lang,                           // auto from route
          slug,                                     // generated, no UI
          title: form.title,
          summary: form.summary || null,
          description: form.description,
          price: priceNumber,                       // euros
          billing_period: form.billingPeriod || null,
          order: form.order,
          is_active: form.isActive,
          features,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans/new`);
        router.push(`/${lang}/admin/login?from=${from}`);
        return;
      }

      if (res.status === 400 || res.status === 422) {
        const j = await res.json().catch(() => null);
        const issues: string[] =
          j?.issues?.map((i: any) =>
            i?.message ? `${(i.path?.join?.('.') || '')}: ${i.message}` : 'Invalid input'
          ) ?? [j?.error || 'Validation error'];
        setFieldIssues(issues);
        throw new Error('Please correct the highlighted fields.');
      }

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Failed to create (${res.status})`);
      }

      router.replace(`/${lang}/admin/service-plans?created=1`);
    } catch (e: unknown) {
      setErr(parseErr(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nsp">
      <h1 className="nsp__title">Create Service Plan</h1>

      {err && <div className="nsp-alert nsp-alert--error" role="alert">{err}</div>}

      {fieldIssues && fieldIssues.length > 0 && (
        <div className="nsp-alert nsp-alert--error" role="alert">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {fieldIssues.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="nsp-form">
        {/* Language is auto from route; show read-only chip if you want */}
        {/* <div className="nsp-field"><span className="nsp-label">Language</span><div>{lang.toUpperCase()}</div></div> */}

        <label className="nsp-field">
          <span className="nsp-label">Title</span>
          <input
            className="nsp-input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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
          <span className="nsp-label">Billing period</span>
          <input
            placeholder='e.g. "one-time", "month", "3 months", "6 months"'
            className="nsp-input"
            value={form.billingPeriod}
            onChange={(e) => setForm((f) => ({ ...f, billingPeriod: e.target.value }))}
          />
        </label>

        <div className="nsp-row">
          <label className="nsp-field">
            <span className="nsp-label">Order</span>
            <input
              type="number"
              className="nsp-input"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value || 1) }))}
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

        {/* --- Features repeater --- */}
        <div className="nsp-field">
          <div className="nsp-label" style={{ marginBottom: 8 }}>Features</div>

          <div className="nsp-repeater">
            {form.features.map((row, i) => (
              <div key={i} className="nsp-repeater__item">
                <input
                  className="nsp-input"
                  placeholder={`Feature #${i + 1}`}
                  value={row.name}
                  onChange={(e) => setFeatureName(i, e.target.value)}
                />
                <div className="nsp-repeater__actions">
                  <button
                    type="button"
                    className="nsp-btn nsp-btn--xs"
                    onClick={() => moveFeature(i, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="nsp-btn nsp-btn--xs"
                    onClick={() => moveFeature(i, +1)}
                    disabled={i === form.features.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="nsp-btn nsp-btn--danger nsp-btn--xs"
                    onClick={() => removeFeature(i)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8 }}>
            <button type="button" className="nsp-btn nsp-btn--outline" onClick={() => addFeature()}>
              + Add feature
            </button>
          </div>
        </div>

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
