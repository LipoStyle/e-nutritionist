type Lang = "en" | "es" | "el";

export const recipesComingSoonUI: Record<
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
    title: "Recipes are cooking.",
    subtitle:
      "We’re building high-protein, performance-friendly recipes with clear macros and simple steps.",
    noteTitle: "What’s included",
    noteBody:
      "Fast meals, prep-friendly options, and flexible recipes you can repeat without thinking.",
    primaryCta: "Explore Services",
    secondaryCta: "Back to Home",
  },
  es: {
    badge: "Próximamente",
    title: "Las recetas ya vienen.",
    subtitle:
      "Estamos creando recetas altas en proteína, enfocadas en rendimiento, con macros claros y pasos simples.",
    noteTitle: "Qué incluirá",
    noteBody:
      "Comidas rápidas, opciones para meal prep y recetas flexibles para repetir sin complicaciones.",
    primaryCta: "Ver Servicios",
    secondaryCta: "Volver al Inicio",
  },
  el: {
    badge: "Σύντομα κοντά σας",
    title: "Οι συνταγές ετοιμάζονται.",
    subtitle:
      "Χτίζουμε υψηλοπρωτεϊνικές, performance-friendly συνταγές με καθαρά macros και απλά βήματα.",
    noteTitle: "Τι θα περιλαμβάνει",
    noteBody:
      "Γρήγορα γεύματα, επιλογές για meal prep και ευέλικτες συνταγές που επαναλαμβάνονται εύκολα.",
    primaryCta: "Δες Υπηρεσίες",
    secondaryCta: "Πίσω στην Αρχική",
  },
};
