"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Feature {
  id: string;
  text: string;
}

// Add initialData prop
export default function FeatureManager({
  lang,
  initialData = [],
}: {
  lang: string;
  initialData?: string[];
}) {
  // Initialize state with existing features if they exist
  const [features, setFeatures] = useState<Feature[]>(
    initialData.map((text) => ({ id: crypto.randomUUID(), text })),
  );
  const [inputValue, setInputValue] = useState("");

  const addFeature = () => {
    if (!inputValue.trim()) return;
    setFeatures([
      ...features,
      { id: crypto.randomUUID(), text: inputValue.trim() },
    ]);
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
          placeholder="Add a perk..."
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addFeature())
          }
        />
        <button type="button" onClick={addFeature} className="btn-add-feature">
          <Plus size={18} /> Add
        </button>
      </div>
      <div className="feature-list">
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
