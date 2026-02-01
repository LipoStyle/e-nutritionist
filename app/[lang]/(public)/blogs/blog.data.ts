type Lang = "en" | "es" | "el";

export const blogComingSoonUI: Record<
  Lang,
  {
    badge: string;
    title: string;
    subtitle: string;
    noteTitle: string;
    noteBody: string;
    primaryCta: string;
    secondaryCta: string;
  }
> = {
  en: {
    badge: "Coming soon",
    title: "Blog is on the way.",
    subtitle:
      "We’re preparing evidence-based articles, actionable guides, and practical tools. Check back soon.",
    noteTitle: "What to expect",
    noteBody:
      "Training, nutrition, recovery, habit systems, and performance-focused insights — clean, simple, and useful.",
    primaryCta: "Back to Home",
    secondaryCta: "Explore Services",
  },
  es: {
    badge: "Próximamente",
    title: "El blog está en camino.",
    subtitle:
      "Estamos preparando artículos basados en evidencia, guías prácticas y herramientas accionables. Vuelve pronto.",
    noteTitle: "Qué encontrarás",
    noteBody:
      "Entrenamiento, nutrición, recuperación, hábitos y rendimiento — claro, simple y útil.",
    primaryCta: "Volver al Inicio",
    secondaryCta: "Ver Servicios",
  },
  el: {
    badge: "Σύντομα κοντά σας",
    title: "Το blog ετοιμάζεται.",
    subtitle:
      "Ετοιμάζουμε επιστημονικά τεκμηριωμένα άρθρα, πρακτικούς οδηγούς και εργαλεία. Μείνε συντονισμένος/η.",
    noteTitle: "Τι να περιμένεις",
    noteBody:
      "Προπόνηση, διατροφή, αποκατάσταση, συνήθειες και performance insights — καθαρά, απλά και χρήσιμα.",
    primaryCta: "Πίσω στην Αρχική",
    secondaryCta: "Δες Υπηρεσίες",
  },
};
