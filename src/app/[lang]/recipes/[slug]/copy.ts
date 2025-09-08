import type { Lang } from "./types";

export const copy: Record<
  Lang,
  {
    ingredients: string;
    instructions: string;
    tip: string;
    tipIngredients: string;
    tipSteps: string;
    emptyIngredients: string;
    emptyInstructions: string;
    nutritionTitle: string;
    servingSingular: string;
    servingPlural: string;
  }
> = {
  en: {
    ingredients: "Ingredients",
    instructions: "Instructions",
    tip: "TIP",
    tipIngredients:
      "Check off the ingredients you’ve used in the recipe, or mark the ones you already have and add the rest to your shopping list.",
    tipSteps:
      "Tick each step as you go. Keep heat medium for even browning; add a splash of water if the pan gets too dry.",
    emptyIngredients: "Ingredients coming soon.",
    emptyInstructions: "Instructions coming soon.",
    nutritionTitle: "Nutritional facts (per portion)",
    servingSingular: "serving",
    servingPlural: "servings",
  },
  es: {
    ingredients: "Ingredientes",
    instructions: "Instrucciones",
    tip: "CONSEJO",
    tipIngredients:
      "Marca los ingredientes que ya has usado o los que ya tienes y añade el resto a tu lista de la compra.",
    tipSteps:
      "Marca cada paso a medida que avanzas. Mantén el fuego medio para un dorado uniforme; añade un chorrito de agua si la sartén se seca.",
    emptyIngredients: "Ingredientes próximamente.",
    emptyInstructions: "Instrucciones próximamente.",
    nutritionTitle: "Información nutricional (por porción)",
    servingSingular: "ración",
    servingPlural: "raciones",
  },
  el: {
    ingredients: "Υλικά",
    instructions: "Οδηγίες",
    tip: "ΣΥΜΒΟΥΛΗ",
    tipIngredients:
      "Τσέκαρε τα υλικά που χρησιμοποίησες ή αυτά που ήδη έχεις και πρόσθεσε τα υπόλοιπα στη λίστα αγορών.",
    tipSteps:
      "Τσέκαρε κάθε βήμα καθώς προχωράς. Κράτησε μέτρια φωτιά για ομοιόμορφο ρόδισμα∙ πρόσθεσε λίγο νερό αν στεγνώνει το τηγάνι.",
    emptyIngredients: "Τα υλικά έρχονται σύντομα.",
    emptyInstructions: "Οι οδηγίες έρχονται σύντομα.",
    nutritionTitle: "Διατροφικά στοιχεία (ανά μερίδα)",
    servingSingular: "μερίδα",
    servingPlural: "μερίδες",
  },
};
