export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ServicePlanUpdate } from '@/lib/zod/servicePlan';
import { verifyAdminToken } from '@/lib/auth';

type Params = { params: { id: string } };

function jsonError(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...(extra ?? {}) }, { status });
}

async function requireAdminOr401() {
  const token = cookies().get('admin_token')?.value;
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  await verifyAdminToken(token); // throws {status:401} if invalid/expired
}

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAdminOr401();

    const item = await prisma.servicePlan.findUnique({
      where: { id: params.id },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    if (!item) return jsonError('Not found', 404);
    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return jsonError(e.message || 'Server error', e.status ?? 500);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdminOr401();
    const body = await req.json();
    const input = ServicePlanUpdate.parse({ ...body, id: params.id });

    // Update main fields (only set keys when provided to avoid nulling unintentionally)
    await prisma.servicePlan.update({
      where: { id: params.id },
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
      await prisma.servicePlanFeature.deleteMany({ where: { planId: params.id } });
      if (input.features.length) {
        await prisma.servicePlanFeature.createMany({
          data: input.features.map((f) => ({
            planId: params.id,
            name: f.name,
            order: f.order ?? 1,
          })),
        });
      }
    }

    const full = await prisma.servicePlan.findUnique({
      where: { id: params.id },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ ok: true, item: full });
  } catch (e: any) {
    const status = e.status ?? (e.name === 'ZodError' ? 422 : 500);
    return jsonError(e.message || 'Update failed', status, { issues: e.issues });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdminOr401();
    await prisma.servicePlan.delete({ where: { id: params.id } });
    // 204 responses should not include a body; we still return ok:true for convenience if consumers read it.
    return NextResponse.json({ ok: true }, { status: 204 });
  } catch (e: any) {
    return jsonError(e.message || 'Delete failed', e.status ?? 500);
  }
}
