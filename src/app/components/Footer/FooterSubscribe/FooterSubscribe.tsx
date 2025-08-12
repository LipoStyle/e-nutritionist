'use client'

import { useState } from 'react'
import t, { Lang } from './translations'
import './FooterSubscribe.css'

type Props = {
  lang: Lang
  onSubmitUrl?: string // e.g. "/api/newsletter"
}

export default function FooterSubscribe({ lang, onSubmitUrl }: Props) {
  const tr = t[lang] ?? t.en
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setStatus('error')
      setMessage(tr.error)
      return
    }

    setStatus('loading')
    setMessage('')

    // wrap async to satisfy @typescript-eslint/no-misused-promises
    void (async () => {
      try {
        if (onSubmitUrl) {
          await fetch(onSubmitUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
        }
        setStatus('success')
        setMessage(tr.success)
        setEmail('')
      } catch {
        setStatus('error')
        setMessage(tr.error)
      } finally {
        // ensure button re-enables
        if (status === 'loading') setStatus((prev) => (prev === 'loading' ? 'idle' : prev))
      }
    })()
  }

  const isLoading = status === 'loading'

  return (
    <section className="footer-subscribe" aria-labelledby="footer-subscribe-title">
      <div className="footer-subscribe__inner">
        <h3 id="footer-subscribe-title" className="footer-subscribe__title">
          {tr.title}
        </h3>
        <p className="footer-subscribe__subtitle">{tr.subtitle}</p>

        <form className="footer-subscribe__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="newsletter-email" className="sr-only">
            {tr.placeholder}
          </label>
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={tr.placeholder}
            aria-invalid={status === 'error'}
            aria-describedby="newsletter-help"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="footer-subscribe__input"
          />
          <button
            type="submit"
            className="footer-subscribe__btn"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? '...' : tr.button}
          </button>
        </form>

        <div
          id="newsletter-help"
          className={`footer-subscribe__msg ${status}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      </div>
    </section>
  )
}
