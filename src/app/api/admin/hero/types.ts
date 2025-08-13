export type HeroPayload = {
  pageKey: string
  language: 'en' | 'es' | 'el'
  title?: string | null
  description?: string | null
  message?: string | null
  bookText?: string | null
  bookHref?: string | null
  bgImage?: string | null
  overlayOpacity?: number
  offsetHeader?: boolean
  height?: 'compact'|'default'|'tall'
}
