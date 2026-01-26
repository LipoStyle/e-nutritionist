// app/[lang]/(public)/services/data.ts
import type { Lang } from "@/lib/i18n/locale";

/* ─────────────────────────
   Services Hero (already exists)
   ───────────────────────── */
export type ServicesHeroContent = {
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export const servicesHeroData: Record<Lang, ServicesHeroContent> = {
  en: {
    title: "Professional Nutrition Services",
    description:
      "Comprehensive nutrition consulting services tailored to your unique needs, goals, and lifestyle. From athletic performance to weight management, we have the expertise to help you succeed.",
    cta: {
      label: "Book Free Consultation",
      href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
  },
  es: {
    title: "Servicios Profesionales de Nutrición",
    description:
      "Servicios integrales de consultoría nutricional adaptados a tus necesidades, objetivos y estilo de vida. Desde el rendimiento deportivo hasta el control de peso, tenemos la experiencia para ayudarte a alcanzar el éxito.",
    cta: {
      label: "Reserva una Consulta Gratuita",
      href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
  },
  el: {
    title: "Επαγγελματικές Υπηρεσίες Διατροφής",
    description:
      "Ολοκληρωμένες υπηρεσίες διατροφικής συμβουλευτικής, προσαρμοσμένες στις ανάγκες, τους στόχους και τον τρόπο ζωής σας. Από αθλητική απόδοση έως διαχείριση βάρους, διαθέτουμε την τεχνογνωσία για να σας οδηγήσουμε στην επιτυχία.",
    cta: {
      label: "Κλείσε Δωρεάν Συνεδρία",
      href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
  },
};

/* ─────────────────────────
   Services Greeting (NEW)
   ───────────────────────── */

export type ServicesGreetingContent = {
  title: string;
  subtitle: string;
};

export const servicesGreetingData: Record<Lang, ServicesGreetingContent> = {
  en: {
    title: "Our Services",
    subtitle:
      "Choose from our range of professional nutrition services designed to help you achieve your health and performance goals.",
  },
  es: {
    title: "Nuestros Servicios",
    subtitle:
      "Elige entre nuestra gama de servicios profesionales de nutrición diseñados para ayudarte a alcanzar tus objetivos de salud y rendimiento.",
  },
  el: {
    title: "Οι Υπηρεσίες μας",
    subtitle:
      "Επιλέξτε από μια σειρά επαγγελματικών υπηρεσιών διατροφής, σχεδιασμένων για να σας βοηθήσουν να πετύχετε τους στόχους υγείας και απόδοσής σας.",
  },
};
export const servicesGridUiData: Record<
  Lang,
  { cardCtaLabel: string; durationLabel: (m: number) => string }
> = {
  en: { cardCtaLabel: "Learn More & Book →", durationLabel: (m) => `${m} min` },
  es: {
    cardCtaLabel: "Ver detalles y reservar →",
    durationLabel: (m) => `${m} min`,
  },
  el: {
    cardCtaLabel: "Μάθε περισσότερα & Κλείσε →",
    durationLabel: (m) => `${m} λεπτά`,
  },
};
// how we work toghter translations
export type HowWeWorkStep = {
  n: number;
  title: string;
  desc: string;
};

export type HowWeWorkContent = {
  title: string;
  subtitle: string;
  steps: HowWeWorkStep[];
};

export const howWeWorkData: Record<Lang, HowWeWorkContent> = {
  en: {
    title: "How We Work Together",
    subtitle:
      "Our proven process ensures you get effective and personalized guidance.",
    steps: [
      {
        n: 1,
        title: "Initial Consultation",
        desc: "Comprehensive assessment of your goals, lifestyle, and preferences.",
      },
      {
        n: 2,
        title: "Custom Plan Creation",
        desc: "A personalized plan tailored to your needs and objectives.",
      },
      {
        n: 3,
        title: "Implementation Support",
        desc: "Ongoing guidance to successfully apply your plan.",
      },
      {
        n: 4,
        title: "Progress Monitoring",
        desc: "Regular check-ins and adjustments for continued results.",
      },
    ],
  },

  es: {
    title: "Cómo Trabajamos Juntos",
    subtitle:
      "Nuestro proceso probado garantiza una guía efectiva y personalizada.",
    steps: [
      {
        n: 1,
        title: "Consulta Inicial",
        desc: "Evaluación completa de tus objetivos, estilo de vida y preferencias.",
      },
      {
        n: 2,
        title: "Creación de un Plan a Medida",
        desc: "Un plan personalizado adaptado a tus necesidades y metas.",
      },
      {
        n: 3,
        title: "Soporte en la Implementación",
        desc: "Acompañamiento continuo para aplicar el plan con éxito.",
      },
      {
        n: 4,
        title: "Seguimiento del Progreso",
        desc: "Revisiones periódicas y ajustes para mantener resultados.",
      },
    ],
  },

  el: {
    title: "Πώς Συνεργαζόμαστε",
    subtitle:
      "Η δοκιμασμένη διαδικασία μας εξασφαλίζει αποτελεσματική και εξατομικευμένη καθοδήγηση.",
    steps: [
      {
        n: 1,
        title: "Αρχική Συνεδρία",
        desc: "Ολοκληρωμένη αξιολόγηση στόχων, τρόπου ζωής και προτιμήσεων.",
      },
      {
        n: 2,
        title: "Δημιουργία Εξατομικευμένου Πλάνου",
        desc: "Ένα προσωπικό πλάνο προσαρμοσμένο στις ανάγκες και τους στόχους σου.",
      },
      {
        n: 3,
        title: "Υποστήριξη Εφαρμογής",
        desc: "Συνεχής καθοδήγηση για να εφαρμόσεις το πλάνο με επιτυχία.",
      },
      {
        n: 4,
        title: "Παρακολούθηση Προόδου",
        desc: "Τακτικά check-ins και προσαρμογές για σταθερά αποτελέσματα.",
      },
    ],
  },
};
// methods translations
export type ConsultationMethodItem = {
  title: string;
  desc: string;
};

export type ConsultationMethodsContent = {
  title: string;
  methods: ConsultationMethodItem[];
  imageAlt: string;
  imageSrc: string;
};

export const consultationMethodsData: Record<Lang, ConsultationMethodsContent> =
  {
    en: {
      title: "Consultation Methods",
      imageAlt: "Consultation",
      imageSrc: "/images/nutrition-education_20251211_133603.png",
      methods: [
        {
          title: "In-Person Consultations",
          desc: "Face-to-face meetings for comprehensive assessments.",
        },
        {
          title: "Virtual Consultations",
          desc: "Online sessions for convenience and accessibility from anywhere.",
        },
        {
          title: "Hybrid Approach",
          desc: "A combination of in-person and virtual sessions based on your needs.",
        },
      ],
    },

    es: {
      title: "Modalidades de Consulta",
      imageAlt: "Consulta",
      imageSrc: "/images/nutrition-education_20251211_133603.png",
      methods: [
        {
          title: "Consultas Presenciales",
          desc: "Reuniones cara a cara para evaluaciones completas.",
        },
        {
          title: "Consultas Virtuales",
          desc: "Sesiones online para comodidad y acceso desde cualquier lugar.",
        },
        {
          title: "Enfoque Híbrido",
          desc: "Combinación de sesiones presenciales y virtuales según tus necesidades.",
        },
      ],
    },

    el: {
      title: "Τρόποι Συνεδρίας",
      imageAlt: "Συνεδρία",
      imageSrc: "/images/nutrition-education_20251211_133603.png",
      methods: [
        {
          title: "Δια ζώσης Συνεδρίες",
          desc: "Συναντήσεις πρόσωπο με πρόσωπο για ολοκληρωμένη αξιολόγηση.",
        },
        {
          title: "Online Συνεδρίες",
          desc: "Online συναντήσεις για ευκολία και πρόσβαση από οπουδήποτε.",
        },
        {
          title: "Υβριδική Προσέγγιση",
          desc: "Συνδυασμός δια ζώσης και online συνεδριών ανάλογα με τις ανάγκες σου.",
        },
      ],
    },
  };
// cta banner translations
export type ServicesCtaContent = {
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

export const servicesCtaData: Record<Lang, ServicesCtaContent> = {
  en: {
    title: "Ready to Start Your Nutrition Journey?",
    subtitle:
      "Take the first step towards better health and performance. Book your free consultation today and discover how personalized nutrition can transform your life.",
    primary: {
      label: "Book Free Consultation",
      href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
    secondary: { label: "Learn About Our Approach", href: "/about" },
  },
  es: {
    title: "¿Listo para Empezar tu Viaje de Nutrición?",
    subtitle:
      "Da el primer paso hacia una mejor salud y rendimiento. Reserva tu consulta gratuita hoy y descubre cómo la nutrición personalizada puede transformar tu vida.",
    primary: {
      label: "Reservar Consulta Gratuita",
      href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
    secondary: { label: "Conoce Mi Enfoque", href: "/about" },
  },
  el: {
    title: "Έτοιμος να Ξεκινήσεις το Διατροφικό σου Ταξίδι;",
    subtitle:
      "Κάνε το πρώτο βήμα για καλύτερη υγεία και απόδοση. Κλείσε σήμερα τη δωρεάν συνεδρία σου και δες πώς η εξατομικευμένη διατροφή μπορεί να αλλάξει τη ζωή σου.",
    primary: {
      label: "Κλείσε Δωρεάν Συνεδρία",
      href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
    secondary: { label: "Μάθε για την Προσέγγιση", href: "/about" },
  },
};
