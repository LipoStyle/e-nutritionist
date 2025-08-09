export const SUPPORTED_LANGS = ['en', 'es', 'el'] as const;
export type AboutLocale = typeof SUPPORTED_LANGS[number];

export const aboutHeroTranslations: Record<AboutLocale, {
  title: string;
  description: string;
  message: string;
  bookText: string;
  ariaLabel: string;
}> = {
  en: {
    title: 'About E-Nutritionist',
    description:
      'At e-nutritionist, we offer personalized nutrition and lifestyle guidance to help you reach your health goals. Founded by Thymios Arvanitis, our mission is to support your journey with expert advice, tailored plans, and real-world results.',
    message: 'Ready to take the next step?',
    bookText: 'Book Now',
    ariaLabel: 'About E-Nutritionist hero section',
  },
  es: {
    title: 'Sobre E-Nutritionist',
    description:
      'En e-nutritionist, ofrecemos orientación personalizada en nutrición y estilo de vida para ayudarte a alcanzar tus objetivos de salud. Fundado por Thymios Arvanitis, nuestra misión es apoyar tu camino con asesoramiento experto, planes personalizados y resultados reales.',
    message: '¿Listo para dar el siguiente paso?',
    bookText: 'Reservar ahora',
    ariaLabel: 'Sección principal de Sobre E-Nutritionist',
  },
  el: {
    title: 'Σχετικά με το E-Nutritionist',
    description:
      'Στο e-nutritionist, προσφέρουμε εξατομικευμένη καθοδήγηση διατροφής και τρόπου ζωής για να σας βοηθήσουμε να πετύχετε τους στόχους υγείας σας. Ιδρυτής είναι ο Θύμιος Αρβανίτης, και η αποστολή μας είναι να στηρίξουμε το ταξίδι σας με εξειδικευμένες συμβουλές, προσαρμοσμένα πλάνα και πραγματικά αποτελέσματα.',
    message: 'Έτοιμοι να κάνετε το επόμενο βήμα;',
    bookText: 'Κλείστε ραντεβού',
    ariaLabel: 'Κεντρική ενότητα Σχετικά με το E-Nutritionist',
  },
};
