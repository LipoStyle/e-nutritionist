-- Check the specific recipe and its related data
SELECT 
    r.id,
    r.slug,
    r.category,
    rt.title,
    rt.language_code
FROM public.recipes_2025_12_12_18_15 r
LEFT JOIN public.recipe_translations_2025_12_12_18_15 rt ON r.id = rt.recipe_id
WHERE r.slug = 'fluffy-protein-pancakes-homemade-protein-nutella';

-- Check ingredients for this recipe
SELECT 
    ri.recipe_id,
    ri.language_code,
    ri.name,
    ri.quantity,
    ri.unit,
    ri.order_index
FROM public.recipe_ingredients_2025_12_12_18_15 ri
JOIN public.recipes_2025_12_12_18_15 r ON ri.recipe_id = r.id
WHERE r.slug = 'fluffy-protein-pancakes-homemade-protein-nutella'
ORDER BY ri.language_code, ri.order_index;

-- Check instructions for this recipe
SELECT 
    inst.recipe_id,
    inst.language_code,
    inst.step_number,
    inst.instruction
FROM public.recipe_instructions_2025_12_12_18_15 inst
JOIN public.recipes_2025_12_12_18_15 r ON inst.recipe_id = r.id
WHERE r.slug = 'fluffy-protein-pancakes-homemade-protein-nutella'
ORDER BY inst.language_code, inst.step_number;

-- Check nutritional facts for this recipe
SELECT 
    nf.recipe_id,
    nf.language_code,
    nf.name,
    nf.quantity,
    nf.unit,
    nf.order_index
FROM public.recipe_nutritional_facts_2025_12_12_19_00 nf
JOIN public.recipes_2025_12_12_18_15 r ON nf.recipe_id = r.id
WHERE r.slug = 'fluffy-protein-pancakes-homemade-protein-nutella'
ORDER BY nf.language_code, nf.order_index;