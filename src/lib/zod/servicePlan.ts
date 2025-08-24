import { z } from 'zod';

export const LangEnum = z.enum(['en','es','el']);

export const FeatureInput = z.object({
  id: z.string().optional(), // not used on create; optional for future
  name: z.string().min(2).max(300),
  order: z.number().int().min(1).default(1),
});

export const ServicePlanCreate = z.object({
  language: LangEnum,
  slug: z.string().min(2).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2).max(140),
  summary: z.string().max(200).optional().nullable(),
  description: z.string().min(10),
  priceCents: z.number().int().nonnegative(),
  coverImage: z.string().url().optional().nullable(),
  order: z.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  features: z.array(FeatureInput).default([]),
});

export const ServicePlanUpdate = ServicePlanCreate.partial().extend({
  id: z.string().min(1),
});
