'use client'

import t, { Lang } from '../translations'

type Props = { lang: Lang }

export default function ContactInfo({ lang }: Props) {
  const tr = t[lang] ?? t.en

  const emailHref = `mailto:${tr.contact.email}`
  const phoneSanitized = tr.contact.phone.replace(/\s+/g, '')
  const phoneHref = `tel:${phoneSanitized}`

  return (
    <ul className="footer-list" role="list">
      <li className="footer-meta">
        <small>{tr.contact.emailLabel}:</small>{' '}
        <a
          className="footer-link"
          href={emailHref}
          aria-label={`${tr.contact.emailLabel}: ${tr.contact.email}`}
        >
          {tr.contact.email}
        </a>
      </li>

      <li className="footer-meta">
        <small>{tr.contact.phoneLabel}:</small>{' '}
        <a
          className="footer-link"
          href={phoneHref}
          aria-label={`${tr.contact.phoneLabel}: ${tr.contact.phone}`}
        >
          {tr.contact.phone}
        </a>
      </li>

      <li className="footer-meta" aria-label={`${tr.contact.addressLabel}: ${tr.contact.address}`}>
        <small>{tr.contact.addressLabel}:</small>{' '}
        <address style={{ display: 'inline', fontStyle: 'normal' }}>{tr.contact.address}</address>
      </li>
    </ul>
  )
}
