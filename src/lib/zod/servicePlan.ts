// src/lib/zod/servicePlan.ts
import { z } from 'zod';

export const LangEnum = z.enum(['en', 'es', 'el']);

const NullishString = z
  .union([z.string(), z.null()])
  .transform(v => (typeof v === 'string' ? v.trim() : v))
  .transform(v => (v === '' ? null : v));

export const ServicePlanFeatureCreate = z.object({
  name: z.string().min(1).max(300),
  order: z.coerce.number().int().min(1),
});

// -------- CREATE: allow omit + empty -> null (result: string|null)
export const ServicePlanCreate = z.object({
  language: LangEnum,
  slug: z.string().min(1).max(190).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(140),
  summary: NullishString.refine(v => v === null || v.length <= 200, 'Max 200 chars'),
  description: z.string().min(1),
  priceCents: z.coerce.number().int().min(0),

  // ⬇️ now optional; if omitted or "", becomes null
  coverImage: NullishString
    .optional()
    .refine(
      v => v === undefined || v === null || /^https?:\/\//i.test(v),
      'Must be a valid http(s) URL or empty'
    )
    .transform(v => v ?? null),

  order: z.coerce.number().int().min(1),
  isActive: z.coerce.boolean(),
  metaTitle: NullishString.refine(v => v === null || v.length <= 70, 'Max 70 chars'),
  metaDescription: NullishString.refine(v => v === null || v.length <= 160, 'Max 160 chars'),
  features: z.array(ServicePlanFeatureCreate).default([]),
}).strict();

// -------- UPDATE: keep "undefined means no change"
export const ServicePlanUpdate = z.object({
  id: z.string().min(1).optional(),
  language: LangEnum.optional(),
  slug: z.string().min(1).max(190).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1).max(140).optional(),
  summary: NullishString.optional().refine(
    v => v === undefined || v === null || v.length <= 200,
    'Max 200 chars'
  ),
  description: z.string().min(1).optional(),
  priceCents: z.coerce.number().int().min(0).optional(),

  // ⬇️ optional; undefined = leave as-is, "" -> null, URL validated if provided
  coverImage: NullishString
    .optional()
    .refine(
      v => v === undefined || v === null || /^https?:\/\//i.test(v),
      'Must be a valid http(s) URL or empty'
    ),

  order: z.coerce.number().int().min(1).optional(),
  isActive: z.coerce.boolean().optional(),
  metaTitle: NullishString.optional().refine(
    v => v === undefined || v === null || v.length <= 70,
    'Max 70 chars'
  ),
  metaDescription: NullishString.optional().refine(
    v => v === undefined || v === null || v.length <= 160,
    'Max 160 chars'
  ),
  features: z.array(ServicePlanFeatureCreate).optional(),
}).strict();
