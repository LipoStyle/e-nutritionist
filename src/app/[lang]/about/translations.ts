import { Locale } from '../i18n/utils';

export const aboutHeroTranslations: Record<
  Locale,
  { description: string; message: string; bookText: string; ariaLabel: string }
> = {
  en: {
    description:
      'At e-nutritionist, we offer personalized nutrition and lifestyle guidance to help you reach your health goals. Founded by Thymios Arvanitis, our mission is to support your journey with expert advice, tailored plans, and real-world results.',
    message: 'Ready to take the next step?',
    bookText: 'Book a Consultation',
    ariaLabel: 'About page hero: message and book consultation',
  },
  es: {
    description:
      'En e-nutritionist, ofrecemos orientación personalizada en nutrición y estilo de vida para ayudarte a alcanzar tus objetivos de salud. Fundada por Thymios Arvanitis, nuestra misión es apoyar tu camino con asesoramiento experto, planes a medida y resultados reales.',
    message: '¿Listo para dar el siguiente paso?',
    bookText: 'Reserva una consulta',
    ariaLabel: 'Héroe de la página sobre nosotros: mensaje y reserva de consulta',
  },
  el: {
    description:
      'Στην e-nutritionist, προσφέρουμε εξατομικευμένη καθοδήγηση στη διατροφή και τον τρόπο ζωής για να σε βοηθήσουμε να πετύχεις τους στόχους υγείας σου. Ιδρυτής ο Θύμιος Αρβανίτης, η αποστολή μας είναι να υποστηρίξουμε το ταξίδι σου με εξειδικευμένες συμβουλές, εξατομικευμένα προγράμματα και πραγματικά αποτελέσματα.',
    message: 'Έτοιμοι για το επόμενο βήμα;',
    bookText: 'Κλείσε ραντεβού',
    ariaLabel: 'Ήρωας σελίδας σχετικά με εμάς: μήνυμα και κράτηση ραντεβού',
  },
};
