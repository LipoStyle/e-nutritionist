'use client'

import Link from 'next/link'

import t, { Lang } from '../translations'

type Props = { lang: Lang }

export default function SiteLinks({ lang }: Props) {
  const tr = t[lang] ?? t.en
  const base = `/${lang}`

  const items = [
    { label: tr.pages.services, href: `${base}/services` },
    { label: tr.pages.blogs, href: `${base}/blogs` },
    { label: tr.pages.recipes, href: `${base}/recipes` },
    { label: tr.pages.about, href: `${base}/about` },
    { label: tr.pages.contact, href: `${base}/contact` },
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
