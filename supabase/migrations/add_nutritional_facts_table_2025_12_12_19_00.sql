-- Create nutritional facts table for recipes
CREATE TABLE IF NOT EXISTS public.recipe_nutritional_facts_2025_12_12_19_00 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES public.recipes_2025_12_12_18_15(id) ON DELETE CASCADE,
    language_code VARCHAR(2) NOT NULL,
    name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nutritional_facts_recipe_lang ON public.recipe_nutritional_facts_2025_12_12_19_00(recipe_id, language_code);
CREATE INDEX IF NOT EXISTS idx_nutritional_facts_order ON public.recipe_nutritional_facts_2025_12_12_19_00(recipe_id, order_index);

-- Enable RLS
ALTER TABLE public.recipe_nutritional_facts_2025_12_12_19_00 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00 FOR SELECT USING (true);
CREATE POLICY "Anyone can insert nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00 FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00 FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00 FOR DELETE USING (true);

-- Add some sample nutritional facts for the existing quinoa salad recipe
DO $$
DECLARE
    recipe_id UUID;
BEGIN
    SELECT id INTO recipe_id FROM public.recipes_2025_12_12_18_15 WHERE slug = 'healthy-quinoa-salad';
    
    IF recipe_id IS NOT NULL THEN
        -- Insert nutritional facts for English
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'en', 'Calories', 285, 'kcal', 0),
        (recipe_id, 'en', 'Protein', 8.5, 'g', 1),
        (recipe_id, 'en', 'Carbohydrates', 45, 'g', 2),
        (recipe_id, 'en', 'Dietary Fiber', 6.2, 'g', 3),
        (recipe_id, 'en', 'Total Fat', 8.8, 'g', 4),
        (recipe_id, 'en', 'Saturated Fat', 1.2, 'g', 5),
        (recipe_id, 'en', 'Sodium', 390, 'mg', 6),
        (recipe_id, 'en', 'Vitamin C', 45, 'mg', 7),
        (recipe_id, 'en', 'Iron', 2.8, 'mg', 8),
        (recipe_id, 'en', 'Calcium', 35, 'mg', 9);
        
        -- Insert nutritional facts for Spanish
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'es', 'Calorías', 285, 'kcal', 0),
        (recipe_id, 'es', 'Proteína', 8.5, 'g', 1),
        (recipe_id, 'es', 'Carbohidratos', 45, 'g', 2),
        (recipe_id, 'es', 'Fibra Dietética', 6.2, 'g', 3),
        (recipe_id, 'es', 'Grasa Total', 8.8, 'g', 4),
        (recipe_id, 'es', 'Grasa Saturada', 1.2, 'g', 5),
        (recipe_id, 'es', 'Sodio', 390, 'mg', 6),
        (recipe_id, 'es', 'Vitamina C', 45, 'mg', 7),
        (recipe_id, 'es', 'Hierro', 2.8, 'mg', 8),
        (recipe_id, 'es', 'Calcio', 35, 'mg', 9);
        
        -- Insert nutritional facts for Greek
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'gr', 'Θερμίδες', 285, 'kcal', 0),
        (recipe_id, 'gr', 'Πρωτεΐνη', 8.5, 'g', 1),
        (recipe_id, 'gr', 'Υδατάνθρακες', 45, 'g', 2),
        (recipe_id, 'gr', 'Διαιτητικές Ίνες', 6.2, 'g', 3),
        (recipe_id, 'gr', 'Συνολικό Λίπος', 8.8, 'g', 4),
        (recipe_id, 'gr', 'Κορεσμένο Λίπος', 1.2, 'g', 5),
        (recipe_id, 'gr', 'Νάτριο', 390, 'mg', 6),
        (recipe_id, 'gr', 'Βιταμίνη C', 45, 'mg', 7),
        (recipe_id, 'gr', 'Σίδηρος', 2.8, 'mg', 8),
        (recipe_id, 'gr', 'Ασβέστιο', 35, 'mg', 9);
    END IF;
END $$;