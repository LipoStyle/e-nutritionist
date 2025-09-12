'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './AdminRecipeView.css';

type Language = 'en' | 'es' | 'el';
type Difficulty = 'easy' | 'medium' | 'hard';

type Ingredient = { id: string; name: string; quantity: number; size: string };
type Instruction = { id: string; step_number: number; step_content: string };
type ValuableInfo = { duration: string; difficulty: Difficulty; portions: number } | null;
type Nutritional = { id: string; name: string; quantity: number; size: string };
type MetaInfo = { meta_title: string | null; meta_description: string | null; meta_keywords: string | null } | null;

type Recipe = {
  id: string;
  title: string;
  slug: string;
  language: Language;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  published_date: string | null;
  ingredients: Ingredient[];
  instructions: Instruction[];
  valuable_info: ValuableInfo;
  nutritional_facts: Nutritional[];
  meta_info: MetaInfo;
};

export default function AdminRecipeViewPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Parse [lang] and [id] from the pathname (consistent with your other admin pages)
  const { lang, id } = useMemo(() => {
    const segs = pathname?.split('/').filter(Boolean) ?? [];
    return {
      lang: (segs[0] as Language) || 'en',
      id: segs[3] || '', // /[lang]/admin/recipes/[id]
    };
  }, [pathname]);

  const [data, setData] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    setHint(null);
    try {
      const res = await fetch(`/api/admin/recipes/${id}`, { credentials: 'include' });

      if (res.status === 401 || res.status === 403) {
        setHint('You are not authenticated as admin. Please log in.');
        throw new Error(`Not authorized (${res.status})`);
      }
      if (res.status === 404) {
        setHint('Recipe not found.');
        throw new Error('NOT_FOUND');
      }
      if (!res.ok) throw new Error(`Failed to load recipe (${res.status})`);

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        setHint('API returned non-JSON (likely a redirect).');
        throw new Error(text.slice(0, 140));
      }

      const json = (await res.json()) as Recipe;
      setData(json);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    if (!data) return;
    if (!confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/recipes/${data.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      router.replace(`/${lang}/admin/recipes`);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Unknown error');
    }
  }

  return (
    <main className="admin-wrap page-with-header-offset recipe-view">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>{data?.title || 'Recipe'}</h1>
          <p className="admin-sub">
            {data ? (
              <>
                <span className="pill">{data.language}</span>{' '}
                <span className="pill">{data.category}</span>{' '}
                {data.published_date && (
                  <time className="pill" dateTime={data.published_date}>
                    {new Date(data.published_date).toLocaleString()}
                  </time>
                )}
              </>
            ) : (
              'Details & content'
            )}
          </p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}/admin/recipes`} className="btn btn-ghost">Back</Link>
          {data && (
            <>
              <Link href={`/${lang}/admin/recipes/${data.id}/edit`} className="btn">Edit</Link>
              <Link href={`/${lang}/recipes/${data.slug}`} className="btn btn-ghost" target="_blank">Public preview</Link>
              <button onClick={handleDelete} className="btn btn-danger">Delete</button>
            </>
          )}
        </div>
      </header>

      {(err || hint) && (
        <section className="alert">
          <div className="alert-title">Couldn’t load recipe</div>
          {hint && <div className="alert-hint">{hint}</div>}
          {err && <pre className="alert-detail">{err}</pre>}
          <div className="alert-actions">
            <Link href={`/${lang}/admin/login?from=/${lang}/admin/recipes/${id}`} className="btn btn-ghost">Go to Login</Link>
          </div>
        </section>
      )}

      {/* Hero / cover */}
      <section className="card rv-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data?.image_url || '/placeholder-recipe.jpg'}
          alt={data?.title || 'Recipe cover'}
          loading="lazy"
        />
        {data?.short_description && (
          <div className="rv-hero-overlay">
            <div className="rv-hero-text">
              <h2>{data.title}</h2>
              <p>{data.short_description}</p>
            </div>
          </div>
        )}
      </section>

      {/* Content grid */}
      <section className="rv-grid">
        {/* LEFT: details */}
        <div className="rv-left">
          <article className="card rv-section">
            <h3>Basics</h3>
            {loading ? <div className="rv-skel" /> : data ? (
              <dl className="rv-def">
                <div><dt>Title</dt><dd>{data.title}</dd></div>
                <div><dt>Slug</dt><dd>/{data.slug}</dd></div>
                <div><dt>Category</dt><dd>{data.category}</dd></div>
                <div><dt>Language</dt><dd>{data.language}</dd></div>
                <div><dt>Published</dt><dd>{data.published_date ? new Date(data.published_date).toLocaleString() : '—'}</dd></div>
              </dl>
            ) : null}
          </article>

          <article className="card rv-section">
            <h3>Description</h3>
            {loading ? <div className="rv-skel tall" /> : (
              <p className="rv-desc">{data?.description || '—'}</p>
            )}
          </article>

          <article className="card rv-section">
            <h3>Ingredients</h3>
            {loading ? <div className="rv-skel tall" /> : data && data.ingredients.length ? (
              <ul className="rv-list">
                {data.ingredients.map((i) => (
                  <li key={i.id}>
                    <span className="rv-li-name">{i.name}</span>
                    <span className="rv-li-qty">
                      {Number.isFinite(i.quantity) ? i.quantity : '—'} {i.size}
                    </span>
                  </li>
                ))}
              </ul>
            ) : <div className="rv-empty">No ingredients.</div>}
          </article>

          <article className="card rv-section">
            <h3>Instructions</h3>
            {loading ? <div className="rv-skel tall" /> : data && data.instructions.length ? (
              <ol className="rv-steps">
                {data.instructions.map(s => (
                  <li key={s.id}>
                    <span className="rv-step-num">{s.step_number}</span>
                    <span className="rv-step-txt">{s.step_content}</span>
                  </li>
                ))}
              </ol>
            ) : <div className="rv-empty">No steps.</div>}
          </article>

          <article className="card rv-section">
            <h3>Nutritional Facts</h3>
            {loading ? <div className="rv-skel" /> : data && data.nutritional_facts.length ? (
              <ul className="rv-nutri">
                {data.nutritional_facts.map(n => (
                  <li key={n.id}>
                    <span className="rv-n-name">{n.name}</span>
                    <span className="rv-n-qty">{n.quantity} {n.size}</span>
                  </li>
                ))}
              </ul>
            ) : <div className="rv-empty">No nutritional facts.</div>}
          </article>
        </div>

        {/* RIGHT: meta & quick info */}
        <aside className="rv-right">
          <section className="card rv-section">
            <h3>Valuable Info</h3>
            {loading ? <div className="rv-skel" /> : data?.valuable_info ? (
              <ul className="rv-chips">
                {data.valuable_info.duration && <li>⏱ {data.valuable_info.duration}</li>}
                {typeof data.valuable_info.portions === 'number' && <li>👥 {data.valuable_info.portions}</li>}
                {data.valuable_info.difficulty && <li>⚙️ {data.valuable_info.difficulty}</li>}
              </ul>
            ) : <div className="rv-empty">—</div>}
          </section>

          <section className="card rv-section">
            <h3>SEO / Meta</h3>
            {loading ? <div className="rv-skel tall" /> : data?.meta_info ? (
              <dl className="rv-def">
                <div><dt>Meta Title</dt><dd>{data.meta_info.meta_title || '—'}</dd></div>
                <div><dt>Meta Description</dt><dd>{data.meta_info.meta_description || '—'}</dd></div>
                <div><dt>Meta Keywords</dt><dd>{data.meta_info.meta_keywords || '—'}</dd></div>
              </dl>
            ) : <div className="rv-empty">—</div>}
          </section>
        </aside>
      </section>
    </main>
  );
}
