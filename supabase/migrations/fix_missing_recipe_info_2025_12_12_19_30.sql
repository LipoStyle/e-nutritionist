-- Insert missing recipe_info records for recipes that don't have them
INSERT INTO public.recipe_info_2025_12_12_18_15 (recipe_id, duration_minutes, difficulty, portions)
SELECT 
    r.id,
    30 as duration_minutes,  -- Default 30 minutes
    'medium' as difficulty,  -- Default medium difficulty
    4 as portions           -- Default 4 portions
FROM public.recipes_2025_12_12_18_15 r
LEFT JOIN public.recipe_info_2025_12_12_18_15 ri ON r.id = ri.recipe_id
WHERE ri.recipe_id IS NULL;

-- Check the results
SELECT 
    r.slug,
    ri.duration_minutes,
    ri.difficulty,
    ri.portions
FROM public.recipes_2025_12_12_18_15 r
JOIN public.recipe_info_2025_12_12_18_15 ri ON r.id = ri.recipe_id
ORDER BY r.created_at DESC;