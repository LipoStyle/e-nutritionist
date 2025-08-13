'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import '../../AdminDashboard.css'

type Row = {
  id: string
  pageKey: string
  language: 'en'|'es'|'el'
  title: string | null
  updatedAt: string
}

export default function HeroListPage() {
  const { lang = 'en' } = useParams<{ lang: 'en'|'es'|'el' }>()
  const [rows, setRows] = useState<Row[] | null>(null)

  useEffect(() => {
    void fetch('/api/admin/hero').then(r => r.json()).then(setRows)
  }, [])

  return (
    <main className="admin-wrap">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>Hero Settings</h1>
          <p className="admin-sub">Manage per-page, per-language hero content.</p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}/admin/contentmanager`} className="btn btn-ghost">Back</Link>
          <Link href={`/${lang}/admin/contentmanager/hero/new`} className="btn btn-danger">New</Link>
        </div>
      </header>

      {(!rows || rows.length === 0) ? (
        <section className="card" style={{ padding: 20 }}>
          <p>No hero entries yet. Create one.</p>
        </section>
      ) : (
        <section className="admin-grid actions">
          {rows.map(r => (
            <Link
              key={r.id}
              href={`/${lang}/admin/contentmanager/hero/${r.id}`}
              className="card action"
              aria-label={`Edit ${r.pageKey} ${r.language.toUpperCase()}`}
            >
              <h3>{r.pageKey} — {r.language.toUpperCase()}</h3>
              <p>{r.title || 'No title'}</p>
            </Link>
          ))}
        </section>
      )}
    </main>
  )
}
