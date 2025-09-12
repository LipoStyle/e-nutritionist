// Admin Recipes → Read + Update + Delete
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

const j = (status: number, body: unknown) => NextResponse.json(body, { status });
const unauth = () => j(401, { error: 'UNAUTHENTICATED' });

type Params = { params: { id: string } };
const normDiff = (v: any): 'easy' | 'medium' | 'hard' =>
  (['easy','medium','hard'].includes(String(v).toLowerCase()) ? (String(v).toLowerCase() as any) : 'easy');

export async function GET(_req: Request, { params }: Params) {
  const cookieStore = await cookies(); // ✅
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return unauth();
  try { await verifyAdminToken(token); } catch { return unauth(); }

  try {
    const r = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: {
        ingredients: true,
        instructions: { orderBy: { stepNumber: 'asc' } },
        valuableInfo: true,
        nutritionalFacts: true,
        metaInfo: true,
      },
    });
    if (!r) return j(404, { error: 'NOT_FOUND' });

    return j(200, {
      id: r.id,
      title: r.title,
      slug: r.slug,
      language: r.language,
      category: r.category,
      short_description: r.shortDescription,
      description: r.description,
      image_url: r.imageUrl,
      published_date: r.publishedDate,
      ingredients: r.ingredients.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, size: i.size })),
      instructions: r.instructions.map(s => ({ id: s.id, step_number: s.stepNumber, step_content: s.stepContent })),
      valuable_info: r.valuableInfo
        ? { duration: r.valuableInfo.duration, difficulty: r.valuableInfo.difficulty, portions: r.valuableInfo.portions }
        : null,
      nutritional_facts: r.nutritionalFacts.map(n => ({ id: n.id, name: n.name, quantity: n.quantity, size: n.size })),
      meta_info: r.metaInfo
        ? { meta_title: r.metaInfo.metaTitle, meta_description: r.metaInfo.metaDescription, meta_keywords: r.metaInfo.metaKeywords }
        : null,
    });
  } catch (err: any) {
    console.error('RECIPE_READ_ERROR', err);
    return j(500, { error: 'DB_ERROR', message: err?.message || 'Unknown database error' });
  }
}

export async function PUT(req: Request, { params }: Params) {
  const cookieStore = await cookies(); // ✅
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return unauth();
  try { await verifyAdminToken(token); } catch { return unauth(); }

  let body: any;
  try { body = await req.json(); } catch { return j(400, { error: 'INVALID_JSON' }); }

  try {
    const updated = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        title: body.title ?? undefined,
        slug: body.slug ?? undefined,
        language: body.language ?? undefined,
        category: body.category ?? undefined,
        shortDescription: body.short_description ?? undefined,
        description: body.description ?? undefined,
        imageUrl: body.image_url ?? undefined,
        publishedDate: body.published_date ? new Date(body.published_date) : undefined,

        ingredients: Array.isArray(body.ingredients)
          ? { deleteMany: {}, create: body.ingredients.map((i: any) => ({
              name: i.name, quantity: Number(i.quantity) || 0, size: i.size ?? '-',
            })) }
          : undefined,

        instructions: Array.isArray(body.instructions)
          ? { deleteMany: {}, create: body.instructions.map((s: any, idx: number) => ({
              stepNumber: Number(s.step_number ?? idx + 1), stepContent: s.step_content,
            })) }
          : undefined,

        nutritionalFacts: Array.isArray(body.nutritional_facts)
          ? { deleteMany: {}, create: body.nutritional_facts.map((n: any) => ({
              name: n.name, quantity: Number(n.quantity) || 0, size: n.size ?? '-',
            })) }
          : undefined,

        valuableInfo: body.valuable_info
          ? {
              upsert: {
                create: {
                  duration: String(body.valuable_info.duration ?? '0'),
                  difficulty: normDiff(body.valuable_info.difficulty),
                  portions: Number(body.valuable_info.portions) || 1,
                },
                update: {
                  duration: String(body.valuable_info.duration ?? '0'),
                  difficulty: normDiff(body.valuable_info.difficulty),
                  portions: Number(body.valuable_info.portions) || 1,
                },
              },
            }
          : undefined,

        metaInfo: body.meta_info
          ? {
              upsert: {
                create: {
                  metaTitle: body.meta_info.meta_title ?? null,
                  metaDescription: body.meta_info.meta_description ?? null,
                  metaKeywords: body.meta_info.meta_keywords ?? null,
                },
                update: {
                  metaTitle: body.meta_info.meta_title ?? null,
                  metaDescription: body.meta_info.meta_description ?? null,
                  metaKeywords: body.meta_info.meta_keywords ?? null,
                },
              },
            }
          : undefined,
      },
      select: { id: true },
    });

    return j(200, { id: updated.id });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return j(409, { error: 'UNIQUE_CONSTRAINT', message: 'A recipe with this language & slug already exists.' });
    }
    console.error('RECIPE_UPDATE_ERROR', err);
    return j(500, { error: 'DB_ERROR', message: err?.message || 'Unknown database error' });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const cookieStore = await cookies(); // ✅
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return unauth();
  try { await verifyAdminToken(token); } catch { return unauth(); }

  try {
    await prisma.recipe.delete({ where: { id: params.id } });
    return j(200, { ok: true });
  } catch (err: any) {
    console.error('RECIPE_DELETE_ERROR', err);
    return j(500, { error: 'DB_ERROR', message: err?.message || 'Unknown database error' });
  }
}
