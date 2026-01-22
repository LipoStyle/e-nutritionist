import type { Lang } from "@/lib/i18n/locale";

export const homeServicesPreviewUi: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    cardCta: string;
    viewAll: string;
    durationLabel: (mins: number) => string;
  }
> = {
  en: {
    title: "Our Professional Services",
    subtitle:
      "Comprehensive nutrition consulting tailored to your unique needs and goals",
    cardCta: "Learn More",
    viewAll: "View All Services",
    durationLabel: (mins) => `${mins} min`,
  },
  es: {
    title: "Nuestros Servicios Profesionales",
    subtitle:
      "Asesoría nutricional integral adaptada a tus necesidades y objetivos",
    cardCta: "Ver más",
    viewAll: "Ver todos los servicios",
    durationLabel: (mins) => `${mins} min`,
  },
  el: {
    title: "Οι Επαγγελματικές Υπηρεσίες μας",
    subtitle:
      "Ολοκληρωμένη διατροφική καθοδήγηση, προσαρμοσμένη στις ανάγκες και τους στόχους σου",
    cardCta: "Περισσότερα",
    viewAll: "Δείτε όλες τις υπηρεσίες",
    durationLabel: (mins) => `${mins} λεπ`,
  },
};
