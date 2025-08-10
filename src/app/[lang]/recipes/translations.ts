import { Locale } from '../i18n/utils';

export const recipesHeroTranslations: Record<
  Locale,
  { description: string; message: string; bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      "Explore a variety of easy, balanced, and goal-oriented recipes designed to fuel your body and satisfy your taste buds. Whether you're eating for performance, weight management, or simply wellness, you'll find meals that are as nourishing as they are delicious.",
    message: 'Ready to take the next step?',
    bookText: 'Book a Consultation',
    ariaLabel: 'Recipes page hero: message and book consultation',
  },
  es: {
    description:
      'Explora una variedad de recetas fáciles, equilibradas y orientadas a objetivos, diseñadas para nutrir tu cuerpo y satisfacer tu paladar. Ya sea que comas para el rendimiento, el control de peso o simplemente por bienestar, encontrarás comidas tan nutritivas como deliciosas.',
    message: '¿Listo para dar el siguiente paso?',
    bookText: 'Reserva una consulta',
    ariaLabel: 'Héroe de la página de recetas: mensaje y reserva de consulta',
  },
  el: {
    description:
      'Ανακάλυψε μια ποικιλία από εύκολες, ισορροπημένες και προσανατολισμένες σε στόχους συνταγές, σχεδιασμένες να τροφοδοτούν το σώμα σου και να ικανοποιούν τον ουρανίσκο σου. Είτε τρέφεσαι για απόδοση, για έλεγχο βάρους ή απλώς για ευεξία, θα βρεις γεύματα τόσο θρεπτικά όσο και νόστιμα.',
    message: 'Έτοιμοι για το επόμενο βήμα;',
    bookText: 'Κλείσε ραντεβού',
    ariaLabel: 'Ήρωας σελίδας συνταγών: μήνυμα και κράτηση ραντεβού',
  },
};
