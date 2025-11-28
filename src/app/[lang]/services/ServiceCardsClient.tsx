'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import './PublicPlans.css'

type PublicPlan = {
  id: string
  slug: string
  title: string
  summary: string | null
  priceCents: number
  features: { id: string; name: string; order: number }[]
}

export default function ServiceCardsClient({
  plans,
  bookingHref,
}: {
  plans: PublicPlan[]
  bookingHref: string
}) {
  function formatAmount(cents?: number | null) {
    const whole = Math.round((cents ?? 0) / 100)
    return `${whole}€`
  }

  // Intersection Observer for animation
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.service-card > *')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="service-plans-container">
      <div className="service-plans-grid">
        {plans.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.8 }}>
            Plans are coming soon. Check back shortly!
          </div>
        ) : (
          plans.map((p) => (
            <article key={p.id} className="service-card" tabIndex={0}>
              <h3 className="service-title" style={{ '--order': 0 } as React.CSSProperties}>
                {p.title}
              </h3>

              <div className="service-price" style={{ '--order': 1 } as React.CSSProperties}>
                {formatAmount(p.priceCents)}
              </div>

              <div className="seperator-line" style={{ '--order': 2 } as React.CSSProperties} />

              {p.features.length > 0 && (
                <ul className="features-list" aria-label="Included features">
                  {p.features.map((f, i) => (
                    <li
                      key={f.id}
                      className="feature-item"
                      style={{ '--order': i + 3 } as React.CSSProperties}
                    >
                      <span className="feature-tick" aria-hidden>
                        ✓
                      </span>
                      <span className="feature-name">{f.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              {p.summary && (
                <p
                  className="service-description"
                  style={{ '--order': p.features.length + 3 } as React.CSSProperties}
                >
                  {p.summary}
                </p>
              )}

              <Link
                href={bookingHref}
                className="cta-button"
                style={{ '--order': 10 } as React.CSSProperties}
              >
                Book now
              </Link>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
