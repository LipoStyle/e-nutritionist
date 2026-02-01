import type { Metadata } from "next";
import Link from "next/link";

import "@/styles/services/service-detail.css";
import CheckIcon from "@/components/ui/icons/CheckIcon";

import { fetchServiceBySlug } from "@/app/[lang]/(public)/services/services.queries";
import { buildLocaleHref } from "@/lib/i18n/locale";

type Lang = "en" | "es" | "el";

type Props = {
  params: Promise<{ lang: Lang; slug: string }>;
};

const baseUrl = "https://www.e-nutritionist.com";

const ui: Record<
  Lang,
  {
    notFound: string;
    serviceDetails: string;
    included: string;

    breadcrumbHome: string;
    breadcrumbServices: string;

    backToServices: string;
    askQuestions: string;

    bookNow: string;
    getFreeAccess: string;

    minutes: (m: number) => string;

    labels: {
      serviceType: string;
      duration: string;
      price: string;
      freeService: string;
    };

    typeLabels: Record<string, string>;
  }
> = {
  en: {
    notFound: "Service not found.",
    serviceDetails: "Service Details",
    included: "What’s Included",
    breadcrumbHome: "Home",
    breadcrumbServices: "Services",
    backToServices: "Back to Services",
    askQuestions: "Ask Questions",
    bookNow: "Book Now",
    getFreeAccess: "Get Free Access",
    minutes: (m) => `${m} minutes`,
    labels: {
      serviceType: "Service Type:",
      duration: "Duration:",
      price: "Price:",
      freeService: "Free Service",
    },
    typeLabels: {
      free_pdf: "Free PDF Book",
      paid_pdf: "Paid PDF Book",
      free_consultation: "Free Consultation",
      paid_consultation: "Paid Consultation",
    },
  },
  es: {
    notFound: "Servicio no encontrado.",
    serviceDetails: "Detalles del Servicio",
    included: "Qué Incluye",
    breadcrumbHome: "Inicio",
    breadcrumbServices: "Servicios",
    backToServices: "Volver a Servicios",
    askQuestions: "Hacer Preguntas",
    bookNow: "Reservar",
    getFreeAccess: "Acceso Gratis",
    minutes: (m) => `${m} minutos`,
    labels: {
      serviceType: "Tipo de servicio:",
      duration: "Duración:",
      price: "Precio:",
      freeService: "Servicio Gratis",
    },
    typeLabels: {
      free_pdf: "PDF Gratis",
      paid_pdf: "PDF de Pago",
      free_consultation: "Consulta Gratis",
      paid_consultation: "Consulta de Pago",
    },
  },
  el: {
    notFound: "Η υπηρεσία δεν βρέθηκε.",
    serviceDetails: "Λεπτομέρειες Υπηρεσίας",
    included: "Τι Περιλαμβάνεται",
    breadcrumbHome: "Αρχική",
    breadcrumbServices: "Υπηρεσίες",
    backToServices: "Πίσω στις Υπηρεσίες",
    askQuestions: "Κάνε Ερώτηση",
    bookNow: "Κλείσε Τώρα",
    getFreeAccess: "Δωρεάν Πρόσβαση",
    minutes: (m) => `${m} λεπτά`,
    labels: {
      serviceType: "Τύπος υπηρεσίας:",
      duration: "Διάρκεια:",
      price: "Τιμή:",
      freeService: "Δωρεάν Υπηρεσία",
    },
    typeLabels: {
      free_pdf: "Δωρεάν PDF",
      paid_pdf: "PDF επί πληρωμή",
      free_consultation: "Δωρεάν Συνεδρία",
      paid_consultation: "Επί πληρωμή Συνεδρία",
    },
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
        canonical: `${baseUrl}/${lang}/services/${slug}`,
        languages: {
          en: `${baseUrl}/en/services/${slug}`,
          es: `${baseUrl}/es/services/${slug}`,
          el: `${baseUrl}/el/services/${slug}`,
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
      canonical: `${baseUrl}/${lang}/services/${slug}`,
      languages: {
        en: `${baseUrl}/en/services/${slug}`,
        es: `${baseUrl}/es/services/${slug}`,
        el: `${baseUrl}/el/services/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}/services/${slug}`,
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
      <div className="service-detail">
        <div className="service-detail__container">
          <div className="service-detail__notfound">{ui[lang].notFound}</div>
        </div>
      </div>
    );
  }

  const t = service.translation;
  const isFree = Number(service.price || 0) === 0;

  const typeLabel =
    ui[lang].typeLabels[String(service.service_type)] ||
    String(service.service_type || "");

  const bookLabel = isFree ? ui[lang].getFreeAccess : ui[lang].bookNow;

  return (
    <div className="service-detail">
      <div className="service-detail__container">
        {/* Breadcrumb */}
        <nav className="service-detail__breadcrumb" aria-label="Breadcrumb">
          <Link
            href={buildLocaleHref(lang, "/")}
            className="service-detail__bc"
          >
            {ui[lang].breadcrumbHome}
          </Link>
          <span className="service-detail__sep">/</span>
          <Link
            href={buildLocaleHref(lang, "/services")}
            className="service-detail__bc"
          >
            {ui[lang].breadcrumbServices}
          </Link>
          <span className="service-detail__sep">/</span>
          <span className="service-detail__bc-current">{t.title}</span>
        </nav>

        <div className="service-detail__grid">
          {/* Main */}
          <main className="service-detail__main">
            {/* Top actions */}
            <div className="service-detail__top">
              <Link
                href={buildLocaleHref(lang, "/services")}
                className="service-detail__back"
              >
                ← {ui[lang].backToServices}
              </Link>

              <span className="service-detail__badge">{typeLabel}</span>
            </div>

            {/* Hero */}
            <header className="service-detail__hero">
              <h1 className="service-detail__title">{t.title}</h1>
              <p className="service-detail__summary">{t.summary}</p>
            </header>

            {/* Image */}
            {service.image_url ? (
              <div className="service-detail__image-wrap">
                <img
                  src={service.image_url}
                  alt={t.title}
                  className="service-detail__image"
                />
              </div>
            ) : null}

            {/* Service Details Card */}
            <section
              className="service-detail__card"
              aria-label="Service details"
            >
              <h2 className="service-detail__card-title">
                {ui[lang].serviceDetails}
              </h2>

              <div className="service-detail__prose">
                {String(t.description || "")
                  .split("\n")
                  .map((p, idx) => {
                    const trimmed = p.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={idx} className="service-detail__paragraph">
                        {trimmed}
                      </p>
                    );
                  })}
              </div>
            </section>

            {/* What's Included */}
            {service.features?.length ? (
              <section
                className="service-detail__card"
                aria-label="What's included"
              >
                <h2 className="service-detail__card-title service-detail__card-title--icon">
                  <span className="service-detail__check" aria-hidden="true">
                    ✓
                  </span>
                  {ui[lang].included}
                </h2>

                <ul className="service-detail__features">
                  {service.features.map((f: any) => (
                    <li key={f.id} className="service-detail__feature">
                      <span
                        className="service-detail__feature-check"
                        aria-hidden="true"
                      >
                        {/* your check icon svg OR ✓ */}✓
                      </span>
                      <span>{f.feature_text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </main>

          {/* Sidebar */}
          <aside className="service-detail__aside" aria-label="Booking sidebar">
            <div className="service-detail__sticky">
              <div className="service-detail__sidecard">
                <div className="service-detail__price">
                  {isFree
                    ? ui[lang].labels.freeService
                    : formatPriceEUR(service.price)}
                </div>

                {service.duration_minutes ? (
                  <div className="service-detail__duration">
                    🕒 {ui[lang].minutes(service.duration_minutes)}
                  </div>
                ) : null}

                <div className="service-detail__side-actions">
                  <Link
                    className="cta-button service-detail__side-primary"
                    href={buildLocaleHref(lang, "/contact")}
                  >
                    📅 {bookLabel}
                  </Link>

                  <Link
                    className="cta-button cta-button--secondary service-detail__side-secondary"
                    href={buildLocaleHref(lang, "/contact")}
                  >
                    💬 {ui[lang].askQuestions}
                  </Link>
                </div>

                <div className="service-detail__side-meta">
                  <div className="service-detail__row">
                    <span className="service-detail__row-label">
                      {ui[lang].labels.serviceType}
                    </span>
                    <span className="service-detail__row-value">
                      {typeLabel}
                    </span>
                  </div>

                  {service.duration_minutes ? (
                    <div className="service-detail__row">
                      <span className="service-detail__row-label">
                        {ui[lang].labels.duration}
                      </span>
                      <span className="service-detail__row-value">
                        {Math.round(service.duration_minutes)} min
                      </span>
                    </div>
                  ) : null}

                  <div className="service-detail__row">
                    <span className="service-detail__row-label">
                      {ui[lang].labels.price}
                    </span>
                    <span className="service-detail__row-value service-detail__row-value--price">
                      {isFree ? "Free" : formatPriceEUR(service.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
