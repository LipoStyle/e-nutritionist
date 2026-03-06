"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { FooterTranslations } from "../Footer";
import "@/styles/footer/layers/FooterLayerNewsletter.css";

export default function FooterLayerNewsletter({
  t,
}: {
  t: FooterTranslations;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Initialize the browser client directly
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // Insert into the 'subscribers' table you created in SQL
    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error) {
      console.error("Subscription error:", error.message);
      setStatus("error");
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section className="footerLayer footerNewsletter">
      <div className="footerContainer footerNewsletterInner">
        <div>
          <div className="footerTitle">{t.newsletterTitle}</div>
          <p className="footerText">
            {status === "success"
              ? "Subscribed successfully!"
              : t.newsletterDesc}
          </p>
        </div>

        <form className="footerForm" onSubmit={onSubmit}>
          <input
            className="footerInput"
            type="email"
            name="email"
            required
            disabled={status === "loading" || status === "success"}
            placeholder={t.emailPlaceholder}
          />
          <button
            className="footerButton"
            type="submit"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? "..." : t.subscribe}
          </button>
        </form>
        {status === "error" && (
          <p style={{ color: "#ff4d4d", fontSize: "12px", marginTop: "10px" }}>
            Submission failed. You might already be on the list!
          </p>
        )}
      </div>
    </section>
  );
}
