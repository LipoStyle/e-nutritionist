import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ServicePlanUpsertSchema } from '@/lib/validators/servicePlan';
import { requireAdmin } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

export const runtime = 'nodejs'; // optional
export const dynamic = 'force-dynamic'; // avoid caching in dev

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);
}

function serializeAdmin(plan: any) {
  return {
    id: plan.id,
    slug: plan.slug,
    title: plan.title,
    summary: plan.summary ?? null,
    description: plan.description,
    price: plan.priceCents / 100,
    billing_period: plan.billingPeriod ?? null,
    language: plan.language,
    is_active: plan.isActive,
    order: plan.order,
    created_at: plan.createdAt.toISOString(),
    updated_at: plan.updatedAt.toISOString(),
    features: plan.features
      .sort((a: any, b: any) => a.order - b.order)
      .map((f: any) => ({
        id: f.id,
        name: f.name,
        service_plan_id: f.planId,
        created_at: f.createdAt.toISOString(),
        updated_at: f.updatedAt.toISOString(),
      })),
  };
}

// 👇 IMPORTANT: params is a Promise in Next 15 — await it in each handler
type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  await requireAdmin(req);
  const { id } = await ctx.params;

  const plan = await prisma.servicePlan.findUnique({
    where: { id },
    include: { features: true },
  });
  if (!plan) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  return NextResponse.json({ ok: true, item: serializeAdmin(plan) });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  await requireAdmin(req);
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const parsed = ServicePlanUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;

  try {
    const data: Prisma.ServicePlanUpdateInput = {
      language: d.language,
      title: d.title,
      summary: d.summary ?? null,
      description: d.description,
      priceCents: Math.round(d.price * 100),
      billingPeriod: d.billing_period ?? null,
      order: d.order,
      isActive: d.is_active,
    };
    if (typeof d.slug === 'string') {
      data.slug = d.slug.length ? d.slug : slugify(d.title);
    }

    await prisma.servicePlan.update({ where: { id }, data });

    // features: delete missing, upsert existing/new
    const keepIds = new Set((d.features ?? []).filter(f => f.id).map(f => f.id as string));
    await prisma.servicePlanFeature.deleteMany({
      where: { planId: id, NOT: keepIds.size ? { id: { in: Array.from(keepIds) } } : {} },
    });
    for (const [i, f] of (d.features ?? []).entries()) {
      const payload = { name: f.name, order: f.order ?? i + 1 };
      if (f.id) {
        await prisma.servicePlanFeature.update({ where: { id: f.id }, data: payload });
      } else {
        await prisma.servicePlanFeature.create({ data: { planId: id, ...payload } });
      }
    }

    const updated = await prisma.servicePlan.findUnique({
      where: { id },
      include: { features: true },
    });
    if (!updated) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ ok: true, item: serializeAdmin(updated) });
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'Slug must be unique per language.' }, { status: 409 });
    }
    console.error('Update service plan error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  await requireAdmin(req);
  const { id } = await ctx.params;

  try {
    await prisma.servicePlanFeature.deleteMany({ where: { planId: id } });
    await prisma.servicePlan.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    console.error('Delete service plan error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
