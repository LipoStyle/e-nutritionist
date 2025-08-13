import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '../../_utils/auth'
import type { HeroPayload } from '../types'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const row = await prisma.heroSetting.findUnique({ where: { id: params.id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(row)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const body = (await req.json()) as Partial<HeroPayload>
  try {
    const updated = await prisma.heroSetting.update({
      where: { id: params.id },
      data: {
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        message: body.message ?? undefined,
        bookText: body.bookText ?? undefined,
        bookHref: body.bookHref ?? undefined,
        bgImage: body.bgImage ?? undefined,
        overlayOpacity: body.overlayOpacity ?? undefined,
        offsetHeader: body.offsetHeader ?? undefined,
        height: body.height ?? undefined,
        // pageKey/language can be editable if you really want, but be careful with uniqueness
        ...(body.pageKey ? { pageKey: body.pageKey } : {}),
        ...(body.language ? { language: body.language } : {}),
      },
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Entry already exists for pageKey+language' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  await prisma.heroSetting.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
