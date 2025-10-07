// =============================================================
// File: src/app/components/shared/hero-home/data/slides.el.ts
// Description: Greek slide content (template). Adjust copy later.
// =============================================================
import type { HeroSlide } from "../HeroHome.tsx";

export const slides: HeroSlide[] = [
  {
    id: "audit",
    title: "Ξεκλείδωσε το Physique Audit",
    subtitle: "90 λεπτά για ένα προσωπικό, επιστημονικό πλάνο διατροφής.",
    backgroundImage: "/assets/images/hero-home/image1.jpg",
    ctaPrimary: { label: "Κλείσε ραντεβού", href: "/booking" },
    ctaSecondary: { label: "Δες υπηρεσίες", href: "/services" },
    ariaLabel: "Έμφαση υπηρεσίας: Physique Audit",
  },
  {
    id: "intensive",
    title: "12 εβδομάδες. Αληθινά κέρδη απόδοσης.",
    subtitle: "1‑προς‑1 coaching για να σπάσεις τα πλατώ και να κρατήσεις τα αποτελέσματα.",
    backgroundImage: "/assets/images/hero-home/image2.jpg",
    ctaPrimary: { label: "Δες το coaching", href: "/services/3-month-physique-efficiency-intensive" },
    ctaSecondary: { label: "Μάθε περισσότερα", href: "/services" },
    ariaLabel: "Έμφαση υπηρεσίας: 3‑μηνο πρόγραμμα",
  },
  {
    id: "ebook",
    title: "15‑Minute Macro Manual",
    subtitle: "30+ πρωτεϊνικές συνταγές • 7ήμερο πλάνο • ετικέτες.",
    backgroundImage: "/assets/images/hero-home/image2.jpg",
    ctaPrimary: { label: "Απόκτησέ το", href: "/shop/15-minute-macro-manual" },
    ctaSecondary: { label: "Δες συνταγές", href: "/recipes" },
    ariaLabel: "Lead magnet: E‑book",
  },
];
