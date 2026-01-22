"use client";

import type { FooterTranslations } from "../Footer";
import "@/styles/footer/layers/FooterLayerNewsletter.css";

export default function FooterLayerNewsletter({
  t,
}: {
  t: FooterTranslations;
}) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // placeholder for later integration
  };

  return (
    <section className="footerLayer footerNewsletter">
      <div className="footerContainer footerNewsletterInner">
        <div>
          <div className="footerTitle">{t.newsletterTitle}</div>
          <p className="footerText">{t.newsletterDesc}</p>
        </div>

        <form className="footerForm" onSubmit={onSubmit}>
          <input
            className="footerInput"
            type="email"
            name="email"
            required
            placeholder={t.emailPlaceholder}
            aria-label={t.emailPlaceholder}
          />
          <button className="footerButton" type="submit">
            {t.subscribe}
          </button>
        </form>
      </div>
    </section>
  );
}
