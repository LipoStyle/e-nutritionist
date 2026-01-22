import ContactHero from "@/components/contact/sections/hero/ContactHero";
import ContactMainLayout from "@/components/contact/sections/layout/ContactMainLayout";
import ContactFaqSection from "@/components/contact/sections/faq/ContactFaqSection";

import type { Metadata } from "next";

type Lang = "en" | "es" | "el";

type Props = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Lang, string> = {
    en: "Contact | Book a Consultation",
    es: "Contacto | Reserva una Consulta",
    el: "Επικοινωνία | Κλείσε Συνεδρία",
  };

  const descriptions: Record<Lang, string> = {
    en: "Get in touch to discuss your goals, ask questions, or book a consultation. I respond within 24 hours on business days.",
    es: "Ponte en contacto para hablar de tus objetivos, resolver dudas o reservar una consulta. Respondo en 24 horas laborables.",
    el: "Επικοινώνησε για να συζητήσουμε τους στόχους σου, να λύσουμε απορίες ή να κλείσεις συνεδρία. Απαντώ εντός 24 ωρών τις εργάσιμες ημέρες.",
  };

  const baseUrl = "https://www.e-nutritionist.com";

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        es: `${baseUrl}/es/contact`,
        el: `${baseUrl}/el/contact`,
      },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `${baseUrl}/${lang}/contact`,
      type: "website",
    },
  };
}

export default function Contact() {
  return (
    <>
      <ContactHero />
      <ContactMainLayout />
      <ContactFaqSection />
    </>
  );
}
