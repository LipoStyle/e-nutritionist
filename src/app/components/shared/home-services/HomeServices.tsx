'use client'

import React, { useEffect, useRef } from 'react'
import './HomeServices.css'

import CTAButton from '@/app/components/buttons/CTAButton'
import CTAButtonSecondary from '@/app/components/buttons/CTAButtonSecondary'
import { ServiceCardData } from './types'

import { servicesEN } from './data/services.en'
import { servicesES } from './data/services.es'
import { servicesEL } from './data/services.el'

export interface HomeServicesProps {
  lang?: 'en' | 'es' | 'el'
}

const HomeServices: React.FC<HomeServicesProps> = ({ lang = 'en' }) => {
  const data =
    lang === 'es' ? servicesES :
    lang === 'el' ? servicesEL :
    servicesEN

  // Only the services flagged for homepage
  const items = data.filter((s: ServiceCardData) => s.showHomeService)

  // --- IntersectionObserver to reveal on enter -----------------
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-animate]')
    )

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.15 }
    )

    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section
      className="homeServices"
      aria-labelledby="home-services-title"
      ref={sectionRef}
    >
      <div className="homeServices__inner">

        {/* Intro Section */}
        <header className="homeServices__header" data-animate>
          <h2 id="home-services-title" className="homeServices__title">
            Tailored Services for Every Journey
          </h2>
          <p className="homeServices__subtitle">
            Whether you’re starting out, optimizing performance, or striving for mastery —
            choose the plan that fits your lifestyle.
          </p>
        </header>

        {/* Grid */}
        <div className="homeServices__grid" role="list">
          {items.map((s, idx) => (
            <article
              key={s.id}
              role="listitem"
              className="homeServices__card homeServices__card--glass"
              data-animate
              style={{ ['--stagger' as any]: idx }} // CSS var for stagger
            >
              {/* Background media */}
              <div
                className="homeServices__media"
                style={{ backgroundImage: `url(${s.image})` }}
                aria-hidden
              />

              {/* Glass overlay content (bottom) */}
              <div className="homeServices__glass">
                <div className="homeServices__metaTop">
                  <span className="homeServices__dots" aria-hidden>•••</span>
                  {s.priceLabel && (
                    <span className="homeServices__priceBadge">{s.priceLabel}</span>
                  )}
                </div>

                <h3 className="homeServices__titleGlass">{s.title}</h3>
                {s.tagline && <p className="homeServices__desc">{s.tagline}</p>}

                <div className="homeServices__ctaRow">
                  <CTAButton
                    text="Book Consultation"
                    link={s.bookingHref}
                    ariaLabel={`Book: ${s.title}`}
                  />
                  <CTAButtonSecondary
                    text="Learn More"
                    link={s.detailsHref}
                    ariaLabel={`Learn more: ${s.title}`}
                  />
                </div>
              </div>

              {s.badge && s.badge !== 'none' && (
                <div className={`homeServices__badge homeServices__badge--${s.badge}`}>
                  {s.badge}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="homeServices__ctaBanner" data-animate style={{ ['--stagger' as any]: items.length + 1 }}>
          <p>Want to explore all coaching and program options?</p>
          <CTAButton text="View All Services" link="/services" ariaLabel="View all services" />
        </div>
      </div>
    </section>
  )
}

export default HomeServices
