// src/app/[lang]/admin/page.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const lang = pathname?.split('/')[1] ?? 'en'
  const [loading, setLoading] = useState(false)

  async function logout() {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.replace(`/${lang}/admin/login`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-wrap">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>Admin Dashboard</h1>
          <p className="admin-sub">Manage content, check status, and access quick tools.</p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}`} className="btn btn-ghost">
            View site
          </Link>
          <button className="btn btn-danger" onClick={() => void logout()} disabled={loading}>
            {loading ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </header>

      {/* Metrics row (placeholders for now) */}
      <section className="admin-grid metrics">
        <article className="card metric">
          <div className="metric-value">—</div>
          <div className="metric-label">Pages</div>
        </article>
        <article className="card metric">
          <div className="metric-value">—</div>
          <div className="metric-label">Blog posts</div>
        </article>
        <article className="card metric">
          <div className="metric-value">—</div>
          <div className="metric-label">Recipes</div>
        </article>
        <article className="card metric">
          <div className="metric-value">—</div>
          <div className="metric-label">Messages</div>
        </article>
      </section>

      {/* Admin-only links */}
      <section className="admin-grid actions">
        <Link href={`/${lang}/admin/contentmanager`} className="card action">
          <h3>Content Manager</h3>
          <p>Edit site content (pages, blog, recipes, media).</p>
        </Link>
      </section>
    </main>
  )
}
