// Shared type for service cards across translations
export interface ServiceCardData {
  id: string
  title: string
  tagline: string
  priceLabel: string
  image: string
  badge?: string
  detailsHref: string
  bookingHref: string
  showHomeService?: boolean // NEW: if true, appears on HomeServices
}
