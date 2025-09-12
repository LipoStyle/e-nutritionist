// app/[lang]/recipes/RadialClient.tsx
'use client';

import { useState } from 'react';
import CircleNav from './CircleNav/CircleNav';
import RecipeGrid from './RecipeGrid/RecipeGrid';

export default function RadialClient({
  language,
  initialCategory,
  bgByCategory,
}: {
  language: 'en' | 'es' | 'el';
  initialCategory: string;
  bgByCategory: Record<string, string>;
}) {
  const [category, setCategory] = useState<string>(initialCategory);

  return (
    <div style={{ minHeight: '80vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
      <CircleNav
        language={language}
        radius={160}
        startDeg={-90}
        sweepDeg={360}
        onCategorySelect={(cat) => setCategory(cat)}
        backgroundForCategory={bgByCategory}
        centerImageForCategory={bgByCategory}
        selectedCategory={category}
      />
      <RecipeGrid language={language} category={category} />
    </div>
  );
}
