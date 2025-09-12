export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type Lang = 'en' | 'es' | 'el';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const language = (searchParams.get('language') || 'en') as Lang;
    const category = searchParams.get('category') || undefined;
    const q = searchParams.get('q') || undefined;
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const perPage = Math.min(50, Math.max(1, Number(searchParams.get('perPage') || '24')));
    const skip = (page - 1) * perPage;

    // Build `where` with correct typing — no undefined keys.
    const and: Prisma.RecipeWhereInput[] = [{ language }];
    if (category) and.push({ category });
    if (q) and.push({ title: { contains: q, mode: 'insensitive' } });
    const where: Prisma.RecipeWhereInput = { AND: and };

    const [rows, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        orderBy: [{ publishedDate: 'desc' }, { updatedAt: 'desc' }],
        take: perPage,
        skip,
        // Use ONLY `select` (not `include` at the same time)
        select: {
          id: true,
          slug: true,
          title: true,
          shortDescription: true,
          description: true,
          category: true,
          imageUrl: true,
          publishedDate: true,
          valuableInfo: {
            select: {
              duration: true,
              difficulty: true,
              portions: true,
            },
          },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    const items = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.shortDescription ?? r.description ?? null,
      category: r.category,
      image_url: r.imageUrl ?? null,
      published_date: r.publishedDate ?? null,
      valuable_info: r.valuableInfo ?? null,
    }));

    return NextResponse.json({ items, total, page, perPage }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'DB_ERROR', message: err?.message ?? 'Unknown' },
      { status: 500 }
    );
  }
}
