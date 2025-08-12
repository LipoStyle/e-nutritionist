'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import './AdminLogin.css'

type LoginResponse = { ok?: boolean; error?: string; redirectTo?: string }

export default function AdminLoginPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
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
    <main className="auth-wrap">
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-head">
          <h1 id="auth-title" className="auth-title">Admin Login</h1>
          <p className="auth-sub">Sign in to manage your website.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-input-group">
              <input
                id="password"
                className="auth-input"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? 'auth-error' : undefined}
              />
              <button
                type="button"
                className="auth-toggle"
                onClick={() => setShowPwd((s) => !s)}
                aria-pressed={showPwd}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div id="auth-error" role="alert" className="auth-error">
              {error}
            </div>
          )}

          <button className="auth-btn" type="submit" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <footer className="auth-foot">
          <a className="auth-link" href={`/${lang}`}>← Back to site</a>
        </footer>
      </section>
    </main>
  )
}
