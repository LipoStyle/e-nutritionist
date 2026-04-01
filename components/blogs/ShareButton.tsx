"use client";

import { useState } from "react";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      className="BlogPost__shareBtn"
      onClick={async () => {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await (navigator as any).share({ title, url });
            return;
          } catch {
            // fall back to copy
          }
        }
        await doCopy();
      }}
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}

