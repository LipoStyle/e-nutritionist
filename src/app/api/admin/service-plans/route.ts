export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { ServicePlanCreate } from '@/lib/zod/servicePlan';
import { verifyAdminToken } from '@/lib/auth';

function jsonError(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...(extra ?? {}) }, { status });
}

async function requireAdminOr401() {
  const token = cookies().get('admin_token')?.value;
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  await verifyAdminToken(token); // throws {status:401} if invalid/expired
}

export async function GET() {
  try {
    await requireAdminOr401();

    const items = await prisma.servicePlan.findMany({
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      include: { features: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return jsonError(e.message || 'Server error', e.status ?? 500);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminOr401();
    const body = await req.json();

    // Accept features as either array or newline string
    if (typeof body.featuresText === 'string' && (!Array.isArray(body.features) || body.features.length === 0)) {
      body.features = body.featuresText
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .map((name: string, idx: number) => ({ name, order: idx + 1 }));
    }

    const input = ServicePlanCreate.parse(body);

    const created = await prisma.servicePlan.create({
      data: {
        ...input,
        features: input.features.length
          ? { create: input.features.map((f) => ({ name: f.name, order: f.order })) }
          : undefined,
      },
      include: { features: { orderBy: { order: 'asc' } } },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e: any) {
    const status = e.status ?? (e.name === 'ZodError' ? 422 : 500);
    return jsonError(e.message || 'Invalid request', status, { issues: e.issues });
  }
}
