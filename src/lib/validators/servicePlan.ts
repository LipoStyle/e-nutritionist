import { z } from 'zod';

export const LangEnum = z.enum(['en', 'es', 'el']);

export const ServicePlanFeatureInput = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  order: z.number().int().min(0).default(1),
});

// 👇 slug is optional (no min). We’ll generate/keep it server-side.
export const ServicePlanUpsertSchema = z.object({
  language: LangEnum,
  slug: z.string().trim().max(64).optional(),
  title: z.string().min(1),
  summary: z.string().max(200).optional().nullable(),
  description: z.string().min(1),
  price: z.number().nonnegative(),              // euros
  billing_period: z.string().max(40).optional().nullable(),
  order: z.number().int().min(0).default(1),
  is_active: z.boolean().default(true),
  features: z.array(ServicePlanFeatureInput).default([]),
});
