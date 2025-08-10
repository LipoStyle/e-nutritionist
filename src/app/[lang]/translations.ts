import { Locale } from './i18n/utils';

export const homeHeroTranslations: Record<
  Locale,
  { description: string; message: string;bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      'Empowering individuals to optimize their nutrition for improved health, performance, and overall well-being.',
    message: "Ready to take the next step",
    bookText: 'Book a Consultation',
    ariaLabel: 'Home page hero: message and book consultation',
  },
  es: {
    description:
      'Empoderamos a las personas para optimizar su nutrición y mejorar su salud, rendimiento y bienestar general.',
    message: "Listo para dar el siguiente paso",
    bookText: 'Reserva una consulta',
    ariaLabel: 'Héroe de inicio: mensaje y reserva de consulta',
  },
  el: {
    description:
      'Ενδυναμώνουμε τους ανθρώπους να βελτιστοποιήσουν τη διατροφή τους για καλύτερη υγεία, επίδοση και συνολική ευεξία.',
    message: " Έτημοι για το επόμενο βήμα?",
    bookText: 'Κλείσε ραντεβού',
    ariaLabel: 'Ήρωας αρχικής σελίδας: μήνυμα και κράτηση ραντεβού',
  },
};
