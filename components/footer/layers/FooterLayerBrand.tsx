"use client";

import Link from "next/link";
import Image from "next/image";
import type { FooterTranslations } from "../Footer";
import "@/styles/footer/layers/FooterLayerBrand.css";

import logo from "@/public/assets/headerlogo/logo.svg";

type Lang = "en" | "es" | "el";

export default function FooterLayerBrand({
  t,
  lang,
}: {
  t: FooterTranslations;
  lang: Lang;
}) {
  return (
    <section className="footerLayer footerBrand">
      <div className="footerContainer footerBrandInner">
        <Link href={`/${lang}`} className="footerBrandLink" aria-label="Home">
          <div className="footerBrandHead">
            <Image src={logo} alt={t.brandName} width={44} height={44} />
            <div>
              <div className="footerBrandName">{t.brandName}</div>
              <div className="footerBrandTagline">{t.tagline}</div>
            </div>
          </div>
        </Link>

        <p className="footerBrandDesc">{t.description}</p>
      </div>
    </section>
  );
}
