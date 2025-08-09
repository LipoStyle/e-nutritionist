// src/app/components/Footer/FooterNavs/translations.ts
type Lang = 'en' | 'es' | 'el';

interface FooterNavsTranslation {
  titles: {
    policies: string;
    pages: string;
    contact: string;
  };
  policies: {
    terms: string;
    privacy: string;
    cookies: string;
  };
  pages: {
    services: string;
    blogs: string;
    recipes: string;
    about: string;
    contact: string;
  };
  contact: {
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    email: string;
    phone: string;
    address: string;
  };
}

const t: Record<Lang, FooterNavsTranslation> = {
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
};

export type { Lang, FooterNavsTranslation };
export default t;
