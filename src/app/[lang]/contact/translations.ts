import { Locale } from '../i18n/utils';

export const contactHeroTranslations: Record<
  Locale,
  { description: string; message: string; bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      "Have questions about our services or need help choosing the right plan? We’d love to hear from you! Reach out anytime — whether it’s about bookings, nutrition guidance, or general support, we're just a message away.",
    message: 'Ready to take the next step?',
    bookText: 'Book a Consultation',
    ariaLabel: 'Contact page hero: message and book consultation',
  },
  es: {
    description:
      '¿Tienes preguntas sobre nuestros servicios o necesitas ayuda para elegir el plan adecuado? ¡Nos encantaría saber de ti! Contáctanos en cualquier momento — ya sea sobre reservas, orientación nutricional o soporte general, estamos a solo un mensaje de distancia.',
    message: '¿Listo para dar el siguiente paso?',
    bookText: 'Reserva una consulta',
    ariaLabel: 'Héroe de la página de contacto: mensaje y reserva de consulta',
  },
  el: {
    description:
      'Έχεις ερωτήσεις για τις υπηρεσίες μας ή χρειάζεσαι βοήθεια για να επιλέξεις το κατάλληλο πρόγραμμα; Θα χαρούμε να ακούσουμε νέα σου! Επικοινώνησε μαζί μας οποιαδήποτε στιγμή — είτε πρόκειται για κρατήσεις, διατροφική καθοδήγηση ή γενική υποστήριξη, είμαστε πάντα ένα μήνυμα μακριά.',
    message: 'Έτοιμοι για το επόμενο βήμα;',
    bookText: 'Κλείσε ραντεβού',
    ariaLabel: 'Ήρωας σελίδας επικοινωνίας: μήνυμα και κράτηση ραντεβού',
  },
};
