// src/app/api/admin/service-plans/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { cookies as nextCookies, headers as nextHeaders } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ServicePlanUpdate } from '@/lib/zod/servicePlan';
import { verifyAdminToken } from '@/lib/auth';

function jsonError(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...(extra ?? {}) }, { status });
}

async function requireAdminOr401() {
  // Use `await` to satisfy environments where these are async
  const cookieStore = await nextCookies();
  const tokenFromCookie = cookieStore.get('admin_token')?.value ?? null;

  const hdrs = await nextHeaders();
  const auth = hdrs.get('authorization') || '';
  const tokenFromHeader = auth.toLowerCase().startsWith('bearer ')
    ? auth.slice(7).trim()
    : null;

  const token = tokenFromCookie || tokenFromHeader;
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 });

  await verifyAdminToken(token);
}

// Leave `context` untyped for Vercel’s strict validator.
export async function GET(_req: NextRequest, context: any) {
  try {
    await requireAdminOr401();
    const { id } = await (context?.params ?? {});

    const item = await prisma.servicePlan.findUnique({
      where: { id },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    if (!item) return jsonError('Not found', 404);
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return jsonError(e?.message || 'Server error', e?.status ?? 500);
  }
}

export async function PATCH(req: NextRequest, context: any) {
  try {
    await requireAdminOr401();
    const { id } = await (context?.params ?? {});

    const body = await req.json().catch(() => ({}));
    const input = ServicePlanUpdate.parse({ ...body, id });

    // Only set provided fields
    await prisma.servicePlan.update({
      where: { id },
      data: {
        ...(input.language !== undefined && { language: input.language }),
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
      },
    });

    // Replace features if provided
    if (Array.isArray(input.features)) {
      await prisma.servicePlanFeature.deleteMany({ where: { planId: id } });
      if (input.features.length) {
        await prisma.servicePlanFeature.createMany({
          data: input.features.map((f) => ({
            planId: id,
            name: f.name,
            order: f.order ?? 1,
          })),
        });
      }
    }

    const full = await prisma.servicePlan.findUnique({
      where: { id },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ ok: true, item: full });
  } catch (e: any) {
    const status = e?.status ?? (e?.name === 'ZodError' ? 422 : 500);
    return jsonError(e?.message || 'Update failed', status, { issues: e?.issues });
  }
}

export async function DELETE(_req: NextRequest, context: any) {
  try {
    await requireAdminOr401();
    const { id } = await (context?.params ?? {});

    await prisma.servicePlan.delete({ where: { id } });
    return new Response(null, { status: 204 }); // no body for 204
  } catch (e: any) {
    return jsonError(e?.message || 'Delete failed', e?.status ?? 500);
  }
}
