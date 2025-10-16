'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import './Hero.css'
import CTAButton from '../../buttons/CTAButton'

type HeroProps = {
  title?: string
  description?: string
  message?: string
  bookText?: string
  bookHref?: string
  bgImage?: string
  overlayOpacity?: number
  offsetHeader?: boolean
  height?: 'compact' | 'default' | 'tall'
  className?: string
  ariaLabel?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  imagePriority?: boolean
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

// 🔒 Utility: render only after client mount
function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
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
  const hasMounted = useHasMounted()
  if (!hasMounted) return null // ✅ avoid hydration mismatch

  const classes =
    `hero hero--${height}` +
    (offsetHeader ? ' hero--offset-header' : '') +
    (className ? ` ${className}` : '')

  const headingTag = (`h${headingLevel}` as HeadingTag)
  const Heading: React.ElementType = headingTag
  const titleId = title ? 'hero-title' : undefined
  const sectionA11y = title ? { 'aria-labelledby': titleId } : { 'aria-label': ariaLabel }

  return (
    <section className={classes} {...sectionA11y} suppressHydrationWarning>
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

      {/* Overlay */}
      <div
        className="hero__overlay"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="hero__center">
        {title && <Heading id={titleId} className="hero__title anim-fade-up">{title}</Heading>}
        {description && (
          <p className="hero__description anim-fade-up-delayed">{description}</p>
        )}

        {(message || bookHref) && (
          <div
            className="hero__ctaColumn anim-fade-up-late"
            {...(bookHref ? { role: 'group', 'aria-label': 'Hero quick action' } : {})}
          >
            {message && <span className="hero__message">{message}</span>}
            {bookHref && (
              <CTAButton text={bookText} link={bookHref} ariaLabel={bookText} />
            )}
          </div>
        )}

        <div className="hero__scrollCue anim-fade-up-later" aria-hidden="true">
          <div className="mouse"><div className="wheel" /></div>
          <div className="arrow" />
        </div>
      </div>
    </section>
  )
}
