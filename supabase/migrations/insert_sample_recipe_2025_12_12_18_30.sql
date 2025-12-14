-- Insert sample recipe
INSERT INTO public.recipes_2025_12_12_18_15 (
    slug, 
    category, 
    image_url,
    published_date,
    is_published
) VALUES (
    'healthy-quinoa-salad',
    'Salads',
    '/images/hero-nutritionist_20251211_133643.png',
    CURRENT_DATE,
    true
);

-- Get the recipe ID for translations and related data
DO $$
DECLARE
    recipe_id UUID;
BEGIN
    SELECT id INTO recipe_id FROM public.recipes_2025_12_12_18_15 WHERE slug = 'healthy-quinoa-salad';
    
    -- Insert English translation
    INSERT INTO public.recipe_translations_2025_12_12_18_15 (
        recipe_id, language_code, title, short_description, full_description, seo_title, seo_description, seo_keywords
    ) VALUES (
        recipe_id,
        'en',
        'Healthy Quinoa Salad',
        'A nutritious and colorful quinoa salad packed with fresh vegetables, herbs, and a zesty lemon dressing. Perfect for lunch or as a side dish.',
        'This healthy quinoa salad is a perfect combination of protein-rich quinoa, fresh vegetables, and aromatic herbs. The zesty lemon dressing adds a refreshing touch that makes this salad both satisfying and delicious. It''s an excellent source of plant-based protein, fiber, and essential nutrients.

This recipe is ideal for meal prep, as it keeps well in the refrigerator for up to 3 days. You can customize it with your favorite vegetables and herbs to suit your taste preferences. It''s naturally gluten-free and can easily be made vegan.',
        'Healthy Quinoa Salad Recipe | Nutritious & Delicious | e-Nutritionist',
        'Try our healthy quinoa salad recipe packed with fresh vegetables and zesty lemon dressing. Perfect for meal prep and nutrition goals.',
        'quinoa salad, healthy recipe, vegetarian, gluten-free, meal prep, nutrition, fresh vegetables'
    );
    
    -- Insert Spanish translation
    INSERT INTO public.recipe_translations_2025_12_12_18_15 (
        recipe_id, language_code, title, short_description, full_description, seo_title, seo_description, seo_keywords
    ) VALUES (
        recipe_id,
        'es',
        'Ensalada Saludable de Quinoa',
        'Una ensalada nutritiva y colorida de quinoa llena de verduras frescas, hierbas y un aderezo cítrico de limón. Perfecta para el almuerzo o como acompañamiento.',
        'Esta ensalada saludable de quinoa es una combinación perfecta de quinoa rica en proteínas, verduras frescas y hierbas aromáticas. El aderezo cítrico de limón añade un toque refrescante que hace que esta ensalada sea satisfactoria y deliciosa.',
        'Receta de Ensalada Saludable de Quinoa | Nutritiva y Deliciosa | e-Nutritionist',
        'Prueba nuestra receta de ensalada saludable de quinoa llena de verduras frescas y aderezo cítrico de limón.',
        'ensalada quinoa, receta saludable, vegetariana, sin gluten, preparación comidas, nutrición'
    );
    
    -- Insert Greek translation
    INSERT INTO public.recipe_translations_2025_12_12_18_15 (
        recipe_id, language_code, title, short_description, full_description, seo_title, seo_description, seo_keywords
    ) VALUES (
        recipe_id,
        'gr',
        'Υγιεινή Σαλάτα με Κινόα',
        'Μια θρεπτική και πολύχρωμη σαλάτα κινόα γεμάτη φρέσκα λαχανικά, μυρωδικά και μια ζεστή σάλτσα λεμονιού. Ιδανική για μεσημεριανό ή ως συνοδευτικό.',
        'Αυτή η υγιεινή σαλάτα κινόα είναι ένας τέλειος συνδυασμός κινόα πλούσιας σε πρωτεΐνες, φρέσκων λαχανικών και αρωματικών μυρωδικών.',
        'Συνταγή Υγιεινής Σαλάτας με Κινόα | Θρεπτική και Νόστιμη | e-Nutritionist',
        'Δοκιμάστε τη συνταγή μας για υγιεινή σαλάτα κινόα γεμάτη φρέσκα λαχανικά και ζεστή σάλτσα λεμονιού.',
        'σαλάτα κινόα, υγιεινή συνταγή, χορτοφαγική, χωρίς γλουτένη, προετοιμασία γευμάτων'
    );
    
    -- Insert recipe info
    INSERT INTO public.recipe_info_2025_12_12_18_15 (recipe_id, duration_minutes, difficulty, portions) VALUES
    (recipe_id, 20, 'easy', 4);
    
    -- Insert ingredients for English
    INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
    (recipe_id, 'en', 'Quinoa', 1, 'cup', 0),
    (recipe_id, 'en', 'Cherry tomatoes', 200, 'g', 1),
    (recipe_id, 'en', 'Cucumber', 1, 'piece', 2),
    (recipe_id, 'en', 'Red bell pepper', 1, 'piece', 3),
    (recipe_id, 'en', 'Red onion', 0.5, 'piece', 4),
    (recipe_id, 'en', 'Fresh parsley', 0.25, 'cup', 5),
    (recipe_id, 'en', 'Lemon juice', 3, 'tbsp', 6),
    (recipe_id, 'en', 'Olive oil', 2, 'tbsp', 7),
    (recipe_id, 'en', 'Salt', 1, 'tsp', 8),
    (recipe_id, 'en', 'Black pepper', 0.5, 'tsp', 9);
    
    -- Insert ingredients for Spanish
    INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
    (recipe_id, 'es', 'Quinoa', 1, 'cup', 0),
    (recipe_id, 'es', 'Tomates cherry', 200, 'g', 1),
    (recipe_id, 'es', 'Pepino', 1, 'piece', 2),
    (recipe_id, 'es', 'Pimiento rojo', 1, 'piece', 3),
    (recipe_id, 'es', 'Cebolla roja', 0.5, 'piece', 4),
    (recipe_id, 'es', 'Perejil fresco', 0.25, 'cup', 5),
    (recipe_id, 'es', 'Jugo de limón', 3, 'tbsp', 6),
    (recipe_id, 'es', 'Aceite de oliva', 2, 'tbsp', 7),
    (recipe_id, 'es', 'Sal', 1, 'tsp', 8),
    (recipe_id, 'es', 'Pimienta negra', 0.5, 'tsp', 9);
    
    -- Insert ingredients for Greek
    INSERT INTO public.recipe_ingredients_2025_12_12_18_15 (recipe_id, language_code, name, quantity, unit, order_index) VALUES
    (recipe_id, 'gr', 'Κινόα', 1, 'cup', 0),
    (recipe_id, 'gr', 'Ντοματίνια', 200, 'g', 1),
    (recipe_id, 'gr', 'Αγγούρι', 1, 'piece', 2),
    (recipe_id, 'gr', 'Κόκκινη πιπεριά', 1, 'piece', 3),
    (recipe_id, 'gr', 'Κόκκινο κρεμμύδι', 0.5, 'piece', 4),
    (recipe_id, 'gr', 'Φρέσκος μαϊντανός', 0.25, 'cup', 5),
    (recipe_id, 'gr', 'Χυμός λεμονιού', 3, 'tbsp', 6),
    (recipe_id, 'gr', 'Ελαιόλαδο', 2, 'tbsp', 7),
    (recipe_id, 'gr', 'Αλάτι', 1, 'tsp', 8),
    (recipe_id, 'gr', 'Μαύρο πιπέρι', 0.5, 'tsp', 9);
    
    -- Insert instructions for English
    INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
    (recipe_id, 'en', 1, 'Rinse quinoa under cold water until water runs clear. Cook quinoa according to package instructions, then let it cool completely.'),
    (recipe_id, 'en', 2, 'While quinoa is cooling, wash and chop all vegetables: halve cherry tomatoes, dice cucumber and bell pepper, and finely chop red onion and parsley.'),
    (recipe_id, 'en', 3, 'In a large bowl, combine cooled quinoa with all chopped vegetables and fresh parsley.'),
    (recipe_id, 'en', 4, 'In a small bowl, whisk together lemon juice, olive oil, salt, and black pepper to make the dressing.'),
    (recipe_id, 'en', 5, 'Pour dressing over the quinoa salad and toss gently to combine all ingredients evenly.'),
    (recipe_id, 'en', 6, 'Let the salad rest for 10 minutes to allow flavors to meld. Taste and adjust seasoning if needed. Serve chilled or at room temperature.');
    
    -- Insert instructions for Spanish
    INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
    (recipe_id, 'es', 1, 'Enjuaga la quinoa bajo agua fría hasta que el agua salga clara. Cocina la quinoa según las instrucciones del paquete, luego déjala enfriar completamente.'),
    (recipe_id, 'es', 2, 'Mientras la quinoa se enfría, lava y corta todas las verduras: corta los tomates cherry por la mitad, corta en cubitos el pepino y el pimiento, y pica finamente la cebolla roja y el perejil.'),
    (recipe_id, 'es', 3, 'En un tazón grande, combina la quinoa fría con todas las verduras picadas y el perejil fresco.'),
    (recipe_id, 'es', 4, 'En un tazón pequeño, bate el jugo de limón, aceite de oliva, sal y pimienta negra para hacer el aderezo.'),
    (recipe_id, 'es', 5, 'Vierte el aderezo sobre la ensalada de quinoa y mezcla suavemente para combinar todos los ingredientes uniformemente.'),
    (recipe_id, 'es', 6, 'Deja reposar la ensalada por 10 minutos para que los sabores se mezclen. Prueba y ajusta el condimento si es necesario. Sirve fría o a temperatura ambiente.');
    
    -- Insert instructions for Greek
    INSERT INTO public.recipe_instructions_2025_12_12_18_15 (recipe_id, language_code, step_number, instruction) VALUES
    (recipe_id, 'gr', 1, 'Ξεπλύνετε την κινόα με κρύο νερό μέχρι το νερό να βγαίνει καθαρό. Μαγειρέψτε την κινόα σύμφωνα με τις οδηγίες της συσκευασίας, στη συνέχεια αφήστε την να κρυώσει εντελώς.'),
    (recipe_id, 'gr', 2, 'Ενώ η κινόα κρυώνει, πλύνετε και κόψτε όλα τα λαχανικά: κόψτε τα ντοματίνια στη μέση, κόψτε σε κυβάκια το αγγούρι και την πιπεριά, και ψιλοκόψτε το κόκκινο κρεμμύδι και τον μαϊντανό.'),
    (recipe_id, 'gr', 3, 'Σε ένα μεγάλο μπολ, συνδυάστε την κρύα κινόα με όλα τα κομμένα λαχανικά και τον φρέσκο μαϊντανό.'),
    (recipe_id, 'gr', 4, 'Σε ένα μικρό μπολ, χτυπήστε μαζί το χυμό λεμονιού, το ελαιόλαδο, το αλάτι και το μαύρο πιπέρι για να φτιάξετε τη σάλτσα.'),
    (recipe_id, 'gr', 5, 'Ρίξτε τη σάλτσα πάνω από τη σαλάτα κινόα και ανακατέψτε απαλά για να συνδυάσετε όλα τα υλικά ομοιόμορφα.'),
    (recipe_id, 'gr', 6, 'Αφήστε τη σαλάτα να ξεκουραστεί για 10 λεπτά για να αναμειχθούν οι γεύσεις. Δοκιμάστε και προσαρμόστε το αλάτισμα αν χρειάζεται. Σερβίρετε κρύα ή σε θερμοκρασία δωματίου.');
END $$;