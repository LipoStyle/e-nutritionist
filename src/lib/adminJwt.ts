// src/lib/adminJwt.ts
import { TextEncoder } from 'util';

export const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me'
);
