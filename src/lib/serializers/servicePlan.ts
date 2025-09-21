import type { ServicePlan, ServicePlanFeature } from '@prisma/client';

type WithFeatures = ServicePlan & { features: ServicePlanFeature[] };

export function serializeServicePlan(plan: WithFeatures) {
  // Public-ish shape (euros as number, ISO dates, ordered features)
  return {
    id: plan.id,
    slug: plan.slug,
    title: plan.title,
    summary: plan.summary ?? null,
    price: plan.priceCents / 100,                 // euros
    billing_period: plan.billingPeriod ?? null,
    description: plan.description,
    language: plan.language,
    order: plan.order,
    created_at: plan.createdAt.toISOString(),
    updated_at: plan.updatedAt.toISOString(),
    features: plan.features
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((f) => ({
        id: f.id,
        name: f.name,
        service_plan_id: f.planId,
        created_at: f.createdAt.toISOString(),
        updated_at: f.updatedAt.toISOString(),
      })),
  };
}

export function serializeServicePlanAdmin(plan: WithFeatures) {
  // Admin shape (same as above + is_active)
  const base = serializeServicePlan(plan);
  return {
    ...base,
    is_active: plan.isActive,
  };
}
