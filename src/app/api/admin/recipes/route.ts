// src/app/api/admin/recipes/route.ts
// Admin Recipes → List + Create
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

const j = (status: number, body: unknown) => NextResponse.json(body, { status });
const unauth = () => j(401, { error: 'UNAUTHENTICATED' });

type Lang = 'en' | 'es' | 'el';
const normDiff = (v: any): 'easy' | 'medium' | 'hard' =>
  (['easy', 'medium', 'hard'].includes(String(v).toLowerCase())
    ? (String(v).toLowerCase() as any)
    : 'easy');

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return unauth();
  try { await verifyAdminToken(token); } catch { return unauth(); }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? undefined;
  const language = (searchParams.get('language') ?? undefined) as Lang | undefined;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get('perPage') ?? 12)));
  const skip = (page - 1) * perPage;

  const where = {
    AND: [
      q ? { title: { contains: q, mode: 'insensitive' as const } } : {},
      category ? { category } : {},
      language ? { language } : {},
    ],
  };

  try {
    const [rowsRaw, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { publishedDate: 'desc' },
        include: { valuableInfo: true },
      }),
      prisma.recipe.count({ where }),
    ]);

    // Defensive guard (filter out any unexpected undefined/null entries)
    const rows = Array.isArray(rowsRaw) ? rowsRaw.filter(Boolean) : [];

    let items;
    try {
      items = rows.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        language: r.language,
        category: r.category,
        short_description: r.shortDescription ?? null,
        image_url: r.imageUrl ?? null,
        published_date: r.publishedDate,
        valuable_info: r.valuableInfo
          ? {
              duration: r.valuableInfo.duration,
              difficulty: r.valuableInfo.difficulty,
              portions: r.valuableInfo.portions,
            }
          : null,
      }));
    } catch (mapErr: any) {
      console.error('RECIPES_LIST_MAP_ERROR rows snapshot:', JSON.stringify(rowsRaw, null, 2));
      throw mapErr;
    }

    return j(200, { items, total, page, perPage });
  } catch (err: any) {
    console.error('RECIPES_LIST_ERROR', err);
    return j(500, { error: 'DB_ERROR', message: err?.message || 'Unknown database error' });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return unauth();
  try { await verifyAdminToken(token); } catch { return unauth(); }

  let body: any;
  try { body = await req.json(); } catch { return j(400, { error: 'INVALID_JSON' }); }

  for (const key of ['title', 'slug', 'language', 'category']) {
    if (!body?.[key]) return j(422, { error: `Missing field: ${key}` });
  }

  try {
    const created = await prisma.recipe.create({
      data: {
        title: body.title,
        slug: body.slug,
        language: body.language as Lang,
        category: body.category,
        shortDescription: body.short_description ?? null,
        description: body.description ?? null,
        imageUrl: body.image_url ?? null,
        publishedDate: body.published_date ? new Date(body.published_date) : new Date(),

        ingredients: Array.isArray(body.ingredients) && body.ingredients.length
          ? {
              create: body.ingredients.map((i: any) => ({
                name: i.name,
                quantity: Number(i.quantity) || 0,
                size: i.size ?? '-',
              })),
            }
          : undefined,

        instructions: Array.isArray(body.instructions) && body.instructions.length
          ? {
              create: body.instructions.map((s: any, idx: number) => ({
                stepNumber: Number(s.step_number ?? idx + 1),
                stepContent: s.step_content,
              })),
            }
          : undefined,

        valuableInfo: body.valuable_info
          ? {
              create: {
                duration: String(body.valuable_info.duration ?? '0'),
                difficulty: normDiff(body.valuable_info.difficulty),
                portions: Number(body.valuable_info.portions) || 1,
              },
            }
          : undefined,

        nutritionalFacts: Array.isArray(body.nutritional_facts) && body.nutritional_facts.length
          ? {
              create: body.nutritional_facts.map((n: any) => ({
                name: n.name,
                quantity: Number(n.quantity) || 0,
                size: n.size ?? '-',
              })),
            }
          : undefined,

        metaInfo: body.meta_info
          ? {
              create: {
                metaTitle: body.meta_info.meta_title ?? null,
                metaDescription: body.meta_info.meta_description ?? null,
                metaKeywords: body.meta_info.meta_keywords ?? null,
              },
            }
          : undefined,
      },
      select: { id: true },
    });

    return j(201, created);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return j(409, { error: 'UNIQUE_CONSTRAINT', message: 'A recipe with this language & slug already exists.' });
    }
    console.error('RECIPES_CREATE_ERROR', err);
    return j(500, { error: 'DB_ERROR', message: err?.message || 'Unknown database error' });
  }
}
