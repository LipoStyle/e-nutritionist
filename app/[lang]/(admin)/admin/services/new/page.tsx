"use client";

import { useState } from "react";
import { ArrowLeft, Languages } from "lucide-react";
import Link from "next/link";
import { createService } from "../actions";
import FeatureManager from "./FeatureManager";
import ImagePicker from "./ImagePicker";
import SubmitButton from "./SubmitButton";
import "@/styles/admin-services.css";

export default function NewServicePage() {
  const [activeTab, setActiveTab] = useState("en");
  const locales = [
    { code: "en", label: "English" },
    { code: "el", label: "Ελληνικά" },
    { code: "es", label: "Español" },
  ];

  return (
    <div className="services-admin-container">
      <form action={createService} className="full-service-form">
        <header className="form-sticky-header">
          <div className="header-left">
            <Link href="/en/admin/services" className="back-btn">
              <ArrowLeft size={20} />
            </Link>
            <h1>Create New Service</h1>
          </div>
          {/* Dynamic Submit Button with Loading States */}
          <SubmitButton />
        </header>

        <div className="form-layout">
          {/* Sidebar: Global Data */}
          <aside className="form-sidebar">
            <div className="card-section">
              <h3>Media</h3>
              {/* Dynamic Image Picker with Live Preview */}
              <ImagePicker />
            </div>

            <div className="card-section">
              <h3>Core Settings</h3>
              <div className="input-group">
                <label>URL Slug</label>
                <input
                  name="slug"
                  placeholder="e.g., keto-diet-plan"
                  required
                />
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Price ($)</label>
                  <input name="price" type="number" step="0.01" required />
                </div>
                <div className="input-group">
                  <label>Status</label>
                  <select name="is_active">
                    <option value="true">Live</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Category</label>
                <input name="service_type" placeholder="e.g., Nutrition" />
              </div>
            </div>
          </aside>

          {/* Main Content: Translations & Features */}
          <main className="form-content">
            <div className="tab-container">
              <div className="tab-header">
                <div className="tab-label">
                  <Languages size={16} /> Languages
                </div>
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

              {locales.map((l) => (
                <div
                  key={l.code}
                  className={`tab-pane ${activeTab === l.code ? "show" : "hide"}`}
                >
                  <div className="input-group">
                    <label>Title ({l.code.toUpperCase()})</label>
                    <input
                      name={`title_${l.code}`}
                      placeholder="Enter service title..."
                      required={l.code === "en"}
                    />
                  </div>
                  <div className="input-group">
                    <label>Summary</label>
                    <textarea
                      name={`summary_${l.code}`}
                      rows={3}
                      placeholder="Short summary..."
                    />
                  </div>
                  <div className="input-group">
                    <label>Full Description</label>
                    <textarea
                      name={`description_${l.code}`}
                      rows={10}
                      placeholder="Detailed description..."
                    />
                  </div>

                  <FeatureManager lang={l.code} />
                </div>
              ))}
            </div>
          </main>
        </div>
      </form>
    </div>
  );
}
