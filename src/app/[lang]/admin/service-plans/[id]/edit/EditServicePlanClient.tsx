'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import '../../new/NewServicePlan.css';
import DeletePlanButton from '../../DeletePlanButton';

type Lang = 'en' | 'es' | 'el';
type FeatureRow = { id?: string; name: string; order: number };

type FormState = {
  title: string;
  summary: string;
  description: string;
  price: string;          // euros string
  billingPeriod: string;  // free text
  order: number;
  isActive: boolean;
  features: FeatureRow[];
};

function parseErr(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  return 'Error';
}

export default function EditServicePlanClient({ lang, id }: { lang: Lang; id: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldIssues, setFieldIssues] = useState<string[] | null>(null);

  const [form, setForm] = useState<FormState>({
    title: '',
    summary: '',
    description: '',
    price: '0.00',
    billingPeriod: '',
    order: 1,
    isActive: true,
    features: [{ name: '', order: 1 }],
  });

  const priceCents = useMemo(
    () => Math.round((parseFloat(form.price || '0') || 0) * 100),
    [form.price]
  );
  const priceNumber = useMemo(
    () => (Number.isFinite(parseFloat(form.price)) ? parseFloat(form.price) : 0),
    [form.price]
  );

  // ---------- load existing plan ----------
  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setErr(null);
      setFieldIssues(null);
      try {
        const res = await fetch(`/api/admin/service-plans/${id}`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store', // avoid stale
        });

        if (res.status === 401 || res.status === 403) {
          const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans/${id}/edit`);
          router.push(`/${lang}/admin/login?from=${from}`);
          return;
        }
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j?.error || `Failed to load (${res.status})`);
        }

        const j = await res.json();
        const item = j?.item as {
          id: string;
          title: string;
          price: number;
          description: string;
          language: Lang;
          order: number;
          billing_period: string | null;
          is_active?: boolean;
          summary?: string | null;
          features: { id: string; name: string; order?: number }[];
        };

        if (!item) throw new Error('Not found');

        if (!ignore) {
          setForm({
            title: item.title ?? '',
            summary: item.summary ?? '',
            description: item.description ?? '',
            price: Number.isFinite(item.price) ? item.price.toFixed(2) : '0.00',
            billingPeriod: item.billing_period ?? '',
            order: item.order ?? 1,
            isActive: item.is_active ?? true,
            features: (item.features || [])
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((f, i) => ({
                id: f.id,
                name: f.name,
                order: f.order ?? i + 1,
              })),
          });
        }
      } catch (e) {
        if (!ignore) setErr(parseErr(e));
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [id, lang, pathname, router]);

  // ---------- features helpers ----------
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

  // ---------- save ----------
  async function handleSave() {
    setSaving(true);
    setErr(null);
    setFieldIssues(null);
    try {
      const features = form.features
        .map((r, idx) => ({ id: r.id, name: r.name.trim(), order: idx + 1 }))
        .filter((r) => r.name.length > 0);

      const res = await fetch(`/api/admin/service-plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          language: lang,
          // slug: (omit; server keeps current one)
          title: form.title,
          summary: form.summary || null,
          description: form.description,
          price: priceNumber,                         // euros
          billing_period: form.billingPeriod || null, // free text
          order: form.order,
          is_active: form.isActive,
          features,                                   // keep id for existing rows
        }),
      });

      if (res.status === 401 || res.status === 403) {
        const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans/${id}/edit`);
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
        throw new Error(j?.error || `Failed to save (${res.status})`);
      }

      router.replace(`/${lang}/admin/service-plans?updated=1`);
    } catch (e) {
      setErr(parseErr(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="nsp">
        <h1 className="nsp__title">Edit Service Plan</h1>
        <div className="nsp-hint">Loading…</div>
      </div>
    );
  }

  const canSave = !saving && form.title.trim().length > 0 && form.description.trim().length > 0;

  return (
    <div className="nsp">
      <h1 className="nsp__title">Edit Service Plan</h1>

      {err && <div className="nsp-alert nsp-alert--error" role="alert">{err}</div>}

      {fieldIssues && fieldIssues.length > 0 && (
        <div className="nsp-alert nsp-alert--error" role="alert">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {fieldIssues.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="nsp-actions" style={{ marginBottom: 6 }}>
        <DeletePlanButton id={id} lang={lang} />
      </div>

      <div className="nsp-form">
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

        {/* Features repeater */}
        <div className="nsp-field">
          <div className="nsp-label" style={{ marginBottom: 8 }}>Features</div>

          <div className="nsp-repeater">
            {form.features.map((row, i) => (
              <div key={row.id ?? i} className="nsp-repeater__item">
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
          <button className="nsp-btn nsp-btn--primary" disabled={!canSave} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button className="nsp-btn nsp-btn--outline" onClick={() => history.back()}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
