// /src/lib/mail.ts
import type { Transporter } from 'nodemailer';

let cached: Transporter | null = null;

/**
 * Returns a verified Nodemailer transporter.
 * - Uses Node runtime only (caller should set `export const runtime = 'nodejs'`).
 * - Supports Gmail (App Password) or any SMTP host.
 * - Caches the transporter across calls.
 */
export async function getTransporter(): Promise<Transporter> {
  if (cached) return cached;

  // Dynamic import so this never leaks into client bundles by accident
  const nodemailer = await import('nodemailer');

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || '465');
  const secure = port === 465; // true for 465, false for 587
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('Missing SMTP_USER or SMTP_PASS environment variables');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  // Fail fast if creds/host are wrong
  await transporter.verify();
  cached = transporter;
  return transporter;
}
