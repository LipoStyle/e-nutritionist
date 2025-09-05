// app/(demo)/recipes-radial/page.tsx
"use client";

import { useMemo, useState } from "react";
import CircleNav from "@/app/[lang]/recipes/CircleNav/CircleNav";
import RecipeGrid from "@/app/[lang]/recipes/RecipeGrid/RecipeGrid";
import { recipesData } from "@/app/[lang]/recipes/CircleNav/recipesData";

export default function Page() {
  const language = "en" as const;

  // First category from data (falls back to "Breakfast")
  const firstCategory = useMemo(() => {
    const first = recipesData.find((r) => r.language === language);
    return first?.category ?? "Breakfast";
  }, [language]);

  const [category, setCategory] = useState<string>(firstCategory);

  // 🔑 Use EXACT keys that appear in recipesData.category
  const bgByCategory: Record<string, string> = {
    Breakfast: "/assets/recipes/categories/breakfast.jpg",
    Lunch: "/assets/recipes/categories/launch.jpg",
    Snack: "/assets/recipes/categories/snak.jpg",
    Dessert: "/assets/recipes/categories/dessert.jpg",
    // Dinner: "/assets/recipes/categories/dinner.jpg", // add if your data has "Dinner"
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <CircleNav
        language={language}
        radius={160}
        startDeg={-90}
        sweepDeg={360}
        onCategorySelect={(cat) => setCategory(cat)}
        /* ⬇ hero background changes with category */
        backgroundForCategory={bgByCategory}
        /* ⬇ center plate image matches the background exactly */
        centerImageForCategory={bgByCategory}
        selectedCategory={category}
      />

      <RecipeGrid language={language} category={category} />
    </div>
  );
}
