import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '../_utils/auth'

// GET /api/admin/hero?pageKey=&language=
export async function GET(req: Request) {
  await requireAdmin()
  const { searchParams } = new URL(req.url)
  const pageKey = searchParams.get('pageKey') || undefined
  const language = searchParams.get('language') || undefined

  const rows = await prisma.heroSetting.findMany({
    where: { ...(pageKey && { pageKey }), ...(language && { language }) },
    orderBy: [{ pageKey: 'asc' }, { language: 'asc' }],
  })
  return NextResponse.json(rows)
}

// POST /api/admin/hero
export async function POST(req: Request) {
  await requireAdmin()
  const body = await req.json()
  if (!body.pageKey || !body.language) {
    return NextResponse.json(
      { error: 'pageKey and language are required' },
      { status: 400 }
    )
  }
  try {
    const created = await prisma.heroSetting.create({
      data: {
        pageKey: body.pageKey,
        language: body.language,
        title: body.title ?? null,
        description: body.description ?? null,
        message: body.message ?? null,
        bookText: body.bookText ?? null,
        bookHref: body.bookHref ?? null,
        bgImage: body.bgImage ?? null,
        overlayOpacity: body.overlayOpacity ?? 0.45,
        offsetHeader: body.offsetHeader ?? true,
        height: body.height ?? 'default',
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json(
        { error: 'Entry already exists for pageKey+language' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  }
}
