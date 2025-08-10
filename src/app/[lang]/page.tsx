import Hero from '@/app/components/shared/Hero/Hero';
import { homeHeroTranslations } from './translations';
import { resolveLocale } from './i18n/utils';

export default async function HomePage({
  params,
}: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const t = homeHeroTranslations[locale];

  return (
    <Hero
      // no title / description on purpose
      description={t.description}
      message={t.message}
      bookText={t.bookText}
      ariaLabel={t.ariaLabel}
      bookHref={`/${locale}/book-consultation`}
      bgImage="/assets/images/hero/home.jpg"
      overlayOpacity={0.6}
      offsetHeader
      height="tall"
    />
  );
}
