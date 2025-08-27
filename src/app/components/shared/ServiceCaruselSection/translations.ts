// Keep this file next to the component
export type Lang = 'en' | 'es' | 'el';

export const servicesCarouselTranslations: Record<Lang, { title: string }> = {
  en: { title: 'Discover Our Services Tailored for You' },
  es: { title: 'Descubre Nuestros Servicios Diseñados para Ti' },
  el: { title: 'Ανακαλύψτε τις Υπηρεσίες μας που Σχεδιάστηκαν για Εσάς' },
};

export function getServicesCarouselStrings(lang: string) {
  const supported: Lang[] = ['en', 'es', 'el'];
  const key = (supported.includes(lang as Lang) ? lang : 'en') as Lang;
  return servicesCarouselTranslations[key];
}
