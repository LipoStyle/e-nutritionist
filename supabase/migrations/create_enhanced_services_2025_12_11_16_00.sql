-- Drop existing services table if it exists (we'll recreate with better structure)
DROP TABLE IF EXISTS public.services_2025_12_11_13_27 CASCADE;

-- Create new services table with enhanced structure
CREATE TABLE public.services_new_2025_12_11_16_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    service_type TEXT NOT NULL CHECK (service_type IN ('free_pdf', 'paid_pdf', 'free_consultation', 'paid_consultation')),
    duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service translations table
CREATE TABLE public.service_translations_2025_12_11_16_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services_new_2025_12_11_16_00(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL CHECK (char_length(summary) <= 200),
    description TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT CHECK (char_length(seo_description) <= 160),
    seo_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, language_code)
);

-- Create service features table
CREATE TABLE public.service_features_2025_12_11_16_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services_new_2025_12_11_16_00(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    feature_text TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, language_code, order_index)
);

-- Create indexes for better performance
CREATE INDEX idx_services_new_slug ON public.services_new_2025_12_11_16_00(slug);
CREATE INDEX idx_services_new_type ON public.services_new_2025_12_11_16_00(service_type);
CREATE INDEX idx_services_new_active ON public.services_new_2025_12_11_16_00(is_active);
CREATE INDEX idx_service_translations_service_lang ON public.service_translations_2025_12_11_16_00(service_id, language_code);
CREATE INDEX idx_service_features_service_lang ON public.service_features_2025_12_11_16_00(service_id, language_code);

-- Enable RLS
ALTER TABLE public.services_new_2025_12_11_16_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations_2025_12_11_16_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features_2025_12_11_16_00 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view active services" ON public.services_new_2025_12_11_16_00 FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can manage services" ON public.services_new_2025_12_11_16_00 FOR ALL USING (true);

CREATE POLICY "Anyone can view service translations" ON public.service_translations_2025_12_11_16_00 FOR SELECT USING (true);
CREATE POLICY "Anyone can manage service translations" ON public.service_translations_2025_12_11_16_00 FOR ALL USING (true);

CREATE POLICY "Anyone can view service features" ON public.service_features_2025_12_11_16_00 FOR SELECT USING (true);
CREATE POLICY "Anyone can manage service features" ON public.service_features_2025_12_11_16_00 FOR ALL USING (true);

-- Insert sample services with multilingual content
INSERT INTO public.services_new_2025_12_11_16_00 (slug, price, service_type, duration_minutes) VALUES
('athletic-nutrition-consultation', 150.00, 'paid_consultation', 60),
('weight-management-program', 200.00, 'paid_consultation', 90),
('nutrition-guide-pdf', 0.00, 'free_pdf', NULL),
('premium-meal-plans', 49.99, 'paid_pdf', NULL),
('free-consultation', 0.00, 'free_consultation', 30);

-- Insert English translations
INSERT INTO public.service_translations_2025_12_11_16_00 (service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords) 
SELECT 
    s.id,
    'en',
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Athletic Nutrition Consultation'
        WHEN 'weight-management-program' THEN 'Weight Management Program'
        WHEN 'nutrition-guide-pdf' THEN 'Free Nutrition Guide'
        WHEN 'premium-meal-plans' THEN 'Premium Meal Plans'
        WHEN 'free-consultation' THEN 'Free Initial Consultation'
    END,
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Personalized nutrition strategies for competitive athletes to optimize performance, recovery, and body composition.'
        WHEN 'weight-management-program' THEN 'Comprehensive weight management program with personalized meal plans and ongoing support for sustainable results.'
        WHEN 'nutrition-guide-pdf' THEN 'Complete beginner''s guide to healthy eating with practical tips, meal ideas, and nutrition fundamentals.'
        WHEN 'premium-meal-plans' THEN 'Professional meal plans designed by certified nutritionists for various goals and dietary preferences.'
        WHEN 'free-consultation' THEN 'Complimentary 30-minute consultation to discuss your nutrition goals and how we can help you achieve them.'
    END,
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Our Athletic Nutrition Consultation is designed specifically for competitive athletes who want to maximize their performance through optimal nutrition. During this comprehensive 60-minute session, we''ll analyze your current diet, training schedule, and performance goals to create a personalized nutrition strategy that enhances your athletic performance, speeds recovery, and helps you achieve your ideal body composition. Whether you''re preparing for competition or looking to break through performance plateaus, our evidence-based approach will give you the nutritional edge you need to excel in your sport.'
        WHEN 'weight-management-program' THEN 'Transform your relationship with food and achieve lasting weight management success with our comprehensive program. This 90-minute intensive session includes detailed body composition analysis, metabolic assessment, and creation of a personalized meal plan tailored to your lifestyle, preferences, and goals. We focus on sustainable habits rather than quick fixes, providing you with the tools and knowledge needed for long-term success. The program includes follow-up support and meal plan adjustments to ensure you stay on track toward your weight management goals.'
        WHEN 'nutrition-guide-pdf' THEN 'Start your healthy eating journey with our comprehensive free nutrition guide. This professionally designed PDF contains everything you need to understand the fundamentals of healthy nutrition, including macronutrient basics, portion control guidelines, meal timing strategies, and practical tips for grocery shopping and meal preparation. Perfect for beginners or anyone looking to refresh their nutrition knowledge with evidence-based information from certified nutrition professionals.'
        WHEN 'premium-meal-plans' THEN 'Take the guesswork out of healthy eating with our professionally designed premium meal plans. Created by certified nutritionists, these detailed plans include weekly menus, shopping lists, prep instructions, and nutritional breakdowns for various goals including weight loss, muscle gain, athletic performance, and general wellness. Each plan is designed to be practical, delicious, and sustainable, making healthy eating simple and enjoyable.'
        WHEN 'free-consultation' THEN 'Discover how personalized nutrition can transform your health and performance with our complimentary 30-minute consultation. During this session, we''ll discuss your current eating habits, health goals, and lifestyle to determine the best approach for your unique needs. This is a perfect opportunity to ask questions, learn about our services, and see if we''re the right fit to help you achieve your nutrition and wellness goals. No obligation, just valuable insights and professional guidance.'
    END,
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Athletic Nutrition Consultation | Sports Performance Nutrition | e-Nutritionist'
        WHEN 'weight-management-program' THEN 'Weight Management Program | Sustainable Weight Loss | e-Nutritionist'
        WHEN 'nutrition-guide-pdf' THEN 'Free Nutrition Guide PDF | Healthy Eating Basics | e-Nutritionist'
        WHEN 'premium-meal-plans' THEN 'Premium Meal Plans | Professional Nutrition Plans | e-Nutritionist'
        WHEN 'free-consultation' THEN 'Free Nutrition Consultation | Personalized Nutrition Advice | e-Nutritionist'
    END,
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Professional athletic nutrition consultation for competitive athletes. Optimize performance, recovery & body composition with personalized nutrition strategies.'
        WHEN 'weight-management-program' THEN 'Comprehensive weight management program with personalized meal plans. Sustainable weight loss and healthy lifestyle coaching by certified nutritionists.'
        WHEN 'nutrition-guide-pdf' THEN 'Free comprehensive nutrition guide PDF. Learn healthy eating basics, meal planning, and nutrition fundamentals from certified professionals.'
        WHEN 'premium-meal-plans' THEN 'Professional meal plans for weight loss, muscle gain & wellness. Created by certified nutritionists with shopping lists and prep instructions.'
        WHEN 'free-consultation' THEN 'Free 30-minute nutrition consultation. Discuss your health goals and discover personalized nutrition solutions with certified professionals.'
    END,
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'athletic nutrition, sports nutrition, performance nutrition, athlete diet, sports dietitian, competitive athletics'
        WHEN 'weight-management-program' THEN 'weight loss, weight management, sustainable diet, healthy lifestyle, nutrition coaching, meal planning'
        WHEN 'nutrition-guide-pdf' THEN 'nutrition guide, healthy eating, nutrition basics, free nutrition resources, meal planning guide'
        WHEN 'premium-meal-plans' THEN 'meal plans, nutrition plans, healthy recipes, meal prep, diet plans, nutritionist meal plans'
        WHEN 'free-consultation' THEN 'free consultation, nutrition consultation, dietitian consultation, nutrition advice, health assessment'
    END
FROM public.services_new_2025_12_11_16_00 s;

-- Insert Spanish translations
INSERT INTO public.service_translations_2025_12_11_16_00 (service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords) 
SELECT 
    s.id,
    'es',
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Consulta de Nutrición Deportiva'
        WHEN 'weight-management-program' THEN 'Programa de Control de Peso'
        WHEN 'nutrition-guide-pdf' THEN 'Guía Gratuita de Nutrición'
        WHEN 'premium-meal-plans' THEN 'Planes de Comidas Premium'
        WHEN 'free-consultation' THEN 'Consulta Inicial Gratuita'
    END,
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Estrategias nutricionales personalizadas para atletas competitivos para optimizar el rendimiento, recuperación y composición corporal.'
        WHEN 'weight-management-program' THEN 'Programa integral de control de peso con planes de comidas personalizados y apoyo continuo para resultados sostenibles.'
        WHEN 'nutrition-guide-pdf' THEN 'Guía completa para principiantes sobre alimentación saludable con consejos prácticos, ideas de comidas y fundamentos nutricionales.'
        WHEN 'premium-meal-plans' THEN 'Planes de comidas profesionales diseñados por nutricionistas certificados para varios objetivos y preferencias dietéticas.'
        WHEN 'free-consultation' THEN 'Consulta gratuita de 30 minutos para discutir tus objetivos nutricionales y cómo podemos ayudarte a alcanzarlos.'
    END,
    'Descripción en español...',
    'Título SEO en español',
    'Descripción SEO en español',
    'palabras clave en español'
FROM public.services_new_2025_12_11_16_00 s;

-- Insert Greek translations
INSERT INTO public.service_translations_2025_12_11_16_00 (service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords) 
SELECT 
    s.id,
    'gr',
    CASE s.slug
        WHEN 'athletic-nutrition-consultation' THEN 'Συμβουλευτική Αθλητικής Διατροφής'
        WHEN 'weight-management-program' THEN 'Πρόγραμμα Διαχείρισης Βάρους'
        WHEN 'nutrition-guide-pdf' THEN 'Δωρεάν Οδηγός Διατροφής'
        WHEN 'premium-meal-plans' THEN 'Premium Προγράμματα Γευμάτων'
        WHEN 'free-consultation' THEN 'Δωρεάν Αρχική Συνάντηση'
    END,
    'Περίληψη στα ελληνικά...',
    'Περιγραφή στα ελληνικά...',
    'Τίτλος SEO στα ελληνικά',
    'Περιγραφή SEO στα ελληνικά',
    'λέξεις κλειδιά στα ελληνικά'
FROM public.services_new_2025_12_11_16_00 s;

-- Insert sample features for services
INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index)
SELECT 
    s.id,
    'en',
    feature,
    ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY feature) - 1
FROM public.services_new_2025_12_11_16_00 s
CROSS JOIN (
    SELECT unnest(ARRAY[
        'Comprehensive nutritional assessment',
        'Personalized meal planning',
        'Performance optimization strategies',
        'Recovery nutrition protocols',
        'Supplement recommendations',
        'Follow-up support included'
    ]) as feature
    WHERE s.slug = 'athletic-nutrition-consultation'
    
    UNION ALL
    
    SELECT unnest(ARRAY[
        'Body composition analysis',
        'Metabolic rate assessment',
        'Customized meal plans',
        'Lifestyle integration strategies',
        'Progress tracking tools',
        '3-month follow-up support'
    ]) as feature
    WHERE s.slug = 'weight-management-program'
    
    UNION ALL
    
    SELECT unnest(ARRAY[
        'Nutrition fundamentals guide',
        'Meal planning templates',
        'Healthy recipe collection',
        'Shopping lists included',
        'Portion control guidelines',
        'Instant PDF download'
    ]) as feature
    WHERE s.slug = 'nutrition-guide-pdf'
    
    UNION ALL
    
    SELECT unnest(ARRAY[
        '4-week meal plans',
        'Shopping lists provided',
        'Prep instructions included',
        'Nutritional breakdowns',
        'Multiple dietary options',
        'Professional recipe collection'
    ]) as feature
    WHERE s.slug = 'premium-meal-plans'
    
    UNION ALL
    
    SELECT unnest(ARRAY[
        '30-minute consultation',
        'Goal assessment',
        'Personalized recommendations',
        'Service overview',
        'No obligation required',
        'Expert guidance included'
    ]) as feature
    WHERE s.slug = 'free-consultation'
) features;