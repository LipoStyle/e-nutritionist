import { Locale } from '../i18n/utils';

export const blogsHeroTranslations: Record<
  Locale,
  { description: string; message: string; bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      'Stay informed and inspired with expert-backed articles on nutrition, fitness, mindset, and healthy living.',
    message: 'Ready to take the next step?',
    bookText: 'Book a Consultation',
    ariaLabel: 'Blogs page hero: message and book consultation',
  },
  es: {
    description:
      'Mantente informado e inspirado con artículos respaldados por expertos sobre nutrición, ejercicio, mentalidad y vida saludable.',
    message: '¿Listo para dar el siguiente paso?',
    bookText: 'Reserva una consulta',
    ariaLabel: 'Héroe de la página de blogs: mensaje y reserva de consulta',
  },
  el: {
    description:
      'Μείνε ενημερωμένος και εμπνευσμένος με άρθρα υποστηριγμένα από ειδικούς για τη διατροφή, την άσκηση, τη νοοτροπία και την υγιεινή ζωή.',
    message: 'Έτοιμοι για το επόμενο βήμα;',
    bookText: 'Κλείσε ραντεβού',
    ariaLabel: 'Ήρωας σελίδας ιστολογίων: μήνυμα και κράτηση ραντεβού',
  },
};
