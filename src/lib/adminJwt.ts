// src/lib/adminJwt.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
// if you prefer your previous util import, you can keep it; Next 18+ has global TextEncoder

const RAW_SECRET = process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me';
export const ADMIN_JWT_SECRET = new TextEncoder().encode(RAW_SECRET);

export type AdminJwtPayload = JWTPayload & {
  role: 'admin';
  email: string;
  sub?: string; // optional admin id
};

/** Create a signed admin JWT (default: 8h). */
export async function signAdminToken(
  payload: Omit<AdminJwtPayload, 'iat' | 'exp'>,
  expiresIn: string = '8h',
  opts?: { issuer?: string; audience?: string }
): Promise<string> {
  let jwt = new SignJWT({ ...payload, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn);

  if (opts?.issuer) jwt = jwt.setIssuer(opts.issuer);
  if (opts?.audience) jwt = jwt.setAudience(opts.audience);

  return jwt.sign(ADMIN_JWT_SECRET);
}

/** Centralized verifier (checks HS256 + role). */
export async function verifyAdminJWT(
  token: string,
  opts?: { issuer?: string; audience?: string }
): Promise<AdminJwtPayload> {
  const { payload } = await jwtVerify<AdminJwtPayload>(token, ADMIN_JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: opts?.issuer,
    audience: opts?.audience,
  });
  if (payload.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return payload;
}
