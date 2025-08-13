'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import '../../../AdminDashboard.css'
import Hero from '@/app/components/shared/Hero/Hero'

type Row = {
  id: string
  pageKey: string
  language: 'en'|'es'|'el'
  title: string | null
  description: string | null
  message: string | null
  bookText: string | null
  bookHref: string | null
  bgImage: string | null
  overlayOpacity: number
  offsetHeader: boolean
  height: 'compact'|'default'|'tall'
}

export default function EditHeroPage() {
  const { lang = 'en', id } = useParams<{ lang: 'en'|'es'|'el', id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<Row | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void fetch(`/api/admin/hero/${id}`).then(r => r.json()).then(setForm)
  }, [id])

  async function save() {
    if (!form) return
    setSaving(true)
    const { id: _id, createdAt, updatedAt, ...payload } = form as any
    const res = await fetch(`/api/admin/hero/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) {
      alert('Failed: ' + (await res.text()))
      return
    }
    router.replace(`/${lang}/admin/contentmanager/hero`)
  }

  async function remove() {
    if (!confirm('Delete this hero setting?')) return
    await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' })
    router.replace(`/${lang}/admin/contentmanager/hero`)
  }

  if (!form) return <main className="admin-wrap"><p>Loading…</p></main>

  return (
    <main className="admin-wrap">
      <header className="admin-topbar">
        <div className="admin-titles">
          <h1>Edit Hero</h1>
          <p className="admin-sub">{form.pageKey} — {form.language.toUpperCase()}</p>
        </div>
        <div className="admin-actions">
          <Link href={`/${lang}/admin/contentmanager/hero`} className="btn btn-ghost">Back</Link>
          <button className="btn btn-danger" onClick={() => void save()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn btn-danger" onClick={() => void remove()}>Delete</button>
        </div>
      </header>

      <section className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <label>Page
              <input value={form.pageKey} onChange={e=>setForm(f=>f && ({...f, pageKey: e.target.value}))} />
            </label>
            <label>Language
              <select value={form.language} onChange={e=>setForm(f=>f && ({...f, language: e.target.value as any}))}>
                <option value="en">EN</option><option value="es">ES</option><option value="el">EL</option>
              </select>
            </label>
            <label>Title
              <input value={form.title ?? ''} onChange={e=>setForm(f=>f && ({...f, title: e.target.value}))} />
            </label>
            <label>Description
              <textarea value={form.description ?? ''} onChange={e=>setForm(f=>f && ({...f, description: e.target.value}))} />
            </label>
            <label>Message
              <input value={form.message ?? ''} onChange={e=>setForm(f=>f && ({...f, message: e.target.value}))} />
            </label>
            <label>Button Text
              <input value={form.bookText ?? ''} onChange={e=>setForm(f=>f && ({...f, bookText: e.target.value}))} />
            </label>
            <label>Button Link
              <input value={form.bookHref ?? ''} onChange={e=>setForm(f=>f && ({...f, bookHref: e.target.value}))} />
            </label>
            <label>Background Image URL
              <input value={form.bgImage ?? ''} onChange={e=>setForm(f=>f && ({...f, bgImage: e.target.value}))} />
            </label>
            <label>Overlay Opacity
              <input type="number" min="0" max="1" step="0.05" value={form.overlayOpacity}
                onChange={e=>setForm(f=>f && ({...f, overlayOpacity: Number(e.target.value)}))} />
            </label>
            <label>Height
              <select value={form.height} onChange={e=>setForm(f=>f && ({...f, height: e.target.value as any}))}>
                <option value="compact">compact</option>
                <option value="default">default</option>
                <option value="tall">tall</option>
              </select>
            </label>
            <label>
              <input type="checkbox" checked={form.offsetHeader}
                     onChange={e=>setForm(f=>f && ({...f, offsetHeader: e.target.checked}))} />
              &nbsp;Offset header
            </label>
          </div>
        </div>

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
