'use client'

import Link from 'next/link'

import t, { Lang } from '../translations'

type Props = { lang: Lang }

export default function PoliciesLinks({ lang }: Props) {
  const tr = t[lang] ?? t.en

  // Update these paths when you add real pages
  const base = `/${lang}`
  const items = [
    { label: tr.policies.terms, href: `${base}/terms` },
    { label: tr.policies.privacy, href: `${base}/privacy` },
    { label: tr.policies.cookies, href: `${base}/cookies` },
  ]

  return (
    <ul className="footer-list" role="list">
      {items.map((item) => (
        <li key={item.href}>
          <Link className="footer-link" href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
