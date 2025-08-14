import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '../../_utils/auth'

// GET /api/admin/hero/:id
export async function GET(_req: Request, ctx: any) {
  await requireAdmin()
  const { id } = ctx.params as { id: string }
  const row = await prisma.heroSetting.findUnique({ where: { id } })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(row)
}

// PUT /api/admin/hero/:id
export async function PUT(req: Request, ctx: any) {
  await requireAdmin()
  const { id } = ctx.params as { id: string }
  const body = await req.json()
  try {
    const updated = await prisma.heroSetting.update({
      where: { id },
      data: {
        pageKey: body.pageKey ?? undefined,
        language: body.language ?? undefined,
        title: body.title ?? undefined,
        description: body.description ?? undefined,
        message: body.message ?? undefined,
        bookText: body.bookText ?? undefined,
        bookHref: body.bookHref ?? undefined,
        bgImage: body.bgImage ?? undefined,
        overlayOpacity: body.overlayOpacity ?? undefined,
        offsetHeader: body.offsetHeader ?? undefined,
        height: body.height ?? undefined,
      },
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Entry already exists for pageKey+language' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}

// DELETE /api/admin/hero/:id
export async function DELETE(_req: Request, ctx: any) {
  await requireAdmin()
  const { id } = ctx.params as { id: string }
  await prisma.heroSetting.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
