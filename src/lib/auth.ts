import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const RAW = process.env.ADMIN_JWT_SECRET;
if (process.env.NODE_ENV === 'production' && !RAW) {
  throw new Error('ADMIN_JWT_SECRET is required in production');
}
const secretKey = new TextEncoder().encode(RAW ?? 'dev-secret-change-me');

// keep these in sync with middleware if you enable them there too
const ISSUER = 'e-nutritionist';
const AUDIENCE = 'admin';

export type AdminToken = JWTPayload & {
  role: 'admin';
  email: string;
};

export async function signAdminToken(email: string) {
  return await new SignJWT({ role: 'admin', email })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminToken> {
  try {
    const { payload } = await jwtVerify<AdminToken>(token, secretKey, {
      issuer: ISSUER,
      audience: AUDIENCE,
      // helps with small clock skew between serverless nodes
      clockTolerance: 5,
    });
    if (payload.role !== 'admin') {
      throw new Error('Invalid role');
    }
    return payload;
  } catch (err: any) {
    // Re-throw a normalized error so callers can map to 401
    const e = new Error('Unauthorized');
    (e as any).status = 401;
    throw e;
  }
}
