export type Lang = "en" | "es" | "el";

export type Params = { lang: Lang; slug: string };

export type MetaInfo = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
};

export type ValuableInfo = {
  duration?: string | number | null;
  difficulty?: string | null;
  persons?: number | string | null;
  portions?: number | string | null;
};

export type Ingredient = {
  id?: string;
  name: string;
  quantity?: string | number | null;
  size?: string | null;
};

export type Instruction = {
  id?: string;
  step_number?: number | null;
  step_content: string;
};

export type Nutrition = {
  id?: string;
  name: string;
  quantity?: string | number | null;
  size?: string | null;
};

export type Recipe = {
  title: string;
  description?: string | null;
  image_url?: string | null;
  image?: string | null;
  valuable_info?: ValuableInfo | null;
  ingredients?: Ingredient[] | null;
  instructions?: Instruction[] | null;
  nutritional_facts?: Nutrition[] | null;
  meta_info?: MetaInfo | null;
};
