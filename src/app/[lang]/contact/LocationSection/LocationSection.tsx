'use client'

import styles from './LocationSection.module.css'
import { translations } from './translations'

export default function LocationSection({ locale }: { locale: 'en' | 'es' | 'el' }) {
  const t = translations[locale]

  return (
    <section className={styles.section} aria-labelledby="location-title">
      <h2 id="location-title" className={styles.title}>
        {t.title}
      </h2>
      <p>{t.paragraph}</p>
      <div className={styles.mapWrapper}>
        <iframe
          src={t.mapSrc}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <p className={styles.address}>{t.addressLine}</p>
    </section>
  )
}
