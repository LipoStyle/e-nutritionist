// app/[lang]/recipes/page.tsx
import { prisma } from '@/lib/prisma';
import RadialClient from './RadialClient';

export const dynamic = 'force-dynamic';

type Lang = 'en' | 'es' | 'el';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang: language } = await params; // await params

  const rows = await prisma.recipe.findMany({
    where: { language }, // <- removed `{ category: { not: null } }`
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });

  const categories = rows.map(r => r.category).filter(Boolean);
  const initialCategory = categories[0] ?? 'Breakfast';

  const bgByCategory: Record<string, string> = {
    Breakfast: '/assets/recipes/categories/breakfast.jpg',
    Lunch: '/assets/recipes/categories/lunch.jpg',
    Snack: '/assets/recipes/categories/snack.jpg',
    Dessert: '/assets/recipes/categories/dessert.jpg',
  };

  return (
    <RadialClient
      language={language}
      initialCategory={initialCategory}
      bgByCategory={bgByCategory}
    />
  );
}
