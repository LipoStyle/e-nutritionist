// src/app/api/admin/service-plans/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ServicePlanUpdate } from '@/lib/zod/servicePlan';
import { verifyAdminToken } from '@/lib/auth';
import type { Lang as PrismaLang } from '@prisma/client';

function jsonError(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...(extra ?? {}) }, { status });
}

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

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<'/api/admin/service-plans/[id]'>
) {
  try {
    await requireAdminOr401();
    const { id } = await ctx.params;

    const item = await prisma.servicePlan.findUnique({
      where: { id },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    if (!item) return jsonError('Not found', 404);
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return jsonError(e?.message || 'Server error', status);
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<'/api/admin/service-plans/[id]'>
) {
  try {
    await requireAdminOr401();
    const { id } = await ctx.params;

    const body = await req.json().catch(() => ({}));
    const input = ServicePlanUpdate.parse({ ...body, id });

    const data: Record<string, unknown> = {
      ...(input.language !== undefined && { language: input.language as unknown as PrismaLang }),
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.summary !== undefined && { summary: input.summary }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.priceCents !== undefined && { priceCents: input.priceCents }),
      ...(input.coverImage !== undefined && { coverImage: input.coverImage }),
      ...(input.order !== undefined && { order: input.order }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.metaTitle !== undefined && { metaTitle: input.metaTitle }),
      ...(input.metaDescription !== undefined && { metaDescription: input.metaDescription }),
    };

    let full;
    if (Array.isArray(input.features)) {
      full = await prisma.$transaction(async (tx) => {
        await tx.servicePlan.update({ where: { id }, data });
        await tx.servicePlanFeature.deleteMany({ where: { planId: id } });
        if (input.features.length) {
          await tx.servicePlanFeature.createMany({
            data: input.features.map((f) => ({
              planId: id,
              name: f.name,
              order: f.order ?? 1,
            })),
          });
        }
        return tx.servicePlan.findUnique({
          where: { id },
          include: { features: { orderBy: { order: 'asc' } } },
        });
      });
    } else {
      full = await prisma.servicePlan.update({
        where: { id },
        data,
        include: { features: { orderBy: { order: 'asc' } } },
      });
    }

    return NextResponse.json({ ok: true, item: full });
  } catch (e: any) {
    const status = e?.status ?? (e?.name === 'ZodError' ? 422 : 500);
    return NextResponse.json(
      { ok: false, error: e?.message || 'Update failed', issues: e?.issues },
      { status }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<'/api/admin/service-plans/[id]'>
) {
  try {
    await requireAdminOr401();
    const { id } = await ctx.params;

    try {
      await prisma.servicePlan.delete({ where: { id } });
    } catch (e: any) {
      if (e?.code === 'P2025') return jsonError('Not found', 404);
      throw e;
    }

    return new Response(null, { status: 204 });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return jsonError(e?.message || 'Delete failed', status);
  }
}
