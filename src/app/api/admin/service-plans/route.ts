// src/app/api/admin/service-plans/route.ts
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ServicePlanCreate } from '@/lib/zod/servicePlan';
import { verifyAdminToken } from '@/lib/auth';
import type { Lang } from '@prisma/client';

async function requireAdminOr401() {
  try {
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('admin_token')?.value;

    const auth = (await headers()).get('authorization') || '';
    const tokenFromHeader = auth.toLowerCase().startsWith('bearer ')
      ? auth.slice(7).trim()
      : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      const err = new Error('Unauthorized'); (err as any).status = 401; throw err;
    }
    await verifyAdminToken(token);
  } catch {
    const err = new Error('Unauthorized'); (err as any).status = 401; throw err;
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminOr401();

    const raw = await req.json();
    if (typeof raw.language === 'string') raw.language = raw.language.toLowerCase();

    const input = ServicePlanCreate.parse(raw);

    const created = await prisma.servicePlan.create({
      data: {
        language: (input.language as unknown) as Lang,
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        description: input.description,
        priceCents: input.priceCents,
        coverImage: input.coverImage,
        order: input.order,
        isActive: input.isActive,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        features: input.features.length
          ? { create: input.features.map((f) => ({ name: f.name, order: f.order })) }
          : undefined,
      },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    const status = e?.status === 401 ? 401 : (e?.name === 'ZodError' ? 422 : 500);
    return NextResponse.json({ ok: false, error: e?.message, issues: e?.issues }, { status });
  }
}
