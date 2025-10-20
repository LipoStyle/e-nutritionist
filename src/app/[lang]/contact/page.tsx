import Hero from '@/app/components/shared/Hero/Hero'
import { contactHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'

import ContactContent from './ContactContent'
import './ContactLayout.css'

export default async function ContactPage(
  { params }: { params: { lang: string } }   // <-- fixed typing
) {
  const { lang } = params
  const locale = resolveLocale(lang) as 'en' | 'es' | 'el'
  const t = contactHeroTranslations[locale]
  const hs = await getHeroSettings('contact', locale)

  return (
    <>
      <Hero
        title={hs?.title || undefined}
        description={hs?.description ?? t.description}
        message={hs?.message ?? t.message}
        bookText={hs?.bookText ?? t.bookText}
        bookHref={hs?.bookHref ?? `https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=`}
        bgImage={hs?.bgImage ?? '/assets/images/hero/contact-us.jpg'}
        overlayOpacity={hs?.overlayOpacity ?? 0.6}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
        headingLevel={1}
        imagePriority={false}
        ariaLabel={t.ariaLabel}
      />

      {/* Contact area */}
      <main className="contactMain">
        <ContactContent locale={locale} />
      </main>
    </>
  )
}
