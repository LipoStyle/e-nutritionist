// =============================================================
// File: src/app/components/shared/hero-home/data/slides.es.ts
// Description: Spanish slide content (template). Adjust copy later.
// =============================================================
import type { HeroSlide } from '../HeroHome.tsx'

export const slides: HeroSlide[] = [
  {
    id: 'audit',
    title: 'Descubre tu Physique Audit',
    subtitle: '90 minutos para un plan nutricional personalizado y científico.',
    backgroundImage: '/assets/images/hero-home/image1.jpg',
    ctaPrimary: {
      label: 'Reservar consulta',
      href: 'https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=',
    },
    ctaSecondary: { label: 'Ver servicios', href: '/services' },
    ariaLabel: 'Destacado: Physique Audit',
  },
  {
    id: 'intensive',
    title: '12 semanas. Resultados reales.',
    subtitle: 'Acompañamiento 1‑a‑1 para romper estancamientos y mantener resultados.',
    backgroundImage: '/assets/images/hero-home/image2.jpg',
    ctaPrimary: {
      label: 'Explorar coaching',
      href: '/services/3-month-physique-efficiency-intensive',
    },
    ctaSecondary: { label: 'Más información', href: '/services' },
    ariaLabel: 'Destacado: Programa de 3 meses',
  },
  {
    id: 'ebook',
    title: 'Manual de Macros en 15 Minutos',
    subtitle: '30+ recetas altas en proteína • plan de 7 días • etiquetas.',
    backgroundImage: '/assets/images/hero-home/image3.jpg',
    ctaPrimary: { label: 'Obtener E‑Book', href: '/shop/15-minute-macro-manual' },
    ctaSecondary: { label: 'Ver recetas', href: '/recipes' },
    ariaLabel: 'Imán de leads: E‑book',
  },
]
