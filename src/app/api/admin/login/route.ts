// src/app/api/admin/login/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';
import { ADMIN_JWT_SECRET } from '@/lib/adminJwt';

const SUPPORTED_LANGS = ['en', 'es', 'el'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
const isLang = (v: string | null | undefined): v is Lang =>
  !!v && SUPPORTED_LANGS.includes(v as Lang);

export async function POST(req: Request) {
  try {
    // Detect payload type (JSON vs form)
    const contentType = req.headers.get('content-type') ?? '';
    let email = '';
    let password = '';

    if (contentType.includes('application/json')) {
      const body = (await req.json()) as { email?: string; password?: string };
      email = (body.email ?? '').toLowerCase().trim();
      password = body.password ?? '';
    } else {
      const form = await req.formData();
      email = String(form.get('email') ?? '').toLowerCase().trim();
      password = String(form.get('password') ?? '');
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = bcrypt.compareSync(password, admin.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // Build JWT
    const token = await new SignJWT({ role: 'admin', email: admin.email })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(ADMIN_JWT_SECRET);

    // Figure out locale + safe redirect target
    const url = new URL(req.url);
    const qFrom = url.searchParams.get('from') || '';
    const qLang = url.searchParams.get('lang');

    // Try to get lang from query, otherwise from Referer path, else 'en'
    let lang: Lang = 'en';
    if (isLang(qLang)) lang = qLang;
    else {
      const ref = req.headers.get('referer');
      if (ref) {
        try {
          const refPath = new URL(ref).pathname;
          const seg = refPath.split('/').filter(Boolean)[0];
          if (isLang(seg)) lang = seg;
        } catch {
          /* ignore */
        }
      }
    }

    const safeFrom = qFrom.startsWith(`/${lang}/admin`) ? qFrom : `/${lang}/admin`;

    // Prepare response
    const origin = url.origin;
    const dest = new URL(safeFrom, origin);

    // If it was a regular form post, redirect so the browser navigates itself.
    if (!contentType.includes('application/json')) {
      const res = NextResponse.redirect(dest, 303);
      res.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/', // IMPORTANT for /api/*
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // Otherwise (fetch/xhr), return JSON with next hop; client will router.replace()
    const res = NextResponse.json({ ok: true, redirectTo: dest.pathname });
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // IMPORTANT
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
