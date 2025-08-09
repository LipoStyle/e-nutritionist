import Hero from '@/app/components/shared/Hero/Hero';
import {
  aboutHeroTranslations,
  SUPPORTED_LANGS,
  AboutLocale,
} from './translations';

function resolveLocale(lang: string): AboutLocale {
  const lower = (lang || '').toLowerCase();
  return (SUPPORTED_LANGS.includes(lower as AboutLocale) ? lower : 'en') as AboutLocale;
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const t = aboutHeroTranslations[locale];

  // locale-aware link:
  const bookHref = `/${locale}/book-consultation`;

  return (
    <Hero
      title={t.title}
      description={t.description}
      message={t.message}
      ariaLabel={t.ariaLabel}
      bookText={t.bookText}
      bookHref={bookHref}
      bgImage="/assets/images/hero/about.jpg"
      overlayOpacity={0.65}
      offsetHeader
      height="default"
    />
  );
}
