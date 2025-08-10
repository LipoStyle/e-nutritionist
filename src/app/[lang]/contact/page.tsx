import Hero from '@/app/components/shared/Hero/Hero';
import { contactHeroTranslations } from './translations';
import { resolveLocale } from '../i18n/utils';

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const t = contactHeroTranslations[locale];

  return (
    <Hero
      description={t.description}
      message={t.message}
      ariaLabel={t.ariaLabel}
      bookText={t.bookText}
      bookHref={`/${locale}/book-consultation`}
      bgImage="/assets/images/hero/contact-us.jpg"
      overlayOpacity={0.6}
      offsetHeader
      height="default"
    />
  );
}
