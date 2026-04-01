"use client";

import { useState } from "react";
import { deleteBlog } from "./actions";

export default function DeleteBlogButton({ blogId, lang, title }: { blogId: string; lang: string; title: string }) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="blog-action-btn delete"
      disabled={busy}
      onClick={async () => {
        const ok = window.confirm(`Delete blog "${title}"? This cannot be undone.`);
        if (!ok) return;
        setBusy(true);
        try {
          const fd = new FormData();
          fd.set("current_lang", lang);
          fd.set("id", blogId);
          await deleteBlog(fd);
        } catch {
          alert("Delete failed. Please try again.");
          setBusy(false);
        }
      }}
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}

