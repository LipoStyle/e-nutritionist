export type Lang = 'en' | 'es' | 'el'

export interface HomeAboutData {
  id: string
  intro?: string           // small h3 intro (e.g. "About the Coach")
  title: string            // main h2 headline
  lead?: string            // short supporting paragraph
  paragraphs?: string[]    // optional longer content
  credentials: string[]    // 3 credentials in a row
  usps: string[]           // 3 unique selling points
  bestServiceHref: string
  aboutHref : string
  image: string            // hero/side image
  ctaPrimaryText?: string  // button label
  ctaPrimaryHref?: string  // best service link
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
}
