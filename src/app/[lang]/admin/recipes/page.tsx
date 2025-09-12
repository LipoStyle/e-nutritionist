// src/app/[lang]/admin/recipes/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import './AdminRecipes.css';

type Language = 'en' | 'es' | 'el';

type ValuableInfo = {
  duration: string | null;
  difficulty: string | null;
  portions: number | null;
};

type RecipeListItem = {
  id: string;
  title: string;
  slug: string;
  language: Language;
  category: string;
  short_description?: string | null; // NEW (if API provides it)
  image_url?: string | null;         // NEW (if API provides it)
  published_date: string | null;
  valuable_info: ValuableInfo | null;
};

type ListResponse = {
  items: RecipeListItem[];
  total: number;
  page: number;
  perPage: number;
};

export default function AdminRecipesListPage() {
  const pathname = usePathname();
  const lang = useMemo<Language>(() => {
    const seg = pathname?.split('/').filter(Boolean)[0] ?? 'en';
    return (['en', 'es', 'el'].includes(seg) ? (seg as Language) : 'en');
  }, [pathname]);

  const [items, setItems] = useState<RecipeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    setHint(null);
    try {
      const params = new URLSearchParams();
      params.set('language', lang);
      params.set('perPage', String(perPage));
      params.set('page', String(page));
      if (q.trim()) params.set('q', q.trim());
      if (category.trim()) params.set('category', category.trim());

      const res = await fetch(`/api/admin/recipes?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401 || res.status === 403) {
        setHint(`You are not authenticated as admin. Please log in.`);
        throw new Error(`Not authorized (${res.status})`);
      }
      if (res.status === 404) {
        setHint(`API endpoint "/api/admin/recipes" was not found. Make sure the route file exists.`);
        throw new Error(`Endpoint not found (404)`);
      }
      if (!res.ok) throw new Error(`Failed to load recipes (${res.status})`);

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        setHint(`The API returned HTML instead of JSON (redirect or missing route).`);
        throw new Error(text.slice(0, 120));
      }

      const data = (await res.json()) as ListResponse;
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, page, perPage]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    void load();
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  async function handleDelete(id: string) {
    if (!confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/recipes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      const nextCount = items.length - 1;
      if (nextCount === 0 && page > 1) setPage(p => Math.max(1, p - 1));
      else void load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Unknown error');
    }
  }

  return (
    <main className="admin-wrap admin-recipes page-with-header-offset">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>Recipes</h1>
          <p className="admin-sub">Create, edit, and organize your recipes.</p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}/admin/recipes/new`} className="btn btn-primary">
            New Recipe
          </Link>
        </div>
      </header>

      {/* Toolbar */}
      <section className="card recipes-toolbar">
        <form onSubmit={applyFilters} className="recipes-toolbar__form" role="search">
          <input
            type="text"
            placeholder="Search by title…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="input recipes-input"
            aria-label="Search recipes by title"
          />
          <input
            type="text"
            placeholder="Filter by category…"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="input recipes-input"
            aria-label="Filter recipes by category"
          />
          <button type="submit" className="btn recipes-btn">Search</button>
        </form>
      </section>

      {/* Errors / Hints */}
      {(err || hint) && (
        <section className="alert alert-error">
          <div className="alert-title">Couldn’t load recipes</div>
          {hint && <div className="alert-hint">{hint}</div>}
          {err && <pre className="alert-detail">{err}</pre>}
          <div className="alert-actions">
            <Link href={`/${lang}/admin/login?from=/${lang}/admin/recipes`} className="btn btn-ghost">Go to Login</Link>
          </div>
        </section>
      )}

      {/* Card grid */}
      <section className="recipes-cards-wrap">
        {loading ? (
          <div className="card" style={{ padding: 16 }}>Loading…</div>
        ) : items.length === 0 && !err ? (
          <div className="card recipes-empty">No recipes found.</div>
        ) : !err ? (
          <div className="recipes-cards">
            {items.map((r) => (
              <article key={r.id} className="card recipe-card">
                <Link
                  href={`/${lang}/admin/recipes/${r.id}`}
                  className="recipe-card__image"
                  title={`Open ${r.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image_url || '/placeholder-recipe.jpg'}
                    alt={r.title}
                    loading="lazy"
                  />
                </Link>

                <div className="recipe-card__body">
                  <div className="recipe-card__meta">
                    <span className="pill">{r.category}</span>
                    <span className="pill">{r.language}</span>
                    {r.published_date && (
                      <time className="pill" dateTime={r.published_date}>
                        {new Date(r.published_date).toLocaleDateString()}
                      </time>
                    )}
                  </div>

                  <h3 className="recipe-card__title" title={r.title}>
                    {r.title}
                  </h3>

                  {r.short_description && (
                    <p className="recipe-card__desc">{r.short_description}</p>
                  )}

                  {r.valuable_info && (
                    <div className="recipe-card__stats">
                      {r.valuable_info.duration ? <>⏱ {r.valuable_info.duration} • </> : null}
                      {typeof r.valuable_info.portions === 'number' ? <>👥 {r.valuable_info.portions} • </> : null}
                      {r.valuable_info.difficulty ? <>⚙️ {r.valuable_info.difficulty}</> : null}
                    </div>
                  )}

                  <div className="recipe-card__actions">
                    {/* Public preview */}
                    <Link
                      href={`/${lang}/recipes/${r.slug}`}
                      className="icon-btn"
                      title="Preview public page"
                      aria-label="Preview public page"
                      target="_blank"
                    >
                      {/* eye icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                      </svg>
                    </Link>

                    {/* Admin view */}
                    <Link
                      href={`/${lang}/admin/recipes/${r.id}`}
                      className="icon-btn"
                      title="View details"
                      aria-label="View details"
                    >
                      {/* doc icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                      </svg>
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/${lang}/admin/recipes/${r.id}/edit`}
                      className="icon-btn"
                      title="Edit recipe"
                      aria-label="Edit recipe"
                    >
                      {/* pencil */}
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                      </svg>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => void handleDelete(r.id)}
                      className="icon-btn danger"
                      title="Delete recipe"
                      aria-label="Delete recipe"
                    >
                      {/* trash */}
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 10v8M14 10v8"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        {!loading && totalPages > 1 && !err && (
          <div className="admin-pagination recipes-pagination">
            <button
              className="btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Prev
            </button>
            <span className="recipes-pagecount">Page {page} / {totalPages}</span>
            <button
              className="btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
