"use client";

import Link from "next/link";
import type { FooterTranslations } from "../Footer";
import "@/styles/footer/layers/FooterLayerLinks.css";

type Lang = "en" | "es" | "el";

export default function FooterLayerLinks({
  t,
  lang,
}: {
  t: FooterTranslations;
  lang: Lang;
}) {
  return (
    <section className="footerLayer footerLinks">
      <div className="footerContainer footerLinksInner">
        <div className="footerCol">
          <div className="footerColTitle">{t.navTitle}</div>
          <ul className="footerList">
            <li>
              <Link href={`/${lang}`}>{t.nav.home}</Link>
            </li>
            <li>
              <Link href={`/${lang}/services`}>{t.nav.services}</Link>
            </li>
            <li>
              <Link href={`/${lang}/blogs`}>{t.nav.blogs}</Link>
            </li>
            <li>
              <Link href={`/${lang}/recipes`}>{t.nav.recipes}</Link>
            </li>
            <li>
              <Link href={`/${lang}/about`}>{t.nav.about}</Link>
            </li>
            <li>
              <Link href={`/${lang}/contact`}>{t.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div className="footerCol">
          <div className="footerColTitle">{t.policiesTitle}</div>
          <ul className="footerList">
            <li>
              <Link href={`/${lang}/privacy`}>{t.policies.privacy}</Link>
            </li>
            <li>
              <Link href={`/${lang}/terms`}>{t.policies.terms}</Link>
            </li>
            <li>
              <Link href={`/${lang}/cookies`}>{t.policies.cookies}</Link>
            </li>
          </ul>
        </div>

        <div className="footerCol">
          <div className="footerColTitle">{t.contactTitle}</div>
          <ul className="footerContact">
            <li>{t.contact.phone}</li>
            <li>{t.contact.email}</li>
            <li>{t.contact.address}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
