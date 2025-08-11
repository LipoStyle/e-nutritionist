// src/lib/auth.ts
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET)

export type AdminToken = JWTPayload & {
  role: 'admin'
  email: string
}

export async function signAdminToken(email: string) {
  return await new SignJWT({ role: 'admin', email })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify<AdminToken>(token, secret)
  if (payload.role !== 'admin') throw new Error('Invalid role')
  return payload
}
