'use client'

import './FooterNavs.css'
import ContactInfo from './ContactInfo/ContactInfo'
import PoliciesLinks from './PoliciesLinks/PoliciesLinks'
import SiteLinks from './SiteLinks/SiteLinks'
import t, { Lang } from './translations'

type Props = { lang: Lang }

export default function FooterNavs({ lang }: Props) {
  const tr = t[lang] ?? t.en

  return (
    <section className="footer-navs" aria-label="Footer navigation">
      <div className="footer-navs__col">
        <h3 className="footer-navs__title">{tr.titles.policies}</h3>
        <PoliciesLinks lang={lang} />
      </div>

      <div className="footer-navs__col">
        <h3 className="footer-navs__title">{tr.titles.pages}</h3>
        <SiteLinks lang={lang} />
      </div>

      <div className="footer-navs__col">
        <h3 className="footer-navs__title">{tr.titles.contact}</h3>
        <ContactInfo lang={lang} />
      </div>
    </section>
  )
}
