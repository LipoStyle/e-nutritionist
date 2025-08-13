'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import '../AdminDashboard.css'
import './ContentManager.css'

export default function ContentManagerPage() {
  const { lang = 'en' } = useParams<{ lang: 'en' | 'es' | 'el' }>()

  return (
    <main className="admin-wrap">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>Content Manager</h1>
          <p className="admin-sub">Create and manage site content per language.</p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}/admin`} className="btn btn-ghost">Back to Dashboard</Link>
        </div>
      </header>

      {/* Modules */}
      <section className="admin-grid actions">
        <Link href={`/${lang}/admin/contentmanager/hero`} className="card action">
          <h3>Hero Settings</h3>
          <p>Per‑page, per‑language hero content (title, description, CTA, image).</p>
        </Link>

        {/* Future modules (disabled placeholders) */}
        <a className="card action disabled" aria-disabled="true">
          <h3>Pages</h3>
          <p>Coming soon</p>
        </a>
        <a className="card action disabled" aria-disabled="true">
          <h3>Blog</h3>
          <p>Coming soon</p>
        </a>
        <a className="card action disabled" aria-disabled="true">
          <h3>Recipes</h3>
          <p>Coming soon</p>
        </a>
        <a className="card action disabled" aria-disabled="true">
          <h3>Media</h3>
          <p>Coming soon</p>
        </a>
      </section>
    </main>
  )
}
