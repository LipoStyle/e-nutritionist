// app/[lang]/(public)/services/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import "@/styles/services/service-slug.css";

import { fetchServiceBySlug } from "@/app/[lang]/(public)/services/services.queries";
import { buildLocaleHref } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

type Props = {
  params: Promise<{ lang: Lang; slug: string }>;
};

const ui: Record<
  Lang,
  {
    notFound: string;
    included: string;
    book: string;
    back: string;
    minutes: (m: number) => string;
  }
> = {
  en: {
    notFound: "Service not found.",
    included: "What’s included",
    book: "Book Consultation",
    back: "Back to Services",
    minutes: (m) => `${m} min`,
  },
  es: {
    notFound: "Servicio no encontrado.",
    included: "Qué incluye",
    book: "Reservar Consulta",
    back: "Volver a Servicios",
    minutes: (m) => `${m} min`,
  },
  el: {
    notFound: "Η υπηρεσία δεν βρέθηκε.",
    included: "Τι περιλαμβάνεται",
    book: "Κλείσε Συνεδρία",
    back: "Πίσω στις Υπηρεσίες",
    minutes: (m) => `${m} λεπτά`,
  },
};

function formatPriceEUR(value: number) {
  const rounded = Math.round(value);
  return `€${rounded}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;

  const service = await fetchServiceBySlug(lang, slug);

  if (!service || !service.translation) {
    const titleByLang: Record<Lang, string> = {
      en: "Service Not Found | e-Nutritionist",
      es: "Servicio no encontrado | e-Nutritionist",
      el: "Η υπηρεσία δεν βρέθηκε | e-Nutritionist",
    };

    return {
      title: titleByLang[lang],
      alternates: {
        canonical: `https://www.e-nutritionist.com/${lang}/services/${slug}`,
        languages: {
          en: `/en/services/${slug}`,
          es: `/es/services/${slug}`,
          el: `/el/services/${slug}`,
        },
      },
      robots: { index: false, follow: false },
    };
  }

  const t = service.translation;

  const title = (t.seo_title?.trim() || t.title || "Service").toString();
  const description = (t.seo_description?.trim() || t.summary || "").toString();
  const keywords = (t.seo_keywords?.trim() || "").toString();

  return {
    title,
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: {
      canonical: `https://www.e-nutritionist.com/${lang}/services/${slug}`,
      languages: {
        en: `/en/services/${slug}`,
        es: `/es/services/${slug}`,
        el: `/el/services/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.e-nutritionist.com/${lang}/services/${slug}`,
      type: "article",
      images: service.image_url
        ? [{ url: service.image_url, alt: t.title }]
        : undefined,
    },
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { lang, slug } = await params;

  const service = await fetchServiceBySlug(lang, slug);

  if (!service || !service.translation) {
    return (
      <div className="service-slug">
        <div className="service-slug__container">
          <div className="service-slug__notfound">{ui[lang].notFound}</div>
        </div>
      </div>
    );
  }

  const t = service.translation;

  return (
    <div className="service-slug">
      <div className="service-slug__container">
        <header className="service-slug__hero">
          <h1 className="service-slug__title">{t.title}</h1>
          <p className="service-slug__summary">{t.summary}</p>

          <div className="service-slug__meta">
            <span className="service-slug__price">
              {formatPriceEUR(service.price)}
            </span>

            {service.duration_minutes ? (
              <span className="service-slug__duration">
                {ui[lang].minutes(service.duration_minutes)}
              </span>
            ) : null}
          </div>
        </header>

        <section className="service-slug__content">
          <div className="service-slug__description">{t.description}</div>

          {service.features?.length ? (
            <div className="service-slug__features">
              <h2 className="service-slug__features-title">
                {ui[lang].included}
              </h2>
              <ul className="service-slug__features-list">
                {service.features.map((f) => (
                  <li key={f.id}>{f.feature_text}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="service-slug__actions">
            <Link
              className="cta-button service-slug__primary"
              href={buildLocaleHref(lang, "/contact")}
            >
              {ui[lang].book}
            </Link>

            <Link
              className="cta-button cta-button--secondary service-slug__secondary"
              href={buildLocaleHref(lang, "/services")}
            >
              {ui[lang].back}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
