-- Add sample data for the protein pancakes recipe
DO $$
DECLARE
    target_recipe_id UUID;
BEGIN
    -- Get the recipe ID
    SELECT id INTO target_recipe_id FROM public.recipes_2025_12_12_18_15 WHERE slug = 'fluffy-protein-pancakes-homemade-protein-nutella';
    
    IF target_recipe_id IS NOT NULL THEN
        -- Delete existing data first (in case it exists)
        DELETE FROM public.recipe_ingredients_2025_12_12_18_15 WHERE recipe_id = target_recipe_id;
        DELETE FROM public.recipe_instructions_2025_12_12_18_15 WHERE recipe_id = target_recipe_id;
        DELETE FROM public.recipe_nutritional_facts_2025_12_12_19_00 WHERE recipe_id = target_recipe_id;
        
        -- Insert ingredients for English
        INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (target_recipe_id, 'en', 'Oat flour', 1, 'cup', 0),
        (target_recipe_id, 'en', 'Protein powder (vanilla)', 1, 'scoop', 1),
        (target_recipe_id, 'en', 'Egg whites', 3, 'pieces', 2),
        (target_recipe_id, 'en', 'Greek yogurt', 0.5, 'cup', 3),
        (target_recipe_id, 'en', 'Baking powder', 1, 'tsp', 4),
        (target_recipe_id, 'en', 'Vanilla extract', 1, 'tsp', 5),
        (target_recipe_id, 'en', 'Almond milk', 0.25, 'cup', 6),
        (target_recipe_id, 'en', 'Stevia or honey', 1, 'tbsp', 7);
        
        -- Insert instructions for English
        INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
        (target_recipe_id, 'en', 1, 'In a large bowl, whisk together oat flour, protein powder, and baking powder.'),
        (target_recipe_id, 'en', 2, 'In another bowl, combine egg whites, Greek yogurt, vanilla extract, almond milk, and sweetener.'),
        (target_recipe_id, 'en', 3, 'Pour the wet ingredients into the dry ingredients and mix until just combined. Do not overmix.'),
        (target_recipe_id, 'en', 4, 'Heat a non-stick pan over medium heat. Pour 1/4 cup of batter for each pancake.'),
        (target_recipe_id, 'en', 5, 'Cook for 2-3 minutes until bubbles form on surface, then flip and cook for another 1-2 minutes.'),
        (target_recipe_id, 'en', 6, 'Serve immediately with your homemade protein Nutella and fresh berries. Enjoy!');
        
        -- Insert nutritional facts for English
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (target_recipe_id, 'en', 'Calories', 180, 'kcal', 0),
        (target_recipe_id, 'en', 'Protein', 25, 'g', 1),
        (target_recipe_id, 'en', 'Carbohydrates', 15, 'g', 2),
        (target_recipe_id, 'en', 'Dietary Fiber', 3, 'g', 3),
        (target_recipe_id, 'en', 'Total Fat', 4, 'g', 4),
        (target_recipe_id, 'en', 'Saturated Fat', 1, 'g', 5),
        (target_recipe_id, 'en', 'Sugar', 8, 'g', 6),
        (target_recipe_id, 'en', 'Sodium', 150, 'mg', 7);
        
        RAISE NOTICE 'Sample data added successfully for recipe: %', target_recipe_id;
    ELSE
        RAISE NOTICE 'Recipe not found with slug: fluffy-protein-pancakes-homemade-protein-nutella';
    END IF;
END $$;