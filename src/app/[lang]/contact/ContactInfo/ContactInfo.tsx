'use client'

import styles from './ContactInfo.module.css'
import { translations } from './translations'

export default function ContactInfo({ locale }: { locale: 'en' | 'es' | 'el' }) {
  const t = translations[locale]

  return (
    <section className={styles.section} aria-labelledby="contact-info-title">
      <h2 id="contact-info-title" className={styles.title}>
        {t.title}
      </h2>
      <ul className={styles.list}>
        <li>
          <strong>{t.emailLabel}:</strong>{' '}
          <a href={`mailto:${t.emailValue}`}>{t.emailValue}</a>
        </li>
        <li>
          <strong>{t.phoneLabel}:</strong>{' '}
          <a href={`tel:${t.phoneValue}`}>{t.phoneValue}</a>
        </li>
        <li>
          <strong>{t.locationLabel}:</strong> {t.locationValue}
        </li>
      </ul>
    </section>
  )
}
