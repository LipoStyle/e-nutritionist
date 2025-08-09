'use client';

import Image from 'next/image';
import React from 'react';
import './Hero.css';
import CTAButton from '../../buttons/CTAButton';

type HeroProps = {
  title?: string;
  description?: string;
  message?: string;                 // text above the Book button
  bookText?: string;                // localized button label (default: "Book Now")
  bookHref?: string;                // link for the Book button
  bgImage?: string;                 // e.g. "/assets/images/hero/about.jpg"
  overlayOpacity?: number;          // 0..1 overlay strength (default 0.45)
  offsetHeader?: boolean;           // push hero below fixed header
  height?: 'compact' | 'default' | 'tall';
  className?: string;
  ariaLabel?: string;               // accessibility label for the section
};

export default function Hero({
  title,
  description,
  message = 'Ready to start?',
  bookText = 'Book Now',
  bookHref = '/booking',
  bgImage,
  overlayOpacity = 0.45,
  offsetHeader = true,
  height = 'default',
  className = '',
  ariaLabel = 'Page hero',
}: HeroProps) {
  const classes =
    `hero hero--${height}` +
    (offsetHeader ? ' hero--offset-header' : '') +
    (className ? ` ${className}` : '');

  return (
    <section className={classes} aria-label={ariaLabel}>
      {/* Background image */}
      {bgImage && (
        <div className="hero__bg" aria-hidden="true">
          <Image
            src={bgImage}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Overlay (fades via inline opacity) */}
      <div
        className="hero__overlay"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />

      {/* Centered stack */}
      <div className="hero__center">
        {title && <h1 className="hero__title anim-fade-up">{title}</h1>}
        {description && (
          <p className="hero__description anim-fade-up-delayed">{description}</p>
        )}

        {/* Column CTA: message above button */}
        <div
          className="hero__ctaColumn anim-fade-up-late"
          role="group"
          aria-label="Hero quick action"
        >
          {message && <span className="hero__message">{message}</span>}
          <CTAButton
            text={bookText}
            link={bookHref}
            ariaLabel={bookText}
          />
        </div>

        {/* Scroll cue */}
        <div className="hero__scrollCue anim-fade-up-later" aria-hidden="true">
          <div className="mouse"><div className="wheel" /></div>
          <div className="arrow" />
        </div>
      </div>
    </section>
  );
}
