"use client";

import "@/styles/contact/contactMainLayout.css";

import ContactFormSection from "@/components/contact/sections/form/ContactFormSection";
import ContactInfoSection from "@/components/contact/sections/info/ContactInfoSection";
import ContactExpectSection from "@/components/contact/sections/expect/ContactExpectSection";

export default function ContactMainLayout() {
  return (
    <section className="contact-main" aria-label="Contact main content">
      <div className="contact-main__container">
        <div className="contact-main__grid">
          <div className="contact-main__left">
            <ContactFormSection />
          </div>

          <div className="contact-main__right">
            <ContactInfoSection />
            <ContactExpectSection />
          </div>
        </div>
      </div>
    </section>
  );
}
