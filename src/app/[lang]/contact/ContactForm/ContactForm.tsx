'use client'

import { useState } from 'react'
import styles from './ContactForm.module.css'
import { translations } from './translations'

export default function ContactForm({ locale }: { locale: 'en' | 'es' | 'el' }) {
  const t = translations[locale]
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    // TODO: connect to /api/contact
    setTimeout(() => setStatus('success'), 800)
  }

  return (
    <section className={styles.section} aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className={styles.title}>
        {t.title}
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" placeholder={t.name} required />
        <input type="email" name="email" placeholder={t.email} required />
        <input type="tel" name="phone" placeholder={t.phone} />
        <input type="text" name="subject" placeholder={t.subject} required />
        <textarea name="message" placeholder={t.message}></textarea>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? t.submitting : t.submit}
        </button>
      </form>
      {status === 'success' && <p className={styles.success}>{t.success}</p>}
      {status === 'error' && <p className={styles.error}>{t.error}</p>}
    </section>
  )
}
