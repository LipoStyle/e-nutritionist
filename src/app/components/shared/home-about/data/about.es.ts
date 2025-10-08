import type { HomeAboutData } from '../types'

export const aboutES: HomeAboutData = {
  id: 'about',
  intro: 'Sobre el Coach',
  title: 'No se trata solo de comer bien. Se trata de ver por fin los resultados que te has ganado.',
  lead:
    'Cierro la brecha entre tu esfuerzo y resultados reales con una nutrición basada en evidencia que encaja con tu vida.',
  paragraphs: [
    'Existe una brecha frustrante entre esforzarse y ver realmente resultados en el espejo. Lo sé porque he estado ahí. Mi camino no empezó con un plan perfecto: empezó con una mirada honesta al espejo, con sobrepeso, sabiendo que merecía estar más fuerte y más sano.',
    'A los 20 decidí que todo tenía que cambiar. El entrenamiento encendió la chispa; la nutrición lo hizo sostenible y potente. Eso me llevó a estudiar la ciencia, separar hechos de ficción y crear métodos que funcionan en la vida real.'
  ],
  credentials: [
    'MSc, UCM',
    'MSc, Nutrición en Fútbol (FSI)',
    'BSc, Viena'
  ],
  usps: [
    'Basado en evidencia, no en tendencias',
    'Diseñado para personas ocupadas',
    'Coaching con enfoque educativo'
  ],
  image: '/assets/images/about-home/profile-image.png',
  bestServiceHref: "/service",
  aboutHref : "/about",
  ctaPrimaryText: 'Empieza con el mejor programa',
  ctaPrimaryHref: '/services/physique-mastery',
  ctaSecondaryText: 'Saber más sobre mí',
  ctaSecondaryHref: '/about'
}
