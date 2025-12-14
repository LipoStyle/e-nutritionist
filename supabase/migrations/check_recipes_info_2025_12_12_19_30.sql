-- Check all recipes and their info
SELECT 
    r.id,
    r.slug,
    r.category,
    r.created_at,
    ri.duration_minutes,
    ri.difficulty,
    ri.portions
FROM public.recipes_2025_12_12_18_15 r
LEFT JOIN public.recipe_info_2025_12_12_18_15 ri ON r.id = ri.recipe_id
ORDER BY r.created_at DESC;