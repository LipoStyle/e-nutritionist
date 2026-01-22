import Hero from "@/components/about/sections/Hero/Hero";
import Achievements from "@/components/about/sections/Achievements/Achievements";
import AboutStorySection from "@/components/about/sections/story/AboutStorySection";
import AboutExpertiseSection from "@/components/about/sections/expertise/AboutExpertiseSection";
import AboutEducationSection from "@/components/about/sections/education/AboutEducationSection";
import AboutPhilosophySection from "@/components/about/sections/philosophy/AboutPhilosophySection";
import AboutFinalCtaSection from "@/components/about/sections/cta/AboutFinalCtaSection";
import type { Lang } from "@/lib/i18n/locale";

import { Metadata } from "next";

type Props = { params: { lang: Lang } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const titles = {
    en: "About | Evidence-Based Sports Nutritionist",
    es: "Sobre Mí | Nutricionista Deportivo Basado en Evidencia",
    el: "Σχετικά | Επιστημονική Αθλητική Διατροφή",
  };

  const descriptions = {
    en: "Learn about my evidence-based approach to sports nutrition, professional background, and how I help athletes and high-performing individuals achieve real results.",
    es: "Conoce mi enfoque basado en evidencia, mi formación profesional y cómo ayudo a atletas a lograr resultados reales.",
    el: "Μάθε για τη φιλοσοφία μου, το επιστημονικό υπόβαθρο και πώς βοηθώ αθλητές να πετύχουν πραγματικά αποτελέσματα.",
  };

  return {
    title: titles[params.lang],
    description: descriptions[params.lang],
    alternates: {
      canonical: `https://www.e-nutritionist.com/${params.lang}/about`,
      languages: {
        en: "/en/about",
        es: "/es/about",
        el: "/el/about",
      },
    },
    openGraph: {
      title: titles[params.lang],
      description: descriptions[params.lang],
      url: `https://www.e-nutritionist.com/${params.lang}/about`,
      type: "profile",
    },
  };
}

export default function About() {
  return (
    <>
      <Hero />
      <Achievements />
      <AboutStorySection />
      <AboutExpertiseSection />
      <AboutEducationSection />
      <AboutPhilosophySection />
      <AboutFinalCtaSection />
    </>
  );
}
