import { Locale } from '../i18n/utils'

export const bookingHeroTranslations: Record<
  Locale,
  { description: string; message: string; bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      'Start your personalized nutrition journey today. Fill out the form below to request your consultation, and we’ll be in touch to confirm the details.',
    message: 'Your journey starts here',
    bookText: '',
    ariaLabel: 'Booking page hero: consultation form introduction',
  },
  es: {
    description:
      'Comienza hoy tu viaje de nutrición personalizada. Completa el formulario a continuación para solicitar tu consulta y nos pondremos en contacto contigo para confirmar los detalles.',
    message: 'Tu viaje comienza aquí',
    bookText: '',
    ariaLabel: 'Héroe de la página de reservas: introducción al formulario de consulta',
  },
  el: {
    description:
      'Ξεκίνησε σήμερα το εξατομικευμένο σου ταξίδι στη διατροφή. Συμπλήρωσε την παρακάτω φόρμα για να ζητήσεις το ραντεβού σου και θα επικοινωνήσουμε μαζί σου για να επιβεβαιώσουμε τις λεπτομέρειες.',
    message: 'Το ταξίδι σου ξεκινά εδώ',
    bookText: '',
    ariaLabel: 'Ήρωας σελίδας κράτησης: εισαγωγή φόρμας ραντεβού',
  },
}
