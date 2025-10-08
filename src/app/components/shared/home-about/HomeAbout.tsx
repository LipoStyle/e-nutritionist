'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { usePathname } from 'next/navigation'
import './HomeAbout.css'

import CTAButton from '@/app/components/buttons/CTAButton'
import CTAButtonSecondary from '@/app/components/buttons/CTAButtonSecondary'

import type { HomeAboutData, Lang } from './types'
import { aboutEN } from './data/about.en'
import { aboutES } from './data/about.es'
import { aboutEL } from './data/about.el'

const SUPPORTED: Lang[] = ['en', 'es', 'el']

/** Prefix path with current lang unless already prefixed */
const withLang = (lang: Lang, path?: string) => {
  if (!path) return `/${lang}`
  const parts = path.split('/').filter(Boolean)
  if (parts.length > 0 && SUPPORTED.includes(parts[0] as Lang)) return path
  return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`
}

export interface HomeAboutProps {
  lang?: Lang
}

const HomeAbout: React.FC<HomeAboutProps> = ({ lang }) => {
  const pathname = usePathname() || '/'
  const detected = useMemo<Lang>(() => {
    const seg = pathname.split('/').filter(Boolean)[0]
    return (SUPPORTED.includes(seg as Lang) ? (seg as Lang) : 'en')
  }, [pathname])
  const locale = (lang ?? detected) as Lang

  // pick localized data
  const data: HomeAboutData =
    locale === 'es' ? aboutES :
    locale === 'el' ? aboutEL :
    aboutEN

  // reveal on enter
  const rootRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-animate]'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { nodes.forEach(n => n.classList.add('is-visible')); return }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    nodes.forEach(n => io.observe(n))
    return () => io.disconnect()
  }, [])

  // safe slices for preview
  const creds = (data.credentials || []).slice(0, 3)
  const usps  = (data.usps || []).slice(0, 3)

  // button labels (fallbacks)
  const primaryLabel =
    data.ctaPrimaryText ||
    (locale === 'es' ? 'Empezar' : locale === 'el' ? 'Ξεκίνα' : 'Get Started')

  const secondaryLabel =
    data.ctaSecondaryText ||
    (locale === 'es' ? 'Saber más' : locale === 'el' ? 'Μάθε περισσότερα' : 'Learn More')

  // button links (fallbacks)
  const primaryHref = withLang(locale, data.ctaPrimaryHref || data.bestServiceHref || '/services')
  const secondaryHref = withLang(locale, data.ctaSecondaryHref || data.aboutHref || '/about')

  return (
    <section className="homeAbout" aria-labelledby="home-about-title" ref={rootRef}>
      <div className="homeAbout__inner">
        {/* LEFT: Image (sticky, top-aligned crop) */}
        <aside className="homeAbout__mediaWrap" data-animate>
          <div
            className="homeAbout__media homeAbout__media--top"
            style={{ backgroundImage: `url(${data.image})` }}
            role="img"
            aria-label={data.title}
          />
        </aside>

        {/* RIGHT: Content */}
        <div className="homeAbout__content">
          <header className="homeAbout__header" data-animate>
            {data.intro && <h3 className="homeAbout__intro">{data.intro}</h3>}
            <h2 id="home-about-title" className="homeAbout__title">{data.title}</h2>
            {data.lead && <p className="homeAbout__lead">{data.lead}</p>}
          </header>

          {/* 3 credentials in a row */}
          {creds.length > 0 && (
            <ul className="homeAbout__creds" data-animate>
              {creds.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          )}

          {/* 3 USPs */}
          {usps.length > 0 && (
            <ul className="homeAbout__usps" data-animate>
              {usps.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          )}

          {/* Optional longer copy */}
          {data.paragraphs?.length ? (
            <div className="homeAbout__body">
              {data.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="homeAbout__paragraph"
                  data-animate
                  style={{ ['--stagger' as any]: i }}
                >
                  {p}
                </p>
              ))}
            </div>
          ) : null}

          {/* Actions */}
          <div className="homeAbout__actions" data-animate>
            <CTAButton
              text={primaryLabel}
              link={primaryHref}
              ariaLabel={primaryLabel}
            />
            <CTAButtonSecondary
              text={secondaryLabel}
              link={secondaryHref}
              ariaLabel={secondaryLabel}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeAbout
