import { Locale } from '../i18n/utils';

export const serviceHeroTranslations: Record<
  Locale,
  { description: string; message: string; bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      'Explore our range of expert-led nutrition and wellness services, designed to help you eat better, move smarter, and feel your best—no matter your starting point.',
    message: 'Ready to take the next step?',
    bookText: 'Book a Consultation',
    ariaLabel: 'Service page hero: message and book consultation',
  },
  es: {
    description:
      'Explora nuestra gama de servicios de nutrición y bienestar dirigidos por expertos, diseñados para ayudarte a comer mejor, moverte con inteligencia y sentirte en tu mejor momento, sin importar tu punto de partida.',
    message: '¿Listo para dar el siguiente paso?',
    bookText: 'Reserva una consulta',
    ariaLabel: 'Héroe de servicios: mensaje y reserva de consulta',
  },
  el: {
    description:
      'Ανακάλυψε τη γκάμα υπηρεσιών διατροφής και ευεξίας με καθοδήγηση ειδικών, σχεδιασμένων για να σε βοηθήσουν να τρέφεσαι καλύτερα, να κινείσαι πιο έξυπνα και να νιώθεις υπέροχα—όποιο κι αν είναι το σημείο εκκίνησής σου.',
    message: 'Έτοιμοι για το επόμενο βήμα;',
    bookText: 'Κλείσε ραντεβού',
    ariaLabel: 'Ήρωας σελίδας υπηρεσιών: μήνυμα και κράτηση ραντεβού',
  },
};
