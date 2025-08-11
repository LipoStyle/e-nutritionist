'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      const from = sp.get('from') || ''
      const lang = window.location.pathname.split('/')[1] || 'en'
      const safeFrom = from.startsWith(`/${lang}/admin`) ? from : `/${lang}/admin`
      router.replace(safeFrom)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, marginInline: 'auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Admin Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                 style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 10, border: '1px solid var(--color-light-gray)', background: 'var(--color-soft-white)' }}/>
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                 style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 10, border: '1px solid var(--color-light-gray)', background: 'var(--color-soft-white)' }}/>
        </label>
        {error && <div style={{ color: 'var(--color-danger)', marginTop: 4 }}>{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
