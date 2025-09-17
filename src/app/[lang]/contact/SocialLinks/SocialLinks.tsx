'use client'

import styles from './SocialLinks.module.css'
import { translations } from './translations'

export default function SocialLinks({ locale }: { locale: 'en' | 'es' | 'el' }) {
  const t = translations[locale]

  return (
    <section className={styles.section} aria-labelledby="social-links-title">
      <h2 id="social-links-title" className={styles.title}>
        {t.title}
      </h2>
      <div className={styles.links}>
        {t.links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
          >
            {link.name}
          </a>
        ))}
      </div>
    </section>
  )
}
