"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

export default function ImagePicker() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="image-picker-container">
      {preview ? (
        <div className="image-preview-wrapper">
          <img src={preview} alt="Preview" className="preview-img" />
          <button
            type="button"
            onClick={removeImage}
            className="btn-remove-preview"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="image-upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-content">
            <div className="icon-pulse">
              <Upload size={24} />
            </div>
            <p>Click to upload cover</p>
            <span>JPG, PNG or WebP</span>
          </div>
        </div>
      )}

      <input
        type="file"
        name="image"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        required
      />
    </div>
  );
}
