// app/data/recipesData.ts

export type LangCode = "en" | "es" | "el";

export type Recipe = {
  id: number;
  title: string;
  description: string;
  category: string;
  slug: string;
  image: string;
  language: LangCode;
};

export const recipesData: Recipe[] = [
  {
    id: 101,
    title: "Avocado Toast with Poached Egg",
    description: `A nutritious breakfast option featuring whole grain bread topped with creamy avocado, poached egg, and a sprinkle of chili flakes. Rich in healthy fats, protein, and fiber, it supports heart health and satiety.`,
    category: "Breakfast",
    slug: "avocado-toast-poached-egg",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 102,
    title: "Berry Yogurt Parfait",
    description: `Layers of Greek yogurt, fresh berries, and granola create a delicious parfait packed with probiotics, antioxidants, calcium, and protein. Great for digestion and sustained energy.`,
    category: "Breakfast",
    slug: "berry-yogurt-parfait",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 103,
    title: "Quinoa Veggie Bowl",
    description: `A wholesome bowl of quinoa, roasted vegetables, and a tahini drizzle. High in plant-based protein, fiber, and essential minerals like magnesium and iron.`,
    category: "Lunch",
    slug: "quinoa-veggie-bowl",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 104,
    title: "Grilled Chicken Salad",
    description: `Lean grilled chicken breast served over mixed greens, cucumbers, tomatoes, and a light vinaigrette. Provides lean protein, vitamins, and healthy fats.`,
    category: "Lunch",
    slug: "grilled-chicken-salad",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 105,
    title: "Sweet Potato & Veggie Hash with Eggs",
    description: `Kickstart your day with a savory sweet potato and veggie hash topped with perfectly fried eggs—packed with protein, fiber, vitamins A & C, and iron. Ready in 20 minutes!`,
    category: "Breakfast",
    slug: "sweet-potato-veggie-hash",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 106,
    title: "Chia Pudding with Almond Butter",
    description: `Creamy chia seed pudding layered with almond butter and banana slices. Rich in omega-3 fatty acids, calcium, and antioxidants—great for digestion and energy.`,
    category: "Breakfast",
    slug: "chia-pudding-almoncd-butter",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 107,
    title: "Salmon & Brown Rice Bowl",
    description: `Grilled salmon served with steamed brown rice and sautéed spinach. Packed with omega-3 fatty acids, protein, fiber, and essential vitamins for heart and brain health.`,
    category: "Lunch",
    slug: "salmon-brown-rice-bowl",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 108,
    title: "Mediterranean Chickpea Salad",
    description: `A refreshing mix of chickpeas, cucumber, tomato, red onion, and feta with olive oil. High in fiber, plant protein, and healthy fats—perfect for weight management.`,
    category: "Lunch",
    slug: "mediterranean-chickpea-salad",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 109,
    title: "Chocolate Avocado Mousse",
    description: `A guilt-free dessert made with blended avocado, cocoa powder, and honey. Creamy, rich, and full of antioxidants, potassium, and healthy fats.`,
    category: "Dessert",
    slug: "chocolagte-avocado-mousse",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 110,
    title: "Greek Yogurt Bark with Berries",
    description: `Frozen Greek yogurt bark topped with mixed berries and a drizzle of honey. High in protein, calcium, and antioxidants—perfect as a light dessert.`,
    category: "Dessert",
    slug: "greek-yogurt-bark",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 111,
    title: "Hummus & Veggie Wrap",
    description: `Whole wheat tortilla filled with hummus, cucumbers, carrots, and spinach. Packed with fiber, plant protein, and vitamins A, C, and K.`,
    category: "Snack",
    slug: "hummus-veggie-wrap",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
  {
    id: 112,
    title: "Energy Bites (Oats & Peanut Butter)",
    description: `No-bake bites made with oats, peanut butter, honey, and flaxseeds. A quick snack rich in protein, fiber, and omega-3s.`,
    category: "Snack",
    slug: "energy-bites",
    image: "/assets/recipes/cards/avocado-toast.jpg",
    language: "en",
  },
];
