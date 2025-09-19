// /src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTransporter } from '@/lib/mail';
import { getContactFormSchema, type Locale } from '@/app/[lang]/contact/ContactForm/schema';

export const runtime = 'nodejs'; // ✅ Nodemailer needs Node runtime (not Edge)

const HONEYPOT_FIELD = 'company';

export async function POST(req: NextRequest) {
  try {
    const locale = (req.headers.get('x-locale') ?? 'en') as Locale;

    const body = await req.json().catch(() => ({}));
    if (typeof body[HONEYPOT_FIELD] === 'string' && body[HONEYPOT_FIELD].trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    const schema = getContactFormSchema(locale);
    const parsed = schema.safeParse({
      name: body.name,
      email: body.email,
      phone_number: body.phone_number ?? body.phone,
      subject: body.subject,
      message: body.message,
    });

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.format() }, { status: 400 });
    }

    const values = parsed.data;

    const siteName = process.env.SITE_NAME ?? 'Website';
    const adminTo = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL ?? process.env.SMTP_USER;

    if (!adminTo || !fromEmail) {
      return NextResponse.json(
        { ok: false, error: 'Missing ADMIN_EMAIL or FROM_EMAIL envs' },
        { status: 500 }
      );
    }

    const text = [
      `New contact form submission on ${siteName}`,
      '',
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone_number ? `Phone: ${values.phone_number}` : undefined,
      `Subject: ${values.subject}`,
      '',
      `Message:`,
      values.message ?? '(no message)',
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu">
        <h2 style="margin:0 0 12px">New contact form submission</h2>
        <p><b>Site:</b> ${siteName}</p>
        <p><b>Name:</b> ${escapeHtml(values.name)}</p>
        <p><b>Email:</b> ${escapeHtml(values.email)}</p>
        ${values.phone_number ? `<p><b>Phone:</b> ${escapeHtml(values.phone_number)}</p>` : ''}
        <p><b>Subject:</b> ${escapeHtml(values.subject)}</p>
        <p><b>Message:</b></p>
        <pre style="white-space:pre-wrap">${escapeHtml(values.message ?? '(no message)')}</pre>
      </div>
    `;

    // ✅ await the transporter (async + cached)
    const transporter = await getTransporter();

    await transporter.sendMail({
      from: fromEmail,
      to: adminTo,
      replyTo: values.email,
      subject: `[${siteName}] New contact: ${values.subject}`,
      text,
      html,
    });

    if (process.env.SEND_AUTOREPLY === 'true') {
      const ackText =
        locale === 'es'
          ? `Hola ${values.name},\n\nHemos recibido tu mensaje y te responderemos pronto.\n\n— ${siteName}`
          : locale === 'el'
          ? `Γεια σου ${values.name},\n\nΛάβαμε το μήνυμά σου και θα απαντήσουμε σύντομα.\n\n— ${siteName}`
          : `Hi ${values.name},\n\nWe received your message and will get back to you soon.\n\n— ${siteName}`;

      const ackHtml = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu">
          <p>${ackText.replace(/\n/g, '<br/>')}</p>
        </div>`;

      await transporter.sendMail({
        from: fromEmail,
        to: values.email,
        subject: `Thanks for reaching out to ${siteName}`,
        text: ackText,
        html: ackHtml,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (ch) =>
    ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '"' ? '&quot;' : '&#39;'
  );
}
