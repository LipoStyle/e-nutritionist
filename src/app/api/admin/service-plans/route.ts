// src/app/api/admin/service-plans/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { ServicePlanUpsertSchema } from '@/lib/validators/servicePlan';
import { serializeServicePlanAdmin } from '@/lib/serializers/servicePlan';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64);
}

export async function POST(req: NextRequest) {
  await requireAdmin(req);

  const body = await req.json().catch(() => ({}));
  const parsed = ServicePlanUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;

  try {
    // Normalize/trim
    const title = d.title.trim();
    const summary = d.summary?.trim() ?? null;
    const description = d.description.trim();
    const billingPeriod = d.billing_period?.trim() ?? null;
    const slug = d.slug?.trim() ? d.slug.trim() : slugify(title);

    const featuresData = (d.features ?? [])
      .map((f, i) => ({
        name: f.name.trim(),
        order: f.order ?? i + 1,
      }))
      .filter((f) => f.name.length > 0);

    const created = await prisma.servicePlan.create({
      data: {
        language: d.language,
        slug,
        title,
        summary,
        description,
        priceCents: Math.round(d.price * 100),
        billingPeriod,
        order: d.order,
        isActive: d.is_active,
        ...(featuresData.length
          ? { features: { createMany: { data: featuresData } } }
          : {}),
      },
      include: { features: true },
    });

    return NextResponse.json(
      { ok: true, item: serializeServicePlanAdmin(created) },
      { status: 201, headers: { Location: `/admin/service-plans/${created.id}` } }
    );
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // unique([language, slug])
      return NextResponse.json(
        { ok: false, error: 'Slug must be unique per language.' },
        { status: 409 }
      );
    }
    console.error('Create service plan error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
