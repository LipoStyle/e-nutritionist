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

      {/* Quick links to existing public routes (safe, non-admin) */}
      <section className="admin-grid actions">
        <Link href={`/${lang}/about`} className="card action">
          <h3>About Page</h3>
          <p>Review the About page content.</p>
        </Link>
        <Link href={`/${lang}/services`} className="card action">
          <h3>Services</h3>
          <p>Check your services list and layout.</p>
        </Link>
        <Link href={`/${lang}/recipes`} className="card action">
          <h3>Recipes</h3>
          <p>Browse the public recipes page.</p>
        </Link>
        <Link href={`/${lang}/blogs`} className="card action">
          <h3>Blog</h3>
          <p>See the blog index page.</p>
        </Link>
        <Link href={`/${lang}/contact`} className="card action">
          <h3>Contact</h3>
          <p>Test the contact page & links.</p>
        </Link>
        <a className="card action disabled" aria-disabled="true">
          <h3>Content Manager</h3>
          <p>Coming soon: edit site content here.</p>
        </a>
      </section>
    </main>
  )
}
