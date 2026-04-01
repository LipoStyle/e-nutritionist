type Lang = "en" | "es" | "el";

export const blogHeroData: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Nutrition Blog & Insights",
    description:
      "Stay updated with the latest research, tips, and strategies for optimal nutrition, athletic performance, and healthy living from our certified nutritionist.",
  },
  es: {
    title: "Blog y Consejos de Nutrición",
    description:
      "Mantente al día con investigaciones, consejos y estrategias para optimizar tu nutrición, rendimiento atlético y salud.",
  },
  el: {
    title: "Blog Διατροφής & Insights",
    description:
      "Μείνε ενημερωμένος/η με έρευνες, tips και στρατηγικές για βέλτιστη διατροφή, αθλητική απόδοση και υγιή ζωή.",
  },
};

