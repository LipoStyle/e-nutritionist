"use client";

import type { FooterTranslations } from "../Footer";
import "@/styles/footer/layers/FooterLayerBottomBar.css";

export default function FooterLayerBottomBar({ t }: { t: FooterTranslations }) {
  return (
    <section className="footerBottomBar">
      <div className="footerContainer">
        <div className="footerDivider" />
        <div className="footerCopy">{t.copyright}</div>
      </div>
    </section>
  );
}
