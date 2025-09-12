import { prisma } from '@/lib/prisma';

export type Lang = 'en' | 'es' | 'el';

export async function getRecipeBySlug(lang: Lang, slug: string) {
  return prisma.recipe.findFirst({
    where: { language: lang, slug },
    include: {
      ingredients: true,
      instructions: { orderBy: { stepNumber: 'asc' } },
      valuableInfo: true,
      nutritionalFacts: true,
      metaInfo: true,
    },
  });
}

export async function getRecipesList(
  lang: Lang,
  opts: { q?: string; category?: string; take?: number; skip?: number } = {}
) {
  const { q, category, take = 12, skip = 0 } = opts;
  const where = {
    AND: [
      { language: lang },
      q ? { title: { contains: q, mode: 'insensitive' as const } } : {},
      category ? { category } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { publishedDate: 'desc' },
      take,
      skip,
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        category: true,
        imageUrl: true,
        publishedDate: true,
      },
    }),
    prisma.recipe.count({ where }),
  ]);

  return { items, total };
}
