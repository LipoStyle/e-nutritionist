// =============================================================
// File: src/app/components/shared/hero-home/data/slides.en.ts
// Description: English slide content (template). Replace images/labels as needed.
// =============================================================
import type { HeroSlide } from '../HeroHome.tsx'

export const slides: HeroSlide[] = [
  {
    id: 'audit',
    title: 'Unlock Your Physique Audit',
    subtitle: '90 minutes to a personalized, science-backed nutrition blueprint.',
    backgroundImage: '/assets/images/hero-home/image1.jpg',
    ctaPrimary: {
      label: 'Book Consultation',
      href: 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=',
    },
    ctaSecondary: { label: 'View Services', href: '/services' },
    ariaLabel: 'Service highlight: Physique Audit',
  },
  {
    id: 'intensive',
    title: '12 Weeks. Real Performance Gains.',
    subtitle: '1-on-1 coaching to break plateaus and sustain results.',
    backgroundImage: '/assets/images/hero-home/image2.jpg',
    ctaPrimary: {
      label: 'Explore Coaching',
      href: '/services/3-month-physique-efficiency-intensive',
    },
    ctaSecondary: { label: 'Learn More', href: '/services' },
    ariaLabel: 'Service highlight: 3-Month Intensive',
  },
  {
    id: 'ebook',
    title: '15-Minute Macro Manual',
    subtitle: '30+ high-protein recipes • 7-day plan • label decoding.',
    backgroundImage: '/assets/images/hero-home/image3.jpg',
    ctaPrimary: { label: 'Get the E‑Book', href: '/shop/15-minute-macro-manual' },
    ctaSecondary: { label: 'Browse Recipes', href: '/recipes' },
    ariaLabel: 'Lead magnet: E-book',
  },
]
