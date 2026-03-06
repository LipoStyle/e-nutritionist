"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Feature {
  id: string;
  text: string;
}

export default function FeatureManager({ lang }: { lang: string }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addFeature = () => {
    if (!inputValue.trim()) return;
    const newFeature = { id: crypto.randomUUID(), text: inputValue.trim() };
    setFeatures([...features, newFeature]);
    setInputValue("");
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  return (
    <div className="feature-manager-container">
      <label className="form-label">
        Service Features ({lang.toUpperCase()})
      </label>

      {/* Hidden input to send data to Server Action */}
      <input
        type="hidden"
        name={`features_${lang}`}
        value={JSON.stringify(features.map((f) => f.text))}
      />

      <div className="feature-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. 24/7 Support"
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addFeature())
          }
        />
        <button type="button" onClick={addFeature} className="btn-add-feature">
          <Plus size={18} /> Add
        </button>
      </div>

      <div className="feature-list">
        {features.length === 0 && (
          <p className="empty-text">No features added yet.</p>
        )}
        {features.map((feature, index) => (
          <div key={feature.id} className="feature-item">
            <div className="feature-content">
              <GripVertical size={16} className="drag-icon" />
              <span className="index">{index + 1}.</span>
              <span className="text">{feature.text}</span>
            </div>
            <button
              type="button"
              onClick={() => removeFeature(feature.id)}
              className="btn-delete-feature"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
