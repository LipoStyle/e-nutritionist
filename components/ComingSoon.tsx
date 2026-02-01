import Link from "next/link";
import "@/styles/coming-soon.css";
import { buildLocaleHref } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

type ComingSoonUI = {
  badge: string;
  title: string;
  subtitle: string;
  noteTitle: string;
  noteBody: string;
  primaryCta: string;
  secondaryCta: string;
};

type Props = {
  lang: Lang;
  ui: ComingSoonUI;
  kind?: "blog" | "recipes";
};

export function ComingSoon({ lang, ui, kind = "blog" }: Props) {
  const primaryHref =
    kind === "blog"
      ? buildLocaleHref(lang, "/")
      : buildLocaleHref(lang, "/services");

  const secondaryHref =
    kind === "blog"
      ? buildLocaleHref(lang, "/services")
      : buildLocaleHref(lang, "/");

  return (
    <section className="coming">
      <div className="coming__bg" aria-hidden="true">
        <span className="coming__blob coming__blob--a" />
        <span className="coming__blob coming__blob--b" />
        <span className="coming__grid" />
      </div>

      <div className="coming__wrap">
        <div className="coming__card">
          <div className="coming__badge">{ui.badge}</div>

          <h1 className="coming__title">{ui.title}</h1>
          <p className="coming__subtitle">{ui.subtitle}</p>

          <div className="coming__note" role="note">
            <div className="coming__noteTitle">{ui.noteTitle}</div>
            <div className="coming__noteBody">{ui.noteBody}</div>
          </div>

          <div className="coming__actions">
            <Link
              className="coming__btn coming__btn--primary"
              href={primaryHref}
            >
              {ui.primaryCta}
            </Link>

            <Link
              className="coming__btn coming__btn--ghost"
              href={secondaryHref}
            >
              {ui.secondaryCta}
            </Link>
          </div>

          <div className="coming__meta">
            <span className="coming__pulse" aria-hidden="true" />
            <span className="coming__metaText">v1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
