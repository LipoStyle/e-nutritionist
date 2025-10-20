'use client';

import { useEffect, useRef, useState, CSSProperties } from 'react';
import './ContactLayout.css';
import './CTAButton.css'
type Locale = 'en' | 'es' | 'el';
type Status = 'idle' | 'loading' | 'success' | 'error';
type FieldErrors = Partial<
  Record<'name' | 'email' | 'phone_number' | 'subject' | 'message', string>
>;


// icons
/* Inline brand icons (currentColor) */
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path fill="currentColor" d="M12 7.35a4.65 4.65 0 1 0 0 9.3 4.65 4.65 0 0 0 0-9.3Zm0 7.65a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM16.7 6.2a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 0 0-2.2 0Z"/>
      <path fill="currentColor" d="M7.3 2h9.4A5.3 5.3 0 0 1 22 7.3v9.4A5.3 5.3 0 0 1 16.7 22H7.3A5.3 5.3 0 0 1 2 16.7V7.3A5.3 5.3 0 0 1 7.3 2Zm9.4 1.6H7.3A3.7 3.7 0 0 0 3.6 7.3v9.4a3.7 3.7 0 0 0 3.7 3.7h9.4a3.7 3.7 0 0 0 3.7-3.7V7.3a3.7 3.7 0 0 0-3.7-3.7Z"/>
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path fill="currentColor" d="M4.98 3.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM3.75 9h2.46v11.25H3.75V9ZM9.09 9h2.35v1.54h.03c.33-.6 1.13-1.54 2.92-1.54 3.12 0 3.7 2.05 3.7 4.72v6.53h-2.46v-5.8c0-1.38-.03-3.16-1.93-3.16-1.94 0-2.24 1.51-2.24 3.06v5.9H9.09V9Z"/>
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path fill="currentColor" d="M22 12.06C22 6.55 17.52 2.1 12 2.1 6.48 2.1 2 6.55 2 12.06c0 4.98 3.66 9.11 8.44 9.86v-6.98H7.9v-2.88h2.54v-2.2c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.88h-2.34v6.98C18.34 21.17 22 17.04 22 12.06Z"/>
    </svg>
  );
}


/** Helper type so we can set CSS vars without `as any` */
type VarStyles = CSSProperties & {
  ['--i']?: string | number;
  ['--base-delay']?: string | number;
};

const ui: Record<
  Locale,
  {
    title: string;
    intro: string;
    contactTitle: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    socialsTitle: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  }
> = {
  en: {
    title: 'Get in touch',
    intro:
      'Tell us a bit about your project, goals, or questions. We’ll get back within 1–2 business days.',
    contactTitle: 'Contact information',
    addressLabel: 'Address:',
    phoneLabel: 'Phone:',
    emailLabel: 'Email:',
    socialsTitle: 'Follow us',
    name: 'Your name',
    email: 'Email address',
    phone: 'Phone (optional)',
    subject: 'Subject',
    message: 'How can we help?',
    submit: 'Send message',
    submitting: 'Sending…',
    success: 'Thanks! We received your message.',
    error: 'Something went wrong. Please try again.',
  },
  es: {
    title: 'Ponte en contacto',
    intro:
      'Cuéntanos sobre tu proyecto, objetivos o preguntas. Te responderemos en 1–2 días laborables.',
    contactTitle: 'Información de contacto',
    addressLabel: 'Dirección:',
    phoneLabel: 'Teléfono:',
    emailLabel: 'Correo:',
    socialsTitle: 'Síguenos',
    name: 'Tu nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono (opcional)',
    subject: 'Asunto',
    message: '¿Cómo podemos ayudar?',
    submit: 'Enviar mensaje',
    submitting: 'Enviando…',
    success: '¡Gracias! Hemos recibido tu mensaje.',
    error: 'Algo salió mal. Inténtalo de nuevo.',
  },
  el: {
    title: 'Επικοινωνήστε μαζί μας',
    intro:
      'Πείτε μας λίγα για το έργο ή τις απορίες σας. Απαντάμε μέσα σε 1–2 εργάσιμες ημέρες.',
    contactTitle: 'Στοιχεία επικοινωνίας',
    addressLabel: 'Διεύθυνση:',
    phoneLabel: 'Τηλέφωνο:',
    emailLabel: 'Email:',
    socialsTitle: 'Ακολουθήστε μας',
    name: 'Το όνομά σας',
    email: 'Email',
    phone: 'Τηλέφωνο (προαιρετικό)',
    subject: 'Θέμα',
    message: 'Πώς μπορούμε να βοηθήσουμε;',
    submit: 'Αποστολή',
    submitting: 'Αποστολή…',
    success: 'Ευχαριστούμε! Λάβαμε το μήνυμά σας.',
    error: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
  },
};

export default function ContactContent({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const rootRef = useRef<HTMLSectionElement | null>(null);

  // Reveal engine (no deps): supports directions via data-reveal="up|left|right"
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (reduce) {
      items.forEach((el) => el.classList.add('is-visible'));
      root.querySelectorAll<HTMLElement>('.reveal-child').forEach((c) => {
        c.style.opacity = '1';
        c.style.transform = 'none';
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add('is-visible');

          // Stagger child elements using --i (index)
          const kids = el.querySelectorAll<HTMLElement>('.reveal-child');
          kids.forEach((k, i) => {
            if (!k.style.getPropertyValue('--i')) {
              k.style.setProperty('--i', String(i));
            }
            void k.offsetHeight; // force reflow so delay applies reliably
            k.classList.add('child-visible');
          });

          io.unobserve(el);
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // form state
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone_number: String(fd.get('phone') || ''),
      subject: String(fd.get('subject') || ''),
      message: String(fd.get('message') || ''),
      company: String(fd.get('company') || ''), // honeypot
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let data: any = null;
        try {
          data = await res.json();
        } catch {}
        if (data?.errors) {
          const fieldErrors: FieldErrors = {};
          (['name', 'email', 'phone_number', 'subject', 'message'] as const).forEach((key) => {
            const msg = data.errors?.[key]?._errors?.[0];
            if (msg) fieldErrors[key] = msg;
          });
          setErrors(fieldErrors);
        }
        setStatus('error');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  // helpers for CSS vars
  const base0: VarStyles = { ['--base-delay']: '0ms' };
  const base120: VarStyles = { ['--base-delay']: '120ms' };
  const base160: VarStyles = { ['--base-delay']: '160ms' };
  const i = (n: number): VarStyles => ({ ['--i']: n });

  return (
    <section ref={rootRef} className="contactWrap" aria-label="Contact">
      {/* 1) FULL-WIDTH INTRO (no background/border) */}
      <section className="introFull" data-reveal="up" style={base0}>
        <h2 className="introTitle reveal-child" style={i(0)}>
          {t.title}
        </h2>
        <p className="introText reveal-child" style={i(1)}>
          {t.intro}
        </p>
      </section>

      {/* 2) GLASS WRAP + SPLIT GRID */}
      <section className="splitGrid glass">
        {/* LEFT (info + socials) — FLOATING, no bg/border */}
        <div className="splitLeft panel infoPanel" data-reveal="left" style={base120}>
          <h3 className="h3 reveal-child" style={i(0)}>
            {t.contactTitle}
          </h3>

          <ul className="infoList">
            <li className="reveal-child" style={i(1)}>
              <span className="label">{t.addressLabel}</span>
              <span>123 Nutrition Ave, Athens, GR</span>
            </li>
            <li className="reveal-child" style={i(2)}>
              <span className="label">{t.phoneLabel}</span>
              <a href="tel:+302100000000" aria-label="+30 210 000 0000 phone">
                +30 210 000 0000
              </a>
            </li>
            <li className="reveal-child" style={i(3)}>
              <span className="label">{t.emailLabel}</span>
              <a href="mailto:hello@e-nutritionist.com">hello@e-nutritionist.com</a>
            </li>
          </ul>

          <h3 className="h3 reveal-child" style={i(4)}>{t.socialsTitle}</h3>
          <div className="socials">
            <a
              className="chip reveal-child"
              style={i(5)}
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <InstagramIcon width={20} height={20} />
            </a>

            <a
              className="chip reveal-child"
              style={i(6)}
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedInIcon width={20} height={20} />
            </a>

            <a
              className="chip reveal-child"
              style={i(7)}
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              <FacebookIcon width={20} height={20} />
            </a>
          </div>

        </div>

        {/* RIGHT (FORM) — SOLID CARD */}
        <div className="splitRight panel formPanel" data-reveal="right" style={base160}>
          <form onSubmit={handleSubmit} noValidate className="form">
            {/* Honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="honeypot"
            />

            <input
              className="reveal-child"
              style={i(0)}
              type="text"
              name="name"
              placeholder={t.name}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'cf-name-error' : undefined}
            />
            {errors.name && (
              <span id="cf-name-error" className="fieldError reveal-child" style={i(1)} role="alert">
                {errors.name}
              </span>
            )}

            <input
              className="reveal-child"
              style={i(2)}
              type="email"
              name="email"
              placeholder={t.email}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'cf-email-error' : undefined}
            />
            {errors.email && (
              <span id="cf-email-error" className="fieldError reveal-child" style={i(3)} role="alert">
                {errors.email}
              </span>
            )}

            <input
              className="reveal-child"
              style={i(4)}
              type="tel"
              name="phone"
              placeholder={t.phone}
              aria-invalid={!!errors.phone_number}
              aria-describedby={errors.phone_number ? 'cf-phone-error' : undefined}
            />
            {errors.phone_number && (
              <span id="cf-phone-error" className="fieldError reveal-child" style={i(5)} role="alert">
                {errors.phone_number}
              </span>
            )}

            <input
              className="reveal-child"
              style={i(6)}
              type="text"
              name="subject"
              placeholder={t.subject}
              required
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'cf-subject-error' : undefined}
            />
            {errors.subject && (
              <span id="cf-subject-error" className="fieldError reveal-child" style={i(7)} role="alert">
                {errors.subject}
              </span>
            )}

            <textarea
              className="reveal-child"
              style={i(8)}
              name="message"
              placeholder={t.message}
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'cf-message-error' : undefined}
            />
            {errors.message && (
              <span id="cf-message-error" className="fieldError reveal-child" style={i(9)} role="alert">
                {errors.message}
              </span>
            )}

            <button
  className="cta-button reveal-child"
  style={i(10)}
  type="submit"
  disabled={status === 'loading'}
  aria-busy={status === 'loading'}
  aria-label={t.submit}
>
  {status === 'loading' ? t.submitting : t.submit}
</button>

          </form>

          {status === 'success' && (
            <p className="success reveal-child" style={i(11)} role="status" aria-live="polite">
              {t.success}
            </p>
          )}
          {status === 'error' && (
            <p className="error reveal-child" style={i(11)} role="status" aria-live="polite">
              {t.error}
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
