import Hero from "@/app/components/shared/Hero/Hero";
import AboutSection from "./aboutsection/AboutSection";
import AboutValues from "./values/Values";
import AboutMission from "./mission/Mission";
import AboutCredentials from "./credentials/Credentials";
import AboutLifestyle from "./lifestyle/Lifestyle";
import AboutFinalCta from "./finalcta/FinalCta";

import { aboutHeroTranslations } from "./translations";
import { resolveLocale } from "../i18n/utils";
import { getHeroSettings } from "@/lib/hero";

type Lang = "en" | "es" | "el";

// optional: timeout guard so a slow CMS doesn’t hang the page
async function withTimeout<T>(p: Promise<T>, ms = 6000): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((r) => setTimeout(() => r(null), ms)),
  ]) as Promise<T | null>;
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang) as Lang;

  const t = aboutHeroTranslations[locale];
  const hs = await withTimeout(getHeroSettings("about", locale));

  return (
    <>
      <Hero
        title={hs?.title || undefined}
        description={hs?.description ?? t.description}
        message={hs?.message ?? t.message}
        bookText={hs?.bookText ?? t.bookText}
        bookHref={hs?.bookHref ?? `/${locale}/book-consultation`}
        bgImage={hs?.bgImage ?? "/assets/images/hero/about.jpg"}
        overlayOpacity={hs?.overlayOpacity ?? 0.65}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as "compact" | "default" | "tall") ?? "default"}
        headingLevel={1}
        imagePriority={false}
        ariaLabel={t.ariaLabel}
      />

      <main className="aboutMain">
        <AboutSection lang={locale} />
        <AboutValues lang={locale} />
        <AboutMission lang={locale} />
        <AboutCredentials lang={locale} />
        <AboutLifestyle lang={locale} />
        <AboutFinalCta lang={locale} />
      </main>
    </>
  );
}

// (nice-to-have)
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }, { lang: "el" }];
}
