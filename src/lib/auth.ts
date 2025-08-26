// src/lib/auth.ts
import { jwtVerify } from 'jose';
import { ADMIN_JWT_SECRET } from '@/lib/adminJwt';

export type AdminJwtPayload = {
  role?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export async function verifyAdminToken(token: string): Promise<AdminJwtPayload> {
  const { payload } = await jwtVerify<AdminJwtPayload>(token, ADMIN_JWT_SECRET, {
    algorithms: ['HS256'],
  });
  if (payload.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return payload;
}
