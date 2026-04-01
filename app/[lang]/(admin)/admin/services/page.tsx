import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import "@/styles/admin-services.css";
import DeleteServiceButton from "./DeleteServiceButton";
import { ArrowLeft } from "lucide-react";

export default async function AdminServicesPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetching from services_current and joining the translations table
  const { data: services, error } = await supabase
    .from("services_current")
    .select(
      `
      *,
      service_translations_current!inner (
        title,
        summary
      )
    `,
    )
    .eq("service_translations_current.language_code", lang)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="services-admin-container">
        <div className="error-card">
          <h2>Error Loading Data</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-admin-container">
      <Link href="/admin" className="back-btn">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <header className="services-header">
        <div className="header-title-area">
          <h1>Service Inventory</h1>
          <div className="flex-header-sub">
            <span>Managing offerings for</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>

        <Link href={`/${lang}/admin/services/new`} className="btn-primary">
          <Plus size={18} /> Add New Service
        </Link>
      </header>

      <div className="services-grid">
        {services?.map((service) => {
          // Extract the translation object for the current language
          const content = service.service_translations_current[0];

          return (
            <div key={service.id} className="service-card">
              <div className="card-image">
                {service.image_url ? (
                  <img src={service.image_url} alt={content?.title} />
                ) : (
                  <div className="placeholder-img">No Image Provided</div>
                )}
                <span
                  className={`status-badge ${service.is_active ? "active" : "draft"}`}
                >
                  {service.is_active ? "Live" : "Draft"}
                </span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span className="service-type">
                    {service.service_type || "General"}
                  </span>
                  <span className="service-price">${service.price}</span>
                </div>

                <h3>{content?.title || "Untitled Service"}</h3>
                <p className="card-description">
                  {content?.summary ||
                    "No summary available for this language."}
                </p>

                <div className="card-actions">
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    className="action-btn view"
                    title="Preview on site"
                  >
                    <ExternalLink size={16} />
                  </Link>
                  <Link
                    href={`/${lang}/admin/services/edit/${service.id}`}
                    className="action-btn edit"
                  >
                    <Edit size={16} /> Edit
                  </Link>
                  <DeleteServiceButton serviceId={service.id} lang={lang} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {services?.length === 0 && (
        <div className="empty-state">
          <p>No services found for the "{lang.toUpperCase()}" locale.</p>
          <Link href={`/${lang}/admin/services/new`} className="text-link">
            Create your first service now
          </Link>
        </div>
      )}
    </div>
  );
}
