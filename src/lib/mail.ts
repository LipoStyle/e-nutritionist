// /lib/mail.ts
import nodemailer from 'nodemailer';

let _transporter: nodemailer.Transporter | null = null;

export function getTransporter() {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP config missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and SMTP_SECURE).'
    );
  }

  _transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return _transporter;
}
