"use client";

import { useParams } from "next/navigation";
import "@/styles/contact/contactFaqSection.css";

import { contactFaqData } from "@/app/[lang]/(public)/contact/data";

type Lang = "en" | "es" | "el";
const SUPPORTED: Lang[] = ["en", "es", "el"];

function normalizeLang(value: unknown): Lang {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v !== "string") return "en";
  const mapped = v === "eng" ? "en" : v;
  return (SUPPORTED as readonly string[]).includes(mapped)
    ? (mapped as Lang)
    : "en";
}

export default function ContactFaqSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);

  const content = contactFaqData[lang];

  return (
    <section className="contact-faq" aria-labelledby="contact-faq-title">
      <div className="contact-faq__container">
        <header className="contact-faq__header">
          <h2 id="contact-faq-title" className="contact-faq__title">
            {content.title}
          </h2>
          <p className="contact-faq__subtitle">{content.subtitle}</p>
        </header>

        <div className="contact-faq__grid">
          {content.items.map((item, idx) => (
            <article key={idx} className="contact-faq__card">
              <h3 className="contact-faq__question">{item.question}</h3>
              <p className="contact-faq__answer">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
