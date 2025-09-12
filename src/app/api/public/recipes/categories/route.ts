export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Lang = 'en' | 'es' | 'el';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const language = (searchParams.get('language') || 'en') as Lang;

    // Get categories ordered; pick the first image per category.
    const rows = await prisma.recipe.findMany({
      where: { language },
      orderBy: [{ category: 'asc' as const }, { publishedDate: 'desc' as const }],
      select: { category: true, imageUrl: true },
    });

    const map = new Map<string, string | null>();
    for (const r of rows) {
      if (!r.category) continue;
      if (!map.has(r.category)) map.set(r.category, r.imageUrl ?? null);
    }

    const categories = Array.from(map, ([name, imageUrl]) => ({ name, imageUrl }));
    return NextResponse.json({ categories }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'DB_ERROR', message: err?.message ?? 'Unknown' },
      { status: 500 }
    );
  }
}
