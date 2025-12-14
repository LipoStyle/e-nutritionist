-- Add sample data for the protein pancakes recipe
DO $$
DECLARE
    recipe_id UUID;
BEGIN
    -- Get the recipe ID
    SELECT id INTO recipe_id FROM public.recipes_2025_12_12_18_15 WHERE slug = 'fluffy-protein-pancakes-homemade-protein-nutella';
    
    IF recipe_id IS NOT NULL THEN
        -- Delete existing data first (in case it exists)
        DELETE FROM public.recipe_ingredients_2025_12_12_18_15 WHERE recipe_id = recipe_id;
        DELETE FROM public.recipe_instructions_2025_12_12_18_15 WHERE recipe_id = recipe_id;
        DELETE FROM public.recipe_nutritional_facts_2025_12_12_19_00 WHERE recipe_id = recipe_id;
        
        -- Insert ingredients for English
        INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'en', 'Oat flour', 1, 'cup', 0),
        (recipe_id, 'en', 'Protein powder (vanilla)', 1, 'scoop', 1),
        (recipe_id, 'en', 'Egg whites', 3, 'pieces', 2),
        (recipe_id, 'en', 'Greek yogurt', 0.5, 'cup', 3),
        (recipe_id, 'en', 'Baking powder', 1, 'tsp', 4),
        (recipe_id, 'en', 'Vanilla extract', 1, 'tsp', 5),
        (recipe_id, 'en', 'Almond milk', 0.25, 'cup', 6),
        (recipe_id, 'en', 'Stevia or honey', 1, 'tbsp', 7);
        
        -- Insert ingredients for Spanish
        INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'es', 'Harina de avena', 1, 'cup', 0),
        (recipe_id, 'es', 'Proteína en polvo (vainilla)', 1, 'scoop', 1),
        (recipe_id, 'es', 'Claras de huevo', 3, 'pieces', 2),
        (recipe_id, 'es', 'Yogur griego', 0.5, 'cup', 3),
        (recipe_id, 'es', 'Polvo de hornear', 1, 'tsp', 4),
        (recipe_id, 'es', 'Extracto de vainilla', 1, 'tsp', 5),
        (recipe_id, 'es', 'Leche de almendra', 0.25, 'cup', 6),
        (recipe_id, 'es', 'Stevia o miel', 1, 'tbsp', 7);
        
        -- Insert ingredients for Greek
        INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'gr', 'Αλεύρι βρώμης', 1, 'cup', 0),
        (recipe_id, 'gr', 'Πρωτεΐνη σε σκόνη (βανίλια)', 1, 'scoop', 1),
        (recipe_id, 'gr', 'Ασπράδια αυγών', 3, 'pieces', 2),
        (recipe_id, 'gr', 'Ελληνικό γιαούρτι', 0.5, 'cup', 3),
        (recipe_id, 'gr', 'Μπέικιν πάουντερ', 1, 'tsp', 4),
        (recipe_id, 'gr', 'Εκχύλισμα βανίλιας', 1, 'tsp', 5),
        (recipe_id, 'gr', 'Γάλα αμυγδάλου', 0.25, 'cup', 6),
        (recipe_id, 'gr', 'Στέβια ή μέλι', 1, 'tbsp', 7);
        
        -- Insert instructions for English
        INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
        (recipe_id, 'en', 1, 'In a large bowl, whisk together oat flour, protein powder, and baking powder.'),
        (recipe_id, 'en', 2, 'In another bowl, combine egg whites, Greek yogurt, vanilla extract, almond milk, and sweetener.'),
        (recipe_id, 'en', 3, 'Pour the wet ingredients into the dry ingredients and mix until just combined. Do not overmix.'),
        (recipe_id, 'en', 4, 'Heat a non-stick pan over medium heat. Pour 1/4 cup of batter for each pancake.'),
        (recipe_id, 'en', 5, 'Cook for 2-3 minutes until bubbles form on surface, then flip and cook for another 1-2 minutes.'),
        (recipe_id, 'en', 6, 'Serve immediately with your homemade protein Nutella and fresh berries. Enjoy!');
        
        -- Insert instructions for Spanish
        INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
        (recipe_id, 'es', 1, 'En un tazón grande, mezcla la harina de avena, proteína en polvo y polvo de hornear.'),
        (recipe_id, 'es', 2, 'En otro tazón, combina las claras de huevo, yogur griego, extracto de vainilla, leche de almendra y edulcorante.'),
        (recipe_id, 'es', 3, 'Vierte los ingredientes húmedos en los secos y mezcla hasta que se combinen. No mezcles demasiado.'),
        (recipe_id, 'es', 4, 'Calienta una sartén antiadherente a fuego medio. Vierte 1/4 taza de masa para cada panqueque.'),
        (recipe_id, 'es', 5, 'Cocina por 2-3 minutos hasta que se formen burbujas en la superficie, luego voltea y cocina por 1-2 minutos más.'),
        (recipe_id, 'es', 6, '¡Sirve inmediatamente con tu Nutella proteica casera y frutos rojos frescos. ¡Disfruta!');
        
        -- Insert instructions for Greek
        INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
        (recipe_id, 'gr', 1, 'Σε ένα μεγάλο μπολ, ανακατέψτε το αλεύρι βρώμης, την πρωτεΐνη σε σκόνη και το μπέικιν πάουντερ.'),
        (recipe_id, 'gr', 2, 'Σε άλλο μπολ, συνδυάστε τα ασπράδια αυγών, το ελληνικό γιαούρτι, το εκχύλισμα βανίλιας, το γάλα αμυγδάλου και το γλυκαντικό.'),
        (recipe_id, 'gr', 3, 'Ρίξτε τα υγρά υλικά στα στεγνά και ανακατέψτε μέχρι να ενωθούν. Μην ανακατέψετε υπερβολικά.'),
        (recipe_id, 'gr', 4, 'Ζεστάνετε ένα αντικολλητικό τηγάνι σε μέτρια φωτιά. Ρίξτε 1/4 φλιτζάνι μίγμα για κάθε pancake.'),
        (recipe_id, 'gr', 5, 'Μαγειρέψτε για 2-3 λεπτά μέχρι να σχηματιστούν φυσαλίδες στην επιφάνεια, στη συνέχεια γυρίστε και μαγειρέψτε για άλλα 1-2 λεπτά.'),
        (recipe_id, 'gr', 6, 'Σερβίρετε αμέσως με τη σπιτική σας πρωτεϊνική Nutella και φρέσκα μούρα. Απολαύστε!');
        
        -- Insert nutritional facts for English
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'en', 'Calories', 180, 'kcal', 0),
        (recipe_id, 'en', 'Protein', 25, 'g', 1),
        (recipe_id, 'en', 'Carbohydrates', 15, 'g', 2),
        (recipe_id, 'en', 'Dietary Fiber', 3, 'g', 3),
        (recipe_id, 'en', 'Total Fat', 4, 'g', 4),
        (recipe_id, 'en', 'Saturated Fat', 1, 'g', 5),
        (recipe_id, 'en', 'Sugar', 8, 'g', 6),
        (recipe_id, 'en', 'Sodium', 150, 'mg', 7);
        
        -- Insert nutritional facts for Spanish
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'es', 'Calorías', 180, 'kcal', 0),
        (recipe_id, 'es', 'Proteína', 25, 'g', 1),
        (recipe_id, 'es', 'Carbohidratos', 15, 'g', 2),
        (recipe_id, 'es', 'Fibra Dietética', 3, 'g', 3),
        (recipe_id, 'es', 'Grasa Total', 4, 'g', 4),
        (recipe_id, 'es', 'Grasa Saturada', 1, 'g', 5),
        (recipe_id, 'es', 'Azúcar', 8, 'g', 6),
        (recipe_id, 'es', 'Sodio', 150, 'mg', 7);
        
        -- Insert nutritional facts for Greek
        INSERT INTO public.recipe_nutritional_facts_2025_12_12_19_00 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
        (recipe_id, 'gr', 'Θερμίδες', 180, 'kcal', 0),
        (recipe_id, 'gr', 'Πρωτεΐνη', 25, 'g', 1),
        (recipe_id, 'gr', 'Υδατάνθρακες', 15, 'g', 2),
        (recipe_id, 'gr', 'Διαιτητικές Ίνες', 3, 'g', 3),
        (recipe_id, 'gr', 'Συνολικό Λίπος', 4, 'g', 4),
        (recipe_id, 'gr', 'Κορεσμένο Λίπος', 1, 'g', 5),
        (recipe_id, 'gr', 'Ζάχαρη', 8, 'g', 6),
        (recipe_id, 'gr', 'Νάτριο', 150, 'mg', 7);
        
        RAISE NOTICE 'Sample data added successfully for recipe: %', recipe_id;
    ELSE
        RAISE NOTICE 'Recipe not found with slug: fluffy-protein-pancakes-homemade-protein-nutella';
    END IF;
END $$;