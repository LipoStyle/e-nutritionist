export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { SignJWT } from 'jose'

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? 'dev-secret-change-me')

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string }
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } })
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = bcrypt.compareSync(password, admin.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = await new SignJWT({ role: 'admin', email: admin.email })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
