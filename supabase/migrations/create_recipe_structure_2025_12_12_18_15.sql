-- Create recipes table
CREATE TABLE public.recipes_2025_12_12_18_15 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    published_date DATE DEFAULT CURRENT_DATE,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe translations table
CREATE TABLE public.recipe_translations_2025_12_12_18_15 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes_2025_12_12_18_15(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    title TEXT NOT NULL,
    short_description TEXT NOT NULL CHECK (char_length(short_description) <= 300),
    full_description TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT CHECK (char_length(seo_description) <= 160),
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id, language_code)
);

-- Create recipe ingredients table
CREATE TABLE public.recipe_ingredients_2025_12_12_18_15 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes_2025_12_12_18_15(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    name TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe instructions table
CREATE TABLE public.recipe_instructions_2025_12_12_18_15 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes_2025_12_12_18_15(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipe valuable information table
CREATE TABLE public.recipe_info_2025_12_12_18_15 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes_2025_12_12_18_15(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    portions INTEGER NOT NULL CHECK (portions > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(recipe_id)
);

-- Create indexes for better performance
CREATE INDEX idx_recipes_slug ON public.recipes_2025_12_12_18_15(slug);
CREATE INDEX idx_recipes_category ON public.recipes_2025_12_12_18_15(category);
CREATE INDEX idx_recipes_published ON public.recipes_2025_12_12_18_15(is_published);
CREATE INDEX idx_recipe_translations_recipe_lang ON public.recipe_translations_2025_12_12_18_15(recipe_id, language_code);
CREATE INDEX idx_recipe_ingredients_recipe_lang ON public.recipe_ingredients_2025_12_12_18_15(recipe_id, language_code);
CREATE INDEX idx_recipe_instructions_recipe_lang ON public.recipe_instructions_2025_12_12_18_15(recipe_id, language_code);

-- Enable RLS
ALTER TABLE public.recipes_2025_12_12_18_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_translations_2025_12_12_18_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients_2025_12_12_18_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_instructions_2025_12_12_18_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_info_2025_12_12_18_15 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view published recipes" ON public.recipes_2025_12_12_18_15 FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can manage recipes" ON public.recipes_2025_12_12_18_15 FOR ALL USING (true);

CREATE POLICY "Anyone can view recipe translations" ON public.recipe_translations_2025_12_12_18_15 FOR SELECT USING (true);
CREATE POLICY "Anyone can manage recipe translations" ON public.recipe_translations_2025_12_12_18_15 FOR ALL USING (true);

CREATE POLICY "Anyone can view recipe ingredients" ON public.recipe_ingredients_2025_12_12_18_15 FOR SELECT USING (true);
CREATE POLICY "Anyone can manage recipe ingredients" ON public.recipe_ingredients_2025_12_12_18_15 FOR ALL USING (true);

CREATE POLICY "Anyone can view recipe instructions" ON public.recipe_instructions_2025_12_12_18_15 FOR SELECT USING (true);
CREATE POLICY "Anyone can manage recipe instructions" ON public.recipe_instructions_2025_12_12_18_15 FOR ALL USING (true);

CREATE POLICY "Anyone can view recipe info" ON public.recipe_info_2025_12_12_18_15 FOR SELECT USING (true);
CREATE POLICY "Anyone can manage recipe info" ON public.recipe_info_2025_12_12_18_15 FOR ALL USING (true);

-- Create storage bucket for recipe images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'recipe-images', 
    'recipe-images', 
    true, 
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for recipe images
CREATE POLICY "Public can view recipe images" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can upload recipe images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' AND 
    (storage.foldername(name))[1] = 'recipes'
);

CREATE POLICY "Anyone can update recipe images" ON storage.objects FOR UPDATE USING (
    bucket_id = 'recipe-images'
);

CREATE POLICY "Anyone can delete recipe images" ON storage.objects FOR DELETE USING (
    bucket_id = 'recipe-images'
);