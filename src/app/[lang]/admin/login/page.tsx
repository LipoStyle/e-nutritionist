'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

type LoginResponse = { ok?: boolean; error?: string; redirectTo?: string }

export default function AdminLoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const lang = pathname?.split('/')[1] || 'en'

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (res.ok) {
          const data = (await res.json().catch(() => ({}))) as LoginResponse
          const from = sp.get('from') || ''
          const next = data.redirectTo || from
          const safe = next && next.startsWith(`/${lang}/admin`) ? next : `/${lang}/admin`
          router.replace(safe)
          return
        }

        const data = (await res.json().catch(() => ({}))) as LoginResponse
        setError(data?.error ?? 'Login failed')
      } catch {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <div className="card" style={{ maxWidth: 420, marginInline: 'auto', marginTop:"200px" }}>
      <h1 style={{ marginBottom: '1rem' }}>Admin Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }} noValidate>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <div role="alert" style={{ color: 'var(--color-danger)', marginTop: 4 }}>{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
