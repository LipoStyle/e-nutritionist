'use client'

import Image from 'next/image'
import React from 'react'

import './Hero.css'
import CTAButton from '../../buttons/CTAButton'

type HeroProps = {
  title?: string
  description?: string
  message?: string // text above the Book button
  bookText?: string // localized button label (default: "Book Now")
  bookHref?: string // link for the Book button
  bgImage?: string // e.g. "/assets/images/hero/about.jpg"
  overlayOpacity?: number // 0..1 overlay strength (default 0.45)
  offsetHeader?: boolean // push hero below fixed header
  height?: 'compact' | 'default' | 'tall'
  className?: string
  ariaLabel?: string // accessibility label when no title
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 // NEW
  imagePriority?: boolean // NEW (true on homepage for LCP)
}

export default function Hero({
  title,
  description,
  message = 'Ready to start?',
  bookText = 'Book Now',
  bookHref,
  bgImage,
  overlayOpacity = 0.45,
  offsetHeader = true,
  height = 'default',
  className = '',
  ariaLabel = 'Page hero',
  headingLevel = 1,
  imagePriority = false,
}: HeroProps) {
  const classes =
    `hero hero--${height}` +
    (offsetHeader ? ' hero--offset-header' : '') +
    (className ? ` ${className}` : '')

  // Accessible heading handling
  const Heading = (`h${headingLevel}` as unknown) as keyof JSX.IntrinsicElements
  const titleId = title ? 'hero-title' : undefined
  const sectionA11y = title ? { 'aria-labelledby': titleId } : { 'aria-label': ariaLabel }

  return (
    <section className={classes} {...sectionA11y}>
      {/* Background image */}
      {bgImage && (
        <div className="hero__bg" aria-hidden="true">
          <Image
            src={bgImage}
            alt=""
            fill
            priority={imagePriority}
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Overlay — opacity is forced inline so it wins over theme presets */}
      <div className="hero__overlay" style={{ opacity: overlayOpacity }} aria-hidden="true" />

      {/* Centered stack */}
      <div className="hero__center">
        {title && <Heading id={titleId} className="hero__title anim-fade-up">{title}</Heading>}
        {description && <p className="hero__description anim-fade-up-delayed">{description}</p>}

        {/* Column CTA: show only if message or button exists */}
        {(message || bookHref) && (
          <div
            className="hero__ctaColumn anim-fade-up-late"
            {...(bookHref ? { role: 'group', 'aria-label': 'Hero quick action' } : {})}
          >
            {message && <span className="hero__message">{message}</span>}
            {bookHref && <CTAButton text={bookText} link={bookHref} ariaLabel={bookText} />}
          </div>
        )}

        {/* Scroll cue */}
        <div className="hero__scrollCue anim-fade-up-later" aria-hidden="true">
          <div className="mouse"><div className="wheel" /></div>
          <div className="arrow" />
        </div>
      </div>
    </section>
  )
}
