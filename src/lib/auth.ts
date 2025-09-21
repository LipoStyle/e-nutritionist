import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { cookies as nextCookies } from 'next/headers';
import { ADMIN_JWT_SECRET } from '@/lib/adminJwt';

export type AdminJwtPayload = { role?: string; email?: string; iat?: number; exp?: number };

function extractBearer(h: string | null | undefined) {
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
}

function readCookieFromHeader(name: string, header: string | null) {
  if (!header) return undefined;
  const n = name + '=';
  for (const pair of header.split(';')) {
    const s = pair.trim();
    if (s.startsWith(n)) {
      const v = s.slice(n.length);
      try { return decodeURIComponent(v); } catch { return v; }
    }
  }
  return undefined;
}

async function getCookieFromReq(req: NextRequest, name: string) {
  const anyReq = req as any;
  if (typeof anyReq.cookies?.get === 'function') {
    return anyReq.cookies.get(name)?.value ?? anyReq.cookies.get(name);
  }
  if (typeof anyReq.cookies === 'function') {
    const jar = await anyReq.cookies();
    return jar?.get?.(name)?.value ?? jar?.get?.(name);
  }
  return readCookieFromHeader(name, req.headers.get('cookie'));
}

export async function verifyAdminToken(token: string): Promise<AdminJwtPayload> {
  const { payload } = await jwtVerify<AdminJwtPayload>(token, ADMIN_JWT_SECRET, { algorithms: ['HS256'] });
  if (payload.role !== 'admin') throw new Error('Forbidden');
  return payload;
}

export class UnauthorizedError extends Error { status = 401; constructor(msg = 'Unauthorized'){ super(msg); } }

export async function requireAdmin(req?: NextRequest): Promise<AdminJwtPayload> {
  let token: string | undefined;

  if (req) {
    token =
      (await getCookieFromReq(req, 'admin_token')) ||
      extractBearer(req.headers.get('authorization')) ||
      undefined;
  }

  // ▼ This is the line that removes the TS error
  if (!token) {
    try {
      const jar: any = await (nextCookies() as any);
      token = jar?.get?.('admin_token')?.value ?? jar?.get?.('admin_token');
    } catch {}
  }

  if (!token) throw new UnauthorizedError();

  try {
    return await verifyAdminToken(token);
  } catch {
    throw new UnauthorizedError();
  }
}
