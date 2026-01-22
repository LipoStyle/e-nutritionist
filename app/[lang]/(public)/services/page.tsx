// app/[lang]/(public)/services/page.tsx
import type { Metadata } from "next";

import ServicesHero from "@/components/services/sections/Hero/ServicesHero";
import ServicesGreeting from "@/components/services/sections/Greeting/ServicesGreeting";
import ServicesGrid from "@/components/services/sections/Grid/ServicesGrid";
import HowWeWorkTogether from "@/components/services/sections/HowWeWork/HowWeWorkTogether";
import ConsultationMethods from "@/components/services/sections/Methods/ConsultationMethods";
import ServicesCta from "@/components/services/sections/CTA/ServicesCta";

import { fetchServiceCards } from "./services.queries";
import type { Lang } from "@/lib/i18n/locale";

type Props = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Lang, string> = {
    en: "Services | Professional Nutrition Coaching",
    es: "Servicios | Coaching Profesional de Nutrición",
    el: "Υπηρεσίες | Επαγγελματική Διατροφική Καθοδήγηση",
  };

  const descriptions: Record<Lang, string> = {
    en: "Explore professional nutrition services tailored to your goals—from performance to weight management. Book a free consultation.",
    es: "Explora servicios profesionales de nutrición adaptados a tus objetivos—desde rendimiento hasta control de peso. Reserva una consulta gratuita.",
    el: "Ανακάλυψε επαγγελματικές υπηρεσίες διατροφής προσαρμοσμένες στους στόχους σου—από απόδοση έως διαχείριση βάρους. Κλείσε δωρεάν συνεδρία.",
  };

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `https://www.e-nutritionist.com/${lang}/services`,
      languages: {
        en: "/en/services",
        es: "/es/services",
        el: "/el/services",
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://www.e-nutritionist.com/${lang}/services`,
      type: "website",
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;

  const cards = await fetchServiceCards(lang);

  return (
    <>
      <ServicesHero />
      <ServicesGreeting />
      <ServicesGrid cards={cards} />
      <HowWeWorkTogether />
      <ConsultationMethods />
      <ServicesCta />
    </>
  );
}
