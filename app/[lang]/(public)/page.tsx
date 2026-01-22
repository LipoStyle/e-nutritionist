import type { Metadata } from "next";

import HomeHeroSlider from "@/components/home/sections/Hero/HomeHeroSlider";
import ServicesPreview from "@/components/home/sections/ServicesPreview/ServicesPreview";
import HomeAboutBanner from "@/components/home/sections/AboutBanner/HomeAboutBanner";

import type { Lang } from "@/lib/i18n/locale";
import { fetchHeroSlides } from "./home/home.queries"; // your existing slides query
import { fetchServiceCards } from "@/app/[lang]/(public)/services/services.queries";

type Props = {
  params: Promise<{ lang: Lang }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<Lang, string> = {
    en: "Home | Evidence-Based Sports Nutrition",
    es: "Inicio | Nutrición Deportiva Basada en Evidencia",
    el: "Αρχική | Επιστημονική Αθλητική Διατροφή",
  };

  const descriptions: Record<Lang, string> = {
    en: "Evidence-based nutrition coaching for performance, physique, and long-term health.",
    es: "Coaching nutricional basado en evidencia para rendimiento, físico y salud a largo plazo.",
    el: "Επιστημονική διατροφική καθοδήγηση για απόδοση, φυσική κατάσταση και υγεία.",
  };

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: `https://www.e-nutritionist.com/${lang}`,
      languages: { en: "/en", es: "/es", el: "/el" },
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://www.e-nutritionist.com/${lang}`,
      type: "website",
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;

  const slides = await fetchHeroSlides(lang);
  const cards = await fetchServiceCards(lang);
  const top3 = cards.slice(0, 3);

  return (
    <>
      <HomeHeroSlider slides={slides} />
      <ServicesPreview cards={top3} />
      <HomeAboutBanner />
    </>
  );
}
