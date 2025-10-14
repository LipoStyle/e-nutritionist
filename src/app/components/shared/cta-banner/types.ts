export type Lang = 'en' | 'es' | 'el'

export interface CTABannerData {
  id: string
  kicker?: string       // H3 (small)
  headline: string      // H2 (main)
  subtext?: string      // small paragraph
  primaryText: string
  primaryHref: string
  secondaryText?: string
  secondaryHref?: string
  bgImage?: string
  overlayOpacity?: number // 0–1
}
