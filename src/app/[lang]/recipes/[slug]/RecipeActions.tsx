"use client";

import { useState } from "react";
import styles from "./RecipeActions.module.css";

type Props = {
  title: string;
  description?: string | null;
};

export default function RecipeActions({ title, description }: Props) {
  const [copied, setCopied] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleShare = async () => {
    setDisabled(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description ?? "",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setTimeout(() => setDisabled(false), 1000); // re-enable after 1s
    }
  };

  return (
    <div className={styles.actions}>
      <button
        type="button"
        onClick={handleShare}
        className={styles.button}
        aria-label="Share this recipe"
        aria-live="polite"
        disabled={disabled}
      >
        {copied ? "Link copied!" : "Share"}
      </button>
    </div>
  );
}
