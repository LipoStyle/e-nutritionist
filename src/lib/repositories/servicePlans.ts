// src/lib/repositories/servicePlans.ts
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

export type ListFilters = {
  language?: 'en' | 'es' | 'el';
  active?: boolean;
  q?: string;
  page: number;
  perPage: number;
};

export async function listServicePlans(filters: ListFilters) {
  const { language, active, q, page, perPage } = filters;

  const where: Prisma.ServicePlanWhereInput = {
    ...(language ? { language } : {}),
    ...(active != null ? { isActive: active } : {}),
    ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
  };

  const [total, items] = await Promise.all([
    prisma.servicePlan.count({ where }),
    prisma.servicePlan.findMany({
      where,
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
      include: { features: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return { total, items };
}

export async function getServicePlanById(id: string) {
  return prisma.servicePlan.findUnique({
    where: { id },
    include: { features: true },
  });
}

export type UpsertInput = {
  language: 'en' | 'es' | 'el';
  slug: string;
  title: string;
  summary: string | null;
  description: string;
  priceCents: number;
  billingPeriod: string | null;
  order: number;
  isActive: boolean;
  features: Array<{ id?: string; name: string; order?: number }>;
};

export async function createServicePlan(input: UpsertInput) {
  return prisma.servicePlan.create({
    data: {
      language: input.language,
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      description: input.description,
      priceCents: input.priceCents,
      billingPeriod: input.billingPeriod,
      order: input.order,
      isActive: input.isActive,
      features: {
        createMany: {
          data: input.features?.map((f) => ({
            name: f.name,
            order: f.order ?? 1,
          })) ?? [],
        },
      },
    },
    include: { features: true },
  });
}

export async function updateServicePlan(id: string, input: UpsertInput) {
  return prisma.$transaction(async (tx) => {
    // Update main record
    await tx.servicePlan.update({
      where: { id },
      data: {
        language: input.language,
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        description: input.description,
        priceCents: input.priceCents,
        billingPeriod: input.billingPeriod,
        order: input.order,
        isActive: input.isActive,
      },
    });

    const keepIds = new Set(input.features.filter(f => f.id).map(f => f.id!));

    // Delete removed features
    await tx.servicePlanFeature.deleteMany({
      where: { planId: id, NOT: { id: { in: keepIds.size ? Array.from(keepIds) : ['__none__'] } } },
    });

    // Upsert features
    for (const f of input.features) {
      if (f.id) {
        await tx.servicePlanFeature.update({
          where: { id: f.id },
          data: { name: f.name, order: f.order ?? 1 },
        });
      } else {
        await tx.servicePlanFeature.create({
          data: { planId: id, name: f.name, order: f.order ?? 1 },
        });
      }
    }

    return tx.servicePlan.findUnique({ where: { id }, include: { features: true } });
  });
}

export async function deleteServicePlan(id: string) {
  // Features will cascade if you set onDelete: Cascade in your schema
  await prisma.servicePlan.delete({ where: { id } });
}
