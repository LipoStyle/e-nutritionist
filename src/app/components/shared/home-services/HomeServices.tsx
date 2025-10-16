'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import './HomeServices.css'

import CTAButton from '@/app/components/buttons/CTAButton'
import CTAButtonSecondary from '@/app/components/buttons/CTAButtonSecondary'
import type { ServiceCardData } from './types'

import { servicesEN } from './data/services.en'
import { servicesES } from './data/services.es'
import { servicesEL } from './data/services.el'

type Lang = 'en' | 'es' | 'el'
const SUPPORTED: Lang[] = ['en', 'es', 'el']

const withLang = (lang: Lang, path: string) => {
  if (!path) return path
  const parts = path.split('/').filter(Boolean)
  if (parts.length > 0 && SUPPORTED.includes(parts[0] as Lang)) return path
  return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`
}

export interface HomeServicesProps {
  lang?: Lang
}

const HomeServices: React.FC<HomeServicesProps> = ({ lang }) => {
  const pathname = usePathname() || '/'
  const detected = useMemo<Lang>(() => {
    const seg = pathname.split('/').filter(Boolean)[0]
    return SUPPORTED.includes(seg as Lang) ? (seg as Lang) : 'en'
  }, [pathname])

  const locale = (lang ?? detected) as Lang
  const data =
    locale === 'es' ? servicesES :
    locale === 'el' ? servicesEL :
    servicesEN

  const items = data.filter((s: ServiceCardData) => s.showHomeService)

  // IntersectionObserver reveal-on-enter (supports repeat via data-animate-repeat)
  const sectionRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-animate]'))
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          const repeat = el.hasAttribute('data-animate-repeat')

          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            if (!repeat) {
              io.unobserve(el) // one-time animations stop observing
            }
          } else if (repeat) {
            // reset when leaving viewport so it can animate again on re-entry
            el.classList.remove('is-visible')
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.15,
      }
    )

    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="homeServices" aria-labelledby="home-services-title" ref={sectionRef}>
      <div className="homeServices__inner">
        {/* Intro */}
        <header className="homeServices__header" data-animate data-animate-repeat>
          <h2 id="home-services-title" className="homeServices__title">
            {locale === 'es' ? 'Servicios diseñados para tu camino' :
             locale === 'el' ? 'Υπηρεσίες προσαρμοσμένες στο ταξίδι σου' :
             'Tailored Services for Every Journey'}
          </h2>
          <p className="homeServices__subtitle">
            {locale === 'es'
              ? 'Tanto si empiezas, optimizas el rendimiento o buscas la maestría — elige el plan que encaja contigo.'
              : locale === 'el'
              ? 'Είτε ξεκινάς, είτε βελτιστοποιείς την απόδοση, είτε στοχεύεις στη μαεστρία — διάλεξε το πλάνο που σου ταιριάζει.'
              : 'Whether you’re starting out, optimizing performance, or striving for mastery — choose the plan that fits your lifestyle.'}
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
              data-animate-repeat
              style={{ ['--stagger' as any]: idx }}
            >
              <div
                className="homeServices__media"
                style={{ backgroundImage: `url(${s.image})` }}
                aria-hidden
              />

              <div className="homeServices__glass">
                <div className="homeServices__metaTop">
                  <span className="homeServices__dots" aria-hidden>•••</span>
                  {s.priceLabel && <span className="homeServices__priceBadge">{s.priceLabel}</span>}
                </div>

                <h3 className="homeServices__titleGlass">{s.title}</h3>
                {s.tagline && <p className="homeServices__desc">{s.tagline}</p>}

                <div className="homeServices__ctaRow">
                  <CTAButton
                    text={locale === 'es' ? 'Reservar consulta' : locale === 'el' ? 'Κράτηση συνεδρίας' : 'Book Consultation'}
                    link={withLang(locale, s.bookingHref)}
                    ariaLabel={`Book: ${s.title}`}
                  />
                  <CTAButtonSecondary
                    text={locale === 'es' ? 'Más información' : locale === 'el' ? 'Μάθε περισσότερα' : 'Learn More'}
                    link={withLang(locale, s.detailsHref)}
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
        <div
          className="homeServices__ctaBanner"
          data-animate
          data-animate-repeat
          style={{ ['--stagger' as any]: items.length + 1 }}
        >
          <p>
            {locale === 'es'
              ? '¿Quieres ver todas las opciones de programas y coaching?'
              : locale === 'el'
              ? 'Θέλεις να δεις όλες τις επιλογές προγραμμάτων και coaching;'
              : 'Want to explore all coaching and program options?'}
          </p>
          <CTAButton
            text={locale === 'es' ? 'Ver todos los servicios' : locale === 'el' ? 'Δες όλες τις υπηρεσίες' : 'View All Services'}
            link={withLang(locale, '/services')}
            ariaLabel="View all services"
          />
        </div>
      </div>
    </section>
  )
}

export default HomeServices
