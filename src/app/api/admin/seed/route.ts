// src/app/api/admin/seed/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Protect this endpoint with a one-time secret header
const ok = (req: Request) => {
  const secret = process.env.SEED_SECRET
  const hdr = req.headers.get('x-seed-secret')
  return secret && hdr && hdr === secret
}

export async function POST(req: Request) {
  if (!ok(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { email, password } = (await req.json()) as { email?: string; password?: string }
    if (!email || !password) return NextResponse.json({ error: 'Email & password required' }, { status: 400 })

    // 1) Ensure table exists (works on Postgres via Accelerate/Data Proxy too)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Admin" (
        "id"           text PRIMARY KEY,
        "email"        text UNIQUE NOT NULL,
        "passwordHash" text NOT NULL,
        "createdAt"    timestamptz NOT NULL DEFAULT now(),
        "updatedAt"    timestamptz NOT NULL DEFAULT now()
      );
    `)

    // 2) If an admin already exists, stop
    const count = await prisma.admin.count()
    if (count > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
    }

    // 3) Create the admin
    const hash = bcrypt.hashSync(password, 10)
    await prisma.admin.create({
      data: { email: email.toLowerCase(), passwordHash: hash },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 })
  }
}
