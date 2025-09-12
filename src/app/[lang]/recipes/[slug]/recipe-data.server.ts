import { prisma } from '@/lib/prisma';

export type Lang = 'en' | 'es' | 'el';

export async function getRecipeBySlug(lang: Lang, slug: string) {
  const r = await prisma.recipe.findFirst({
    where: { language: lang, slug },
    include: {
      ingredients: true,
      instructions: { orderBy: { stepNumber: 'asc' } },
      valuableInfo: true,
      nutritionalFacts: true,
      metaInfo: true,
    },
  });
  if (!r) return null;

  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    language: r.language,
    category: r.category,
    short_description: r.shortDescription ?? null,
    description: r.description ?? null,
    image_url: r.imageUrl ?? null,
    published_date: r.publishedDate ? r.publishedDate.toISOString() : null,
    ingredients: r.ingredients.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, size: i.size })),
    instructions: r.instructions.map(s => ({ id: s.id, step_number: s.stepNumber, step_content: s.stepContent })),
    valuable_info: r.valuableInfo
      ? { duration: r.valuableInfo.duration, difficulty: r.valuableInfo.difficulty, portions: r.valuableInfo.portions }
      : null,
    nutritional_facts: r.nutritionalFacts.map(n => ({ id: n.id, name: n.name, quantity: n.quantity, size: n.size })),
    meta_info: r.metaInfo
      ? { meta_title: r.metaInfo.metaTitle ?? null, meta_description: r.metaInfo.metaDescription ?? null, meta_keywords: r.metaInfo.metaKeywords ?? null }
      : null,
  };
}
