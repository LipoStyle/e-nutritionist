// Keep this file .ts (not .tsx)

export type LangCode = "en" | "es" | "el";

export type Ingredient = {
  id: number;
  name: string;
  quantity?: number | string;
  size?: string | null;
};

export type Instruction = {
  id: number;
  step_number: number;
  step_content: string;
};

export type ValuableInfo = {
  duration?: string | number;
  difficulty?: string;
  portions?: number;
};

export type MetaInfo = {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
};

export type NutritionalFact = {
  id: number;
  name: string;
  quantity: number;
  size?: string | null;
};

export type Recipe = {
  id: number;
  title: string;
  description?: string | null;
  category: string;
  slug: string;             // original slug as provided
  language: LangCode;
  image_url?: string | null;
  image?: string | null;    // optional local fallback
  ingredients?: Ingredient[];
  instructions?: Instruction[];
  valuable_info?: ValuableInfo;
  meta_info?: MetaInfo;
  nutritional_facts?: NutritionalFact[];
  published_date?: string;
};

/**
 * Single-recipe seed for UI testing.
 * NOTE:
 * - Links in the grid/detail use a normalized slug (lowercased + dashed).
 * - Components are written to read r.image_url || r.image.
 */
export const recipesData: Recipe[] = [
  {
    id: 105,
    title: "Sweet Potato & Veggie Hash with Eggs",
    description:
      "Kickstart your day with a savory sweet potato and veggie hash topped with perfectly fried eggs—packed with protein, fiber, vitamins A & C, and iron. Ready in 20 minutes!",
    category: "Breakfast",
    slug: "Sweet-Potato-Veggie-Hash",
    language: "en",
    image_url:
      "https://e-nutritionist-backend-0404ce3393a8.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTM5LCJwdXIiOiJibG9iX2lkIn19--0065944e4054d4cd7e0a0c7db2c03f15659aa2d4/PXL_20250506_101603332.MP~2.jpg",

    ingredients: [
      { id: 141, name: "Sweet Potatoes", quantity: 2, size: "Medium" },
      { id: 142, name: "Onion", quantity: 1, size: "Large" },
      { id: 143, name: "Olive Oil", quantity: 1, size: "Tbsp" },
      { id: 144, name: "Red Bell Pepper", quantity: 1, size: "Medium" },
      { id: 145, name: "Spinach", quantity: 2, size: "cups" },
      { id: 146, name: "Salt", quantity: 1, size: "Pinch" },
      { id: 147, name: "Pepper", quantity: 1, size: "pinch" },
      { id: 148, name: "Eggs", quantity: 4, size: "Medium" },
    ],

    instructions: [
      { id: 129, step_number: 1, step_content: "Peel and dice sweet potatoes and onions into 1 cm pieces." },
      { id: 130, step_number: 2, step_content: "Heat a large skillet over medium heat, then add olive oil." },
      { id: 131, step_number: 3, step_content: "Add diced sweet potatoes (and onion, if using) to the hot skillet." },
      { id: 132, step_number: 4, step_content: "Season lightly with salt and pepper." },
      { id: 133, step_number: 5, step_content: "Sauté, stirring occasionally, for 8–10 minutes until tender and lightly golden." },
      { id: 134, step_number: 6, step_content: "Stir in diced bell pepper; cook 2–3 minutes until slightly softened" },
      { id: 135, step_number: 7, step_content: "Add chopped spinach; cook 1–2 minutes until wilted." },
      { id: 136, step_number: 8, step_content: "Season again to taste (you can add smoked paprika or chili flakes here)." },
      { id: 137, step_number: 9, step_content: "Make 4 wells and put in the eggs. Fry them." },
      { id: 138, step_number: 10, step_content: "Serve immediately." },
    ],

    valuable_info: {
      duration: "30",
      difficulty: "Easy",
      portions: 2,
    },

    meta_info: {
      meta_title:
        "Sweet Potato & Veggie Hash with Eggs | Hearty High-Protein Breakfast",
      meta_description:
        "Kickstart your day with a savory sweet potato and veggie hash topped with perfectly fried eggs—packed with protein, fiber, vitamins A & C, and iron. Ready in 20 minutes!",
      meta_keywords:
        "sweet potato hash, veggie breakfast, eggs and sweet potatoes, high-protein breakfast, healthy morning recipe, fiber-rich meal, iron-rich breakfast, vitamin A recipe, quick breakfast ideas, meal prep hash",
    },

    nutritional_facts: [
      { id: 107, name: "Protein", quantity: 16, size: "g" },
      { id: 108, name: "Fat", quantity: 17.9, size: "g" },
      { id: 109, name: "Carbs", quantity: 38, size: "g" },
      { id: 110, name: "Saturated Fat", quantity: 4.3, size: "g" },
      { id: 111, name: "Fiber", quantity: 6.2, size: "g" },
      { id: 112, name: "Vitamin A", quantity: 4.8, size: "mg" },
      { id: 113, name: "Vitamin C", quantity: 69, size: "mg" },
      { id: 114, name: "Iron", quantity: 2.9, size: "mg" },
    ],

    published_date: "2025-05-25T00:00:00.000Z",
  },
];

/**
 * Optional helpers you can import where needed
 * (e.g., for the hero background / center image in CircleNav)
 */
export const CATEGORY_BG: Record<string, string> = {
  Breakfast: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop",
};

export const CATEGORY_CENTER_IMG: Record<string, string> = {
  Breakfast:
    "https://e-nutritionist-backend-0404ce3393a8.herokuapp.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTM5LCJwdXIiOiJibG9iX2lkIn19--0065944e4054d4cd7e0a0c7db2c03f15659aa2d4/PXL_20250506_101603332.MP~2.jpg",
};
