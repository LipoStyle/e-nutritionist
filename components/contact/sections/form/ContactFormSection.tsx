"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import "@/styles/contact/contactFormSection.css";

import { contactFormData } from "@/app/[lang]/(public)/contact/data";

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

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  service: "",
  subject: "",
  message: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ContactFormSection() {
  const params = useParams<{ lang?: string }>();
  const lang = normalizeLang(params?.lang);
  const content = useMemo(() => contactFormData[lang], [lang]);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    fullName: false,
    email: false,
    phone: false,
    service: false,
    subject: false,
    message: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.fullName.trim()) e.fullName = "required";
    if (!form.email.trim() || !isValidEmail(form.email)) e.email = "required";
    if (!form.message.trim()) e.message = "required";

    return e;
  }, [form]);

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onBlur<K extends keyof FormState>(key: K) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      service: true,
      subject: true,
      message: true,
    });

    if (Object.keys(errors).length > 0) return;

    // Front-end success state (no backend yet)
    setIsSubmitted(true);
    setForm(INITIAL);
  }

  return (
    <section className="contact-form" aria-labelledby="contact-form-title">
      <div className="contact-form__card">
        {!isSubmitted ? (
          <>
            <header className="contact-form__header">
              <h2 id="contact-form-title" className="contact-form__title">
                {content.title}
              </h2>
              <p className="contact-form__subtitle">{content.subtitle}</p>
            </header>

            <form className="contact-form__form" onSubmit={onSubmit}>
              <div className="contact-form__grid2">
                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="fullName">
                    {content.fields.fullName.label}{" "}
                    <span className="contact-form__req">
                      {content.fields.fullName.requiredLabel}
                    </span>
                  </label>
                  <input
                    id="fullName"
                    className={`contact-form__input ${
                      touched.fullName && errors.fullName
                        ? "contact-form__input--error"
                        : ""
                    }`}
                    placeholder={content.fields.fullName.placeholder}
                    value={form.fullName}
                    onChange={(ev) => onChange("fullName", ev.target.value)}
                    onBlur={() => onBlur("fullName")}
                    autoComplete="name"
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="email">
                    {content.fields.email.label}{" "}
                    <span className="contact-form__req">
                      {content.fields.email.requiredLabel}
                    </span>
                  </label>
                  <input
                    id="email"
                    className={`contact-form__input ${
                      touched.email && errors.email
                        ? "contact-form__input--error"
                        : ""
                    }`}
                    placeholder={content.fields.email.placeholder}
                    value={form.email}
                    onChange={(ev) => onChange("email", ev.target.value)}
                    onBlur={() => onBlur("email")}
                    autoComplete="email"
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="phone">
                    {content.fields.phone.label}
                  </label>
                  <input
                    id="phone"
                    className="contact-form__input"
                    placeholder={content.fields.phone.placeholder}
                    value={form.phone}
                    onChange={(ev) => onChange("phone", ev.target.value)}
                    onBlur={() => onBlur("phone")}
                    autoComplete="tel"
                  />
                </div>

                <div className="contact-form__field">
                  <label className="contact-form__label" htmlFor="service">
                    {content.fields.service.label}
                  </label>
                  <div className="contact-form__select-wrap">
                    <select
                      id="service"
                      className="contact-form__select"
                      value={form.service}
                      onChange={(ev) => onChange("service", ev.target.value)}
                      onBlur={() => onBlur("service")}
                    >
                      <option value="">
                        {content.fields.service.placeholder}
                      </option>
                      {content.services.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="contact-form__field contact-form__field--full">
                <label className="contact-form__label" htmlFor="subject">
                  {content.fields.subject.label}
                </label>
                <input
                  id="subject"
                  className="contact-form__input"
                  placeholder={content.fields.subject.placeholder}
                  value={form.subject}
                  onChange={(ev) => onChange("subject", ev.target.value)}
                  onBlur={() => onBlur("subject")}
                />
              </div>

              <div className="contact-form__field contact-form__field--full">
                <label className="contact-form__label" htmlFor="message">
                  {content.fields.message.label}{" "}
                  <span className="contact-form__req">
                    {content.fields.message.requiredLabel}
                  </span>
                </label>
                <textarea
                  id="message"
                  className={`contact-form__textarea ${
                    touched.message && errors.message
                      ? "contact-form__input--error"
                      : ""
                  }`}
                  placeholder={content.fields.message.placeholder}
                  value={form.message}
                  onChange={(ev) => onChange("message", ev.target.value)}
                  onBlur={() => onBlur("message")}
                  rows={6}
                />
              </div>

              <button type="submit" className="contact-form__submit">
                <span className="contact-form__submit-icon" aria-hidden="true">
                  ✈
                </span>
                {content.submitLabel}
              </button>
            </form>
          </>
        ) : (
          <div
            className="contact-form__success"
            role="status"
            aria-live="polite"
          >
            <h3 className="contact-form__success-title">
              {content.successTitle}
            </h3>
            <p className="contact-form__success-text">
              {content.successMessage}
            </p>
            <button
              className="contact-form__success-btn"
              type="button"
              onClick={() => setIsSubmitted(false)}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
