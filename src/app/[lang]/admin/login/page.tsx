'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

type LoginResponse = { ok?: boolean; error?: string }

export default function AdminLoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // derive current lang from the URL; fallback to 'en'
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
          const from = sp.get('from') || ''
          const safeFrom = from.startsWith(`/${lang}/admin`) ? from : `/${lang}/admin`
          router.replace(safeFrom)
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
    <div className="card" style={{ maxWidth: 420, marginInline: 'auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>Admin Login</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }} noValidate>
        <label>
          <div style={{ marginBottom: 6 }}>Email</div>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: 10,
              border: '1px solid var(--color-light-gray)',
              background: 'var(--color-soft-white)',
            }}
          />
        </label>

        <label>
          <div style={{ marginBottom: 6 }}>Password</div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              borderRadius: 10,
              border: '1px solid var(--color-light-gray)',
              background: 'var(--color-soft-white)',
            }}
          />
        </label>

        {error && (
          <div role="alert" style={{ color: 'var(--color-danger)', marginTop: 4 }}>
            {error}
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
