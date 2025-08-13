'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import '../../../AdminDashboard.css'
import Hero from '@/app/components/shared/Hero/Hero'

const PAGES = ['home','about','services','recipes','blog','contact'] as const
const LANGS = ['en','es','el'] as const

export default function NewHeroPage() {
  const { lang = 'en' } = useParams<{ lang: 'en'|'es'|'el' }>()
  const router = useRouter()
  const [form, setForm] = useState({
    pageKey: 'home',
    language: lang,
    title: '',
    description: '',
    message: 'Ready to start?',
    bookText: 'Book Now',
    bookHref: `/${lang}/book-consultation`,
    bgImage: '/assets/images/hero/home.jpg',
    overlayOpacity: 0.45,
    offsetHeader: true,
    height: 'default' as 'compact'|'default'|'tall',
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (!res.ok) {
      alert('Failed: ' + (await res.text()))
      return
    }
    router.replace(`/${lang}/admin/contentmanager/hero`)
  }

  return (
    <main className="admin-wrap">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>New Hero</h1>
          <p className="admin-sub">Create a hero for a page and language.</p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}/admin/contentmanager/hero`} className="btn btn-ghost">Cancel</Link>
          <button className="btn btn-danger" onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      <section className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Form */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <label>Page
              <select value={form.pageKey} onChange={e=>setForm(f=>({...f, pageKey: e.target.value}))}>
                {PAGES.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label>Language
              <select value={form.language} onChange={e=>setForm(f=>({...f, language: e.target.value as any}))}>
                {LANGS.map(l=><option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </label>
            <label>Title
              <input value={form.title} onChange={e=>setForm(f=>({...f, title: e.target.value}))} />
            </label>
            <label>Description
              <textarea value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))} />
            </label>
            <label>Message
              <input value={form.message} onChange={e=>setForm(f=>({...f, message: e.target.value}))} />
            </label>
            <label>Button Text
              <input value={form.bookText} onChange={e=>setForm(f=>({...f, bookText: e.target.value}))} />
            </label>
            <label>Button Link
              <input value={form.bookHref} onChange={e=>setForm(f=>({...f, bookHref: e.target.value}))} />
            </label>
            <label>Background Image URL
              <input value={form.bgImage} onChange={e=>setForm(f=>({...f, bgImage: e.target.value}))} />
            </label>
            <label>Overlay Opacity (0..1)
              <input type="number" step="0.05" min="0" max="1" value={form.overlayOpacity}
                     onChange={e=>setForm(f=>({...f, overlayOpacity: Number(e.target.value)}))} />
            </label>
            <label>Height
              <select value={form.height} onChange={e=>setForm(f=>({...f, height: e.target.value as any}))}>
                <option value="compact">compact</option>
                <option value="default">default</option>
                <option value="tall">tall</option>
              </select>
            </label>
            <label>
              <input type="checkbox" checked={form.offsetHeader}
                     onChange={e=>setForm(f=>({...f, offsetHeader: e.target.checked}))} />
              &nbsp;Offset header
            </label>
          </div>
        </div>

        {/* Live preview */}
        <div className="card" style={{ padding: 0 }}>
          <Hero
            title={form.title || undefined}
            description={form.description || undefined}
            message={form.message || undefined}
            bookText={form.bookText || undefined}
            bookHref={form.bookHref || undefined}
            bgImage={form.bgImage || undefined}
            overlayOpacity={form.overlayOpacity}
            offsetHeader={form.offsetHeader}
            height={form.height}
            imagePriority={false}
            headingLevel={1}
          />
        </div>
      </section>
    </main>
  )
}
