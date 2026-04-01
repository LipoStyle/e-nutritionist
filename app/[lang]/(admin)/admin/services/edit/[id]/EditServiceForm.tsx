"use client";

import { useState } from "react";
import { ArrowLeft, Languages } from "lucide-react";
import Link from "next/link";
import { updateService } from "../../../actions"; // We will create this action next
import FeatureManager from "../../new/FeatureManager";
import ImagePicker from "../../new/ImagePicker";
import SubmitButton from "../../new/SubmitButton";

export default function EditServiceForm({
  service,
  lang,
}: {
  service: any;
  lang: string;
}) {
  const [activeTab, setActiveTab] = useState(lang);
  const locales = [
    { code: "en", label: "English" },
    { code: "el", label: "Ελληνικά" },
    { code: "es", label: "Español" },
  ];

  return (
    <form action={updateService} className="full-service-form">
      {/* Hidden ID field is vital for the update action */}
      <input type="hidden" name="id" value={service.id} />
      <input type="hidden" name="current_lang" value={lang} />
      <input
        type="hidden"
        name="existing_image_url"
        value={service.image_url}
      />
      <header className="form-sticky-header">
        <div className="header-left">
          <Link href={`/${lang}/admin/services`} className="back-btn">
            <ArrowLeft size={20} />
          </Link>
          <h1>
            Edit:{" "}
            {service.translations?.find((t: any) => t.language_code === lang)
              ?.title || "Service"}
          </h1>
        </div>
        <SubmitButton text="Update Service" />
      </header>

      <div className="form-layout">
        <aside className="form-sidebar">
          <div className="card-section">
            <h3>Media</h3>
            <ImagePicker initialImage={service.image_url} />
          </div>

          <div className="card-section">
            <h3>Core Settings</h3>
            <div className="input-group">
              <label>URL Slug</label>
              <input name="slug" defaultValue={service.slug} required />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Price ($)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={service.price}
                  required
                />
              </div>
              <div className="input-group">
                <label>Status</label>
                <select
                  name="is_active"
                  defaultValue={service.is_active.toString()}
                >
                  <option value="true">Live</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Category</label>
              <input name="service_type" defaultValue={service.service_type} />
            </div>
          </div>
        </aside>

        <main className="form-content">
          <div className="tab-container">
            <div className="tab-header">
              {locales.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={activeTab === l.code ? "active" : ""}
                  onClick={() => setActiveTab(l.code)}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {locales.map((l) => {
              const translation =
                service.translations?.find(
                  (t: any) => t.language_code === l.code,
                ) || {};
              const langFeatures =
                service.features
                  ?.filter((f: any) => f.language_code === l.code)
                  .sort((a: any, b: any) => a.order_index - b.order_index)
                  .map((f: any) => f.feature_text) || [];

              return (
                <div
                  key={l.code}
                  className={`tab-pane ${activeTab === l.code ? "show" : "hide"}`}
                >
                  <div className="input-group">
                    <label>Title ({l.code.toUpperCase()})</label>
                    <input
                      name={`title_${l.code}`}
                      defaultValue={translation.title}
                      required={l.code === "en"}
                    />
                  </div>
                  <div className="input-group">
                    <label>Summary</label>
                    <textarea
                      name={`summary_${l.code}`}
                      rows={3}
                      defaultValue={translation.summary}
                    />
                  </div>
                  <div className="input-group">
                    <label>Full Description</label>
                    <textarea
                      name={`description_${l.code}`}
                      rows={10}
                      defaultValue={translation.description}
                    />
                  </div>

                  <FeatureManager lang={l.code} initialData={langFeatures} />
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </form>
  );
}
