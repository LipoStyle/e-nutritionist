import Hero from '@/app/components/shared/Hero/Hero'
import { contactHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'

import ContactContent from './ContactContent'
import './ContactLayout.css'

type Lang = 'en' | 'es' | 'el'

// optional: timeout guard
async function withTimeout<T>(p: Promise<T>, ms = 6000): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((r) => setTimeout(() => r(null), ms)),
  ]) as Promise<T | null>
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: Lang }>
}) {
  const { lang } = await params
  const locale = resolveLocale(lang) as Lang
  const t = contactHeroTranslations[locale]
  const hs = await withTimeout(getHeroSettings('contact', locale))

  return (
    <>
      <Hero
        title={hs?.title || undefined}
        description={hs?.description ?? t.description}
        message={hs?.message ?? t.message}
        bookText={hs?.bookText ?? t.bookText}
        bookHref={
          hs?.bookHref ??
          'https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA='
        }
        bgImage={hs?.bgImage ?? '/assets/images/hero/contact-us.jpg'}
        overlayOpacity={hs?.overlayOpacity ?? 0.6}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
        headingLevel={1}
        imagePriority={false}
        ariaLabel={t.ariaLabel}
      />

      <main className="contactMain">
        <ContactContent locale={locale} />
      </main>
    </>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }, { lang: 'el' }]
}
