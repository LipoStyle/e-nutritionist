// src/app/components/Footer/FooterNavs/translations.ts
type Lang = 'en' | 'es' | 'el';

const t = {
  en: {
    titles: { policies: 'Policies', pages: 'Pages', contact: 'Contact Info' },
    policies: {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookies: 'Cookies Policy',
    },
    pages: {
      services: 'Services',
      blogs: 'Blogs',
      recipes: 'Recipes',
      about: 'About',
      contact: 'Contact',
    },
    contact: {
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      addressLabel: 'Address',
      // Values can be static or env-driven later
      email: 'thimiosarvanitis@gmail.com',
      phone: '+34613497305',
      address: 'Calle Cañete 18, Madrid, Spain',
    },
  },
  es: {
    titles: { policies: 'Políticas', pages: 'Páginas', contact: 'Contacto' },
    policies: {
      terms: 'Términos de servicio',
      privacy: 'Política de privacidad',
      cookies: 'Política de cookies',
    },
    pages: {
      services: 'Servicios',
      blogs: 'Blog',
      recipes: 'Recetas',
      about: 'Acerca de',
      contact: 'Contacto',
    },
    contact: {
      emailLabel: 'Correo',
      phoneLabel: 'Teléfono',
      addressLabel: 'Dirección',
      email: 'thimiosarvanitis@gmail.com',
      phone: '+34613497305',
      address: 'Calle Cañete 18, Madrid, España',
    },
  },
  el: {
    titles: { policies: 'Πολιτικές', pages: 'Σελίδες', contact: 'Επικοινωνία' },
    policies: {
      terms: 'Όροι Χρήσης',
      privacy: 'Πολιτική Απορρήτου',
      cookies: 'Πολιτική Cookies',
    },
    pages: {
      services: 'Υπηρεσίες',
      blogs: 'Άρθρα',
      recipes: 'Συνταγές',
      about: 'Σχετικά',
      contact: 'Επικοινωνία',
    },
    contact: {
      emailLabel: 'Email',
      phoneLabel: 'Τηλέφωνο',
      addressLabel: 'Διεύθυνση',
      email: 'thimiosarvanitis@gmail.com',
      phone: '+34613497305',
      address: 'Calle Cañete 18, Μαδρίτη, Ισπανία',
    },
  },
} satisfies Record<Lang, any>;

export type { Lang };
export default t;
