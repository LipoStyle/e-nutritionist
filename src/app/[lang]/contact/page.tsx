// src/app/[lang]/contact/page.tsx
import Hero from '@/app/components/shared/Hero/Hero'
import { contactHeroTranslations } from './translations'
import { resolveLocale } from '../i18n/utils'
import { getHeroSettings } from '@/lib/hero'

// Sections
import ContactIntro from './ContactIntro/ContactIntro'
import ContactInfo from './ContactInfo/ContactInfo'
import SocialLinks from './SocialLinks/SocialLinks'
import ContactForm from './ContactForm/ContactForm'
import LocationSection from './LocationSection/LocationSection'

// NEW: page-level layout styles
import styles from './ContactLayout.module.css'

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
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
        bookHref={hs?.bookHref ?? `/${locale}/book-consultation`}
        bgImage={hs?.bgImage ?? '/assets/images/hero/contact-us.jpg'}
        overlayOpacity={hs?.overlayOpacity ?? 0.6}
        offsetHeader={hs?.offsetHeader ?? true}
        height={(hs?.height as 'compact' | 'default' | 'tall') ?? 'default'}
        headingLevel={1}
        imagePriority={false}
        ariaLabel={t.ariaLabel}
      />

      <main>
        {/* Two-column content section */}
        <section className={styles.contentSection} aria-label="Contact content">
          <div className={styles.grid}>
            <div className={styles.leftCol}>
              <ContactIntro locale={locale} />
              <ContactInfo locale={locale} />
              <SocialLinks locale={locale} />
            </div>
            <div className={styles.rightCol}>
              <ContactForm locale={locale} />
            </div>
          </div>
        </section>

        {/* Full-bleed location */}
        <LocationSection locale={locale} />
      </main>
    </>
  )
}
