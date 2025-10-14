'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import './CTABanner.css'

import CTAButton from '@/app/components/buttons/CTAButton'
import CTAButtonSecondary from '@/app/components/buttons/CTAButtonSecondary'

import type { CTABannerData, Lang } from './types'
import { bannerEN } from './data/banner.en'
import { bannerES } from './data/banner.es'
import { bannerEL } from './data/banner.el'

const SUPPORTED: Lang[] = ['en', 'es', 'el']
const withLang = (lang: Lang, path?: string) => {
  if (!path) return `/${lang}`
  const parts = (path || '').split('/').filter(Boolean)
  if (parts.length > 0 && SUPPORTED.includes(parts[0] as Lang)) return path as string
  return `/${lang}${path?.startsWith('/') ? '' : '/'}${path ?? ''}`
}

export interface CTABannerProps {
  lang?: Lang
  dataOverride?: Partial<CTABannerData>
}

const CTABanner: React.FC<CTABannerProps> = ({ lang, dataOverride }) => {
  const pathname = usePathname() || '/'
  const detected = useMemo<Lang>(() => {
    const seg = pathname.split('/').filter(Boolean)[0]
    return (SUPPORTED.includes(seg as Lang) ? (seg as Lang) : 'en')
  }, [pathname])
  const locale = (lang ?? detected) as Lang

  const base: CTABannerData =
    locale === 'es' ? bannerES :
    locale === 'el' ? bannerEL :
    bannerEN

  const data: CTABannerData = { ...base, ...dataOverride }

  const style: React.CSSProperties = {
    ...(data.bgImage ? { ['--cta-bg' as any]: `url(${data.bgImage})` } : {}),
    ...(typeof data.overlayOpacity === 'number'
      ? { ['--cta-overlay' as any]: String(data.overlayOpacity) }
      : {}),
  }

  return (
    <section className="ctaBanner" aria-labelledby="cta-banner-title" style={style}>
      <div className="ctaBanner__bg" aria-hidden />
      <div className="ctaBanner__overlay" aria-hidden />
      <div className="ctaBanner__inner">
        {data.kicker && <h3 className="ctaBanner__kicker">{data.kicker}</h3>}
        <h2 id="cta-banner-title" className="ctaBanner__title">{data.headline}</h2>
        {data.subtext && <p className="ctaBanner__subtitle">{data.subtext}</p>}

        <div className="ctaBanner__actions">
          <CTAButton
            text={data.primaryText}
            link={withLang(locale, data.primaryHref)}
            ariaLabel={data.primaryText}
          />
          {data.secondaryText && data.secondaryHref && (
            <CTAButtonSecondary
              text={data.secondaryText}
              link={withLang(locale, data.secondaryHref)}
              ariaLabel={data.secondaryText}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default CTABanner
