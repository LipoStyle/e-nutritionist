'use client'

import { useState } from 'react'
import styles from './ContactForm.module.css'
import { translations } from './translations'

type Locale = 'en' | 'es' | 'el'
type Status = 'idle' | 'loading' | 'success' | 'error'
type FieldErrors = Partial<Record<'name' | 'email' | 'phone_number' | 'subject' | 'message', string>>

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = translations[locale]
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrors({})

    const form = e.currentTarget
    const fd = new FormData(form)

    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone_number: String(fd.get('phone') || ''), // server accepts phone_number/phone
      subject: String(fd.get('subject') || ''),
      message: String(fd.get('message') || ''),
      company: String(fd.get('company') || ''), // honeypot
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-locale': locale,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        // Try to surface field-specific errors from Zod v4 format()
        let data: any = null
        try { data = await res.json() } catch {}
        if (data?.errors) {
          const fieldErrors: FieldErrors = {}
          for (const key of ['name', 'email', 'phone_number', 'subject', 'message'] as const) {
            const msg = data.errors?.[key]?._errors?.[0]
            if (msg) fieldErrors[key] = msg
          }
          setErrors(fieldErrors)
        }
        setStatus('error')
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={styles.section} aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className={styles.title}>
        {t.title}
      </h2>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Honeypot (hidden from users, visible to bots) */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-10000px', height: 0, width: 0, overflow: 'hidden' }}
        />

        <input
          type="text"
          name="name"
          placeholder={t.name}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cf-name-error' : undefined}
        />
        {errors.name && (
          <span id="cf-name-error" className={styles.fieldError} role="alert">
            {errors.name}
          </span>
        )}

        <input
          type="email"
          name="email"
          placeholder={t.email}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'cf-email-error' : undefined}
        />
        {errors.email && (
          <span id="cf-email-error" className={styles.fieldError} role="alert">
            {errors.email}
          </span>
        )}

        <input
          type="tel"
          name="phone"
          placeholder={t.phone}
          aria-invalid={!!errors.phone_number}
          aria-describedby={errors.phone_number ? 'cf-phone-error' : undefined}
        />
        {errors.phone_number && (
          <span id="cf-phone-error" className={styles.fieldError} role="alert">
            {errors.phone_number}
          </span>
        )}

        <input
          type="text"
          name="subject"
          placeholder={t.subject}
          required
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'cf-subject-error' : undefined}
        />
        {errors.subject && (
          <span id="cf-subject-error" className={styles.fieldError} role="alert">
            {errors.subject}
          </span>
        )}

        <textarea
          name="message"
          placeholder={t.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
        />
        {errors.message && (
          <span id="cf-message-error" className={styles.fieldError} role="alert">
            {errors.message}
          </span>
        )}

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? t.submitting : t.submit}
        </button>
      </form>

      {status === 'success' && <p className={styles.success}>{t.success}</p>}
      {status === 'error' && <p className={styles.error}>{t.error}</p>}
    </section>
  )
}