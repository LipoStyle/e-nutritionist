"use client";

import { useParams } from "next/navigation";
import "@/styles/footer/Footer.css";

import FooterLayerNewsletter from "./layers/FooterLayerNewsletter";
import FooterLayerBrand from "./layers/FooterLayerBrand";
import FooterLayerLinks from "./layers/FooterLayerLinks";
import FooterLayerBottomBar from "./layers/FooterLayerBottomBar";

type Lang = "en" | "es" | "el";

export type FooterTranslations = {
  newsletterTitle: string;
  newsletterDesc: string;
  emailPlaceholder: string;
  subscribe: string;

  brandName: string;
  tagline: string;
  description: string;

  navTitle: string;
  policiesTitle: string;
  contactTitle: string;

  nav: {
    home: string;
    services: string;
    blogs: string;
    recipes: string;
    about: string;
    contact: string;
  };

  policies: {
    privacy: string;
    terms: string;
    cookies: string;
  };

  contact: {
    phone: string;
    email: string;
    address: string;
  };

  copyright: string;
};

export default function Footer() {
  const params = useParams<{ lang?: Lang }>();
  const lang: Lang = params?.lang ?? "en";

  const t: FooterTranslations =
    {
      en: {
        newsletterTitle: "Newsletter",
        newsletterDesc: "Get updates, new articles, and recipes. No spam.",
        emailPlaceholder: "Your email address",
        subscribe: "Subscribe",

        brandName: "e-Nutritionist",
        tagline: "Professional nutrition consulting",
        description:
          "Professional nutrition consulting specializing in athletic performance, weight management, and healthy lifestyle coaching.",

        navTitle: "Navigation",
        policiesTitle: "Policies",
        contactTitle: "Contact",

        nav: {
          home: "Home",
          services: "Services",
          blogs: "Blog",
          recipes: "Recipes",
          about: "About",
          contact: "Contact",
        },

        policies: {
          privacy: "Privacy Policy",
          terms: "Terms of Service",
          cookies: "Cookie Policy",
        },

        contact: {
          phone: "+1 (555) 123-4567",
          email: "info@e-nutritionist.com",
          address: "123 Health St, Wellness City",
        },

        copyright: `© ${new Date().getFullYear()} e-Nutritionist. All rights reserved.`,
      },
      es: {
        newsletterTitle: "Boletín",
        newsletterDesc: "Novedades, artículos y recetas. Sin spam.",
        emailPlaceholder: "Tu correo electrónico",
        subscribe: "Suscribirse",

        brandName: "e-Nutritionist",
        tagline: "Consultoría nutricional profesional",
        description:
          "Consultoría nutricional profesional centrada en rendimiento deportivo, control de peso y hábitos saludables.",

        navTitle: "Navegación",
        policiesTitle: "Políticas",
        contactTitle: "Contacto",

        nav: {
          home: "Inicio",
          services: "Servicios",
          blogs: "Blog",
          recipes: "Recetas",
          about: "Acerca de",
          contact: "Contacto",
        },

        policies: {
          privacy: "Política de privacidad",
          terms: "Términos del servicio",
          cookies: "Política de cookies",
        },

        contact: {
          phone: "+1 (555) 123-4567",
          email: "info@e-nutritionist.com",
          address: "123 Health St, Wellness City",
        },

        copyright: `© ${new Date().getFullYear()} e-Nutritionist. Todos los derechos reservados.`,
      },
      el: {
        newsletterTitle: "Ενημερωτικό δελτίο",
        newsletterDesc: "Ενημερώσεις, άρθρα και συνταγές. Χωρίς spam.",
        emailPlaceholder: "Το email σας",
        subscribe: "Εγγραφή",

        brandName: "e-Nutritionist",
        tagline: "Επαγγελματική διατροφική υποστήριξη",
        description:
          "Επαγγελματική συμβουλευτική διατροφής για αθλητική απόδοση, διαχείριση βάρους και υγιεινές συνήθειες.",

        navTitle: "Πλοήγηση",
        policiesTitle: "Πολιτικές",
        contactTitle: "Επικοινωνία",

        nav: {
          home: "Αρχική",
          services: "Υπηρεσίες",
          blogs: "Άρθρα",
          recipes: "Συνταγές",
          about: "Σχετικά",
          contact: "Επικοινωνία",
        },

        policies: {
          privacy: "Πολιτική απορρήτου",
          terms: "Όροι χρήσης",
          cookies: "Πολιτική cookies",
        },

        contact: {
          phone: "+1 (555) 123-4567",
          email: "info@e-nutritionist.com",
          address: "123 Health St, Wellness City",
        },

        copyright: `© ${new Date().getFullYear()} e-Nutritionist. Με επιφύλαξη παντός δικαιώματος.`,
      },
    }[lang] ?? ({} as FooterTranslations);

  return (
    <footer className="footer">
      {/* Layer 1: Newsletter (section 2) */}
      <FooterLayerNewsletter t={t} />

      {/* Layer 2: Brand (section 1) */}
      <FooterLayerBrand t={t} lang={lang} />

      {/* Layer 3: Links (sections 3,4,5) */}
      <FooterLayerLinks t={t} lang={lang} />

      {/* Layer 5: Bottom bar (section 6) */}
      <FooterLayerBottomBar t={t} />
    </footer>
  );
}
