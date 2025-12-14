-- Insert sample services
INSERT INTO public.services_2025_12_11_13_27 (title, description, short_description, price, duration_minutes, image_url, is_active) VALUES
('Athletic Nutrition Consultation', 'Comprehensive nutrition assessment and meal planning specifically designed for athletes and active individuals. Includes performance optimization strategies, supplement recommendations, and recovery nutrition protocols.', 'Personalized nutrition plans for athletes and active individuals', 150.00, 60, '/images/athletic-nutrition.jpg', true),
('Weight Management Program', 'Evidence-based weight management program combining nutrition education, meal planning, and lifestyle modifications. Suitable for both weight loss and healthy weight gain goals.', 'Sustainable weight management with personalized meal plans', 120.00, 45, '/images/weight-management.jpg', true),
('Sports Performance Nutrition', 'Advanced nutrition strategies for competitive athletes focusing on pre-competition fueling, hydration protocols, and recovery optimization. Includes timing strategies and supplement guidance.', 'Optimize athletic performance through strategic nutrition', 180.00, 75, '/images/sports-performance.jpg', true),
('Meal Prep Consultation', 'Learn efficient meal preparation techniques, batch cooking strategies, and food storage methods. Perfect for busy individuals who want to maintain healthy eating habits.', 'Master meal prep for consistent healthy eating', 100.00, 45, '/images/meal-prep.jpg', true),
('Nutrition Education Workshop', 'Group workshop covering fundamental nutrition principles, reading food labels, understanding macronutrients, and making informed food choices for optimal health.', 'Learn the fundamentals of healthy nutrition', 75.00, 90, '/images/nutrition-education.jpg', true),
('Body Composition Analysis', 'Comprehensive body composition assessment using advanced techniques, including muscle mass analysis, body fat percentage, and metabolic rate calculation with personalized recommendations.', 'Detailed body composition analysis and recommendations', 80.00, 30, '/images/body-composition.jpg', true);

-- Insert sample blog posts
INSERT INTO public.blogs_2025_12_11_13_27 (title, content, excerpt, image_url, slug, is_published, tags) VALUES
('The Ultimate Guide to Pre-Workout Nutrition', 'Pre-workout nutrition plays a crucial role in athletic performance and workout effectiveness. The timing, composition, and quantity of nutrients consumed before exercise can significantly impact energy levels, endurance, and recovery.

## Key Principles of Pre-Workout Nutrition

### Timing Matters
The ideal time to eat before a workout depends on the size and composition of your meal. For larger meals containing protein, carbohydrates, and fats, aim to eat 3-4 hours before exercise. For smaller snacks, 30-60 minutes before your workout is optimal.

### Carbohydrates for Energy
Carbohydrates are your body''s preferred fuel source during high-intensity exercise. Focus on easily digestible carbs like:
- Bananas
- Oatmeal
- Toast with honey
- Sports drinks (for longer sessions)

### Protein for Muscle Support
Including some protein in your pre-workout meal can help prevent muscle breakdown and support recovery. Good options include:
- Greek yogurt
- Protein smoothies
- Lean meats (if eating 3-4 hours prior)

### Hydration is Key
Start hydrating well before your workout. Aim to drink 16-20 ounces of water 2-3 hours before exercise, and another 8 ounces 15-30 minutes before starting.

## Sample Pre-Workout Meals

### 3-4 Hours Before:
- Grilled chicken with sweet potato and vegetables
- Oatmeal with berries and Greek yogurt
- Whole grain toast with avocado and eggs

### 30-60 Minutes Before:
- Banana with almond butter
- Greek yogurt with honey
- Sports drink with a small handful of dates

Remember, individual tolerance varies, so experiment during training to find what works best for you.', 'Learn how to fuel your workouts effectively with proper pre-workout nutrition timing and food choices for optimal performance.', '/images/pre-workout-nutrition.jpg', 'ultimate-guide-pre-workout-nutrition', true, ARRAY['nutrition', 'fitness', 'pre-workout', 'athletic performance']),

('5 High-Protein Breakfast Ideas for Athletes', 'Starting your day with adequate protein is essential for athletes and active individuals. Protein helps with muscle recovery, maintains lean body mass, and provides sustained energy throughout the morning.

## Why Protein at Breakfast Matters

Research shows that consuming 20-30 grams of protein at breakfast can:
- Improve muscle protein synthesis
- Enhance satiety and reduce cravings
- Stabilize blood sugar levels
- Support weight management goals

## 5 Delicious High-Protein Breakfast Ideas

### 1. Greek Yogurt Power Bowl
**Protein: 25g**
- 1 cup Greek yogurt (20g protein)
- 2 tbsp chopped almonds (4g protein)
- 1 tbsp chia seeds (1g protein)
- Fresh berries and honey

### 2. Protein-Packed Smoothie
**Protein: 30g**
- 1 scoop whey protein powder (25g protein)
- 1 cup milk (8g protein)
- 1 banana
- 1 tbsp peanut butter
- Handful of spinach

### 3. Scrambled Egg Veggie Wrap
**Protein: 28g**
- 3 whole eggs (18g protein)
- 1 whole wheat tortilla (4g protein)
- 2 tbsp shredded cheese (6g protein)
- Sautéed vegetables

### 4. Overnight Protein Oats
**Protein: 22g**
- 1/2 cup oats (5g protein)
- 1 scoop protein powder (25g protein)
- 1 cup milk (8g protein)
- Chia seeds and fruit

### 5. Cottage Cheese Pancakes
**Protein: 24g**
- 1/2 cup cottage cheese (14g protein)
- 2 eggs (12g protein)
- 1/4 cup oats
- Cinnamon and vanilla

## Meal Prep Tips

Prepare ingredients the night before to save time in the morning. Overnight oats, pre-cut fruits, and hard-boiled eggs are great make-ahead options.', 'Discover 5 delicious and nutritious high-protein breakfast recipes perfect for athletes and active individuals.', '/images/high-protein-breakfast.jpg', 'high-protein-breakfast-ideas-athletes', true, ARRAY['breakfast', 'protein', 'meal prep', 'athletic nutrition']),

('Hydration Strategies for Optimal Performance', 'Proper hydration is fundamental to athletic performance, yet it''s often overlooked. Even mild dehydration can significantly impact strength, power, and endurance while increasing the risk of heat-related illness.

## Understanding Hydration Needs

### Daily Hydration Baseline
Most adults need about 35-40ml of water per kilogram of body weight daily. For a 70kg person, this equals approximately 2.5-2.8 liters per day.

### Exercise Hydration Requirements
During exercise, fluid needs increase dramatically due to sweat losses. Factors affecting sweat rate include:
- Exercise intensity and duration
- Environmental temperature and humidity
- Individual sweat rate
- Fitness level and heat acclimatization

## Pre-Exercise Hydration

Start hydrating well before your workout:
- 2-3 hours before: 16-20 oz (500-600ml) of fluid
- 15-30 minutes before: 8 oz (250ml) of fluid

## During Exercise Hydration

### For Sessions Under 60 Minutes:
Water is typically sufficient for most activities lasting less than an hour.

### For Sessions Over 60 Minutes:
Consider sports drinks containing:
- 6-8% carbohydrate solution
- Sodium (200-300mg per 8oz)
- Potassium for electrolyte balance

### Hydration Guidelines:
- Aim for 6-8 oz every 15-20 minutes
- Don''t wait until you''re thirsty
- Monitor urine color as a hydration indicator

## Post-Exercise Rehydration

Replace 150% of fluid losses within 6 hours post-exercise. For every pound lost during exercise, drink 16-24 oz of fluid.

## Signs of Dehydration

Watch for these warning signs:
- Dark yellow urine
- Decreased performance
- Fatigue and dizziness
- Headache
- Reduced coordination

## Electrolyte Balance

During prolonged exercise (>2 hours) or in hot conditions, electrolyte replacement becomes crucial. Natural options include:
- Coconut water
- Diluted fruit juices with added salt
- Homemade sports drinks

Remember, individual needs vary significantly. Work with a sports nutritionist to develop a personalized hydration strategy.', 'Master the art of proper hydration for athletic performance with evidence-based strategies and practical tips.', '/images/hydration-strategies.jpg', 'hydration-strategies-optimal-performance', true, ARRAY['hydration', 'performance', 'electrolytes', 'sports nutrition']);

-- Insert sample recipes
INSERT INTO public.recipes_2025_12_11_13_27 (title, description, ingredients, instructions, prep_time_minutes, cook_time_minutes, servings, difficulty_level, image_url, nutrition_info, tags, is_published) VALUES
('Post-Workout Recovery Smoothie', 'A nutrient-dense smoothie designed to optimize recovery after intense training sessions. Packed with protein, carbohydrates, and anti-inflammatory compounds.', 
ARRAY['1 cup unsweetened almond milk', '1 scoop vanilla whey protein powder', '1 medium banana', '1/2 cup frozen mixed berries', '1 tbsp almond butter', '1 tsp honey', '1/2 cup ice cubes', '1 tsp chia seeds'],
ARRAY['Add almond milk to blender first for easier blending', 'Add protein powder and blend briefly to avoid clumping', 'Add banana, berries, almond butter, and honey', 'Blend on high speed for 60-90 seconds until smooth', 'Add ice cubes and blend for additional 30 seconds', 'Pour into glass and top with chia seeds', 'Serve immediately for best taste and texture'],
5, 0, 1, 'easy', '/images/recovery-smoothie.jpg',
'{"calories": 320, "protein": "28g", "carbs": "35g", "fat": "8g", "fiber": "6g", "sugar": "24g"}'::jsonb,
ARRAY['smoothie', 'post-workout', 'recovery', 'protein', 'quick'], true),

('High-Protein Quinoa Power Bowl', 'A complete meal featuring quinoa, lean protein, and colorful vegetables. Perfect for meal prep and provides sustained energy for active individuals.',
ARRAY['1 cup cooked quinoa', '4 oz grilled chicken breast, sliced', '1/2 cup black beans, rinsed', '1/4 avocado, sliced', '1/2 cup cherry tomatoes, halved', '1/4 cup corn kernels', '2 cups mixed greens', '2 tbsp pumpkin seeds', '2 tbsp olive oil', '1 tbsp lime juice', '1 tsp cumin', 'Salt and pepper to taste'],
ARRAY['Cook quinoa according to package directions and let cool', 'Season chicken breast with salt, pepper, and cumin', 'Grill chicken for 6-7 minutes per side until cooked through', 'Let chicken rest for 5 minutes, then slice', 'Prepare vegetables: halve tomatoes, slice avocado', 'Whisk together olive oil, lime juice, and seasonings for dressing', 'Arrange mixed greens in bowl as base', 'Top with quinoa, chicken, black beans, and vegetables', 'Drizzle with dressing and sprinkle with pumpkin seeds', 'Serve immediately or store in refrigerator for up to 3 days'],
15, 15, 2, 'medium', '/images/quinoa-power-bowl.jpg',
'{"calories": 485, "protein": "32g", "carbs": "42g", "fat": "18g", "fiber": "12g", "iron": "4mg"}'::jsonb,
ARRAY['quinoa', 'high-protein', 'meal prep', 'complete meal', 'healthy'], true),

('Energy Balls for Athletes', 'No-bake energy balls packed with natural ingredients to provide quick energy and sustained fuel for training sessions.',
ARRAY['1 cup old-fashioned oats', '1/2 cup natural peanut butter', '1/3 cup honey', '1/3 cup mini dark chocolate chips', '1/4 cup ground flaxseed', '2 tbsp chia seeds', '1 tsp vanilla extract', '1/4 tsp salt'],
ARRAY['Combine all ingredients in a large mixing bowl', 'Stir until mixture is well combined and holds together', 'If mixture is too dry, add 1-2 tbsp more peanut butter', 'If mixture is too wet, add more oats 1 tbsp at a time', 'Refrigerate mixture for 30 minutes to firm up', 'Roll mixture into 1-inch balls using your hands', 'Place balls on parchment-lined baking sheet', 'Refrigerate for additional 30 minutes to set', 'Store in airtight container in refrigerator for up to 1 week', 'Enjoy 1-2 balls as a pre-workout snack'],
10, 0, 20, 'easy', '/images/energy-balls.jpg',
'{"calories": 95, "protein": "3g", "carbs": "12g", "fat": "4g", "fiber": "2g", "per_serving": "1 ball"}'::jsonb,
ARRAY['snack', 'energy', 'no-bake', 'pre-workout', 'portable'], true),

('Lean Turkey and Sweet Potato Meal', 'A balanced meal combining lean protein with complex carbohydrates, perfect for muscle building and sustained energy.',
ARRAY['6 oz ground turkey (93% lean)', '2 medium sweet potatoes, cubed', '2 cups broccoli florets', '1 red bell pepper, sliced', '2 tbsp olive oil', '1 tsp garlic powder', '1 tsp paprika', '1/2 tsp oregano', '1/4 tsp black pepper', '1/2 tsp salt', '1 tbsp fresh parsley, chopped'],
ARRAY['Preheat oven to 425°F (220°C)', 'Wash and cube sweet potatoes into 1-inch pieces', 'Toss sweet potatoes with 1 tbsp olive oil and half the seasonings', 'Spread on baking sheet and roast for 20 minutes', 'Meanwhile, heat remaining oil in large skillet over medium-high heat', 'Add ground turkey and cook, breaking up with spoon, for 8-10 minutes', 'Season turkey with remaining spices during cooking', 'Steam broccoli and bell pepper for 4-5 minutes until tender-crisp', 'Check sweet potatoes - they should be fork-tender', 'Combine turkey, roasted sweet potatoes, and steamed vegetables', 'Garnish with fresh parsley and serve hot', 'Can be stored in refrigerator for up to 4 days'],
15, 25, 3, 'medium', '/images/turkey-sweet-potato-meal.jpg',
'{"calories": 380, "protein": "28g", "carbs": "35g", "fat": "12g", "fiber": "8g", "vitamin_a": "400% DV"}'::jsonb,
ARRAY['lean protein', 'sweet potato', 'meal prep', 'balanced meal', 'muscle building'], true);