'use client'

import styles from './ContactIntro.module.css'
import { translations } from './translations'

export default function ContactIntro({ locale }: { locale: 'en' | 'es' | 'el' }) {
  const t = translations[locale]

  return (
    <section className={styles.section} aria-labelledby="contact-intro-title">
      <h2 id="contact-intro-title" className={styles.title}>
        {t.title}
      </h2>
      <p className={styles.subtitle}>{t.subtitle}</p>
    </section>
  )
}
