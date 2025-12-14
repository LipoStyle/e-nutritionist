-- Insert sample service
INSERT INTO public.services_new_2025_12_11_16_00 (
    slug, 
    price, 
    service_type, 
    duration_minutes, 
    is_active,
    image_url
) VALUES (
    'nutrition-consultation',
    75.00,
    'paid_consultation',
    60,
    true,
    '/images/hero-nutritionist_20251211_133643.png'
);

-- Get the service ID for translations and features
DO $$
DECLARE
    service_id UUID;
BEGIN
    SELECT id INTO service_id FROM public.services_new_2025_12_11_16_00 WHERE slug = 'nutrition-consultation';
    
    -- Insert English translation
    INSERT INTO public.service_translations_2025_12_11_16_00 (
        service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords
    ) VALUES (
        service_id,
        'en',
        'Personal Nutrition Consultation',
        'Get personalized nutrition advice from our certified nutritionist. Comprehensive assessment of your dietary needs, health goals, and lifestyle factors.',
        'Our Personal Nutrition Consultation is a comprehensive 60-minute session designed to provide you with personalized dietary guidance tailored to your unique needs and health goals. During this consultation, our certified nutritionist will conduct a thorough assessment of your current eating habits, review your health history, discuss your lifestyle and preferences, analyze your nutritional needs, and create a customized nutrition plan just for you.',
        'Personal Nutrition Consultation | Expert Dietary Advice | e-Nutritionist',
        'Get personalized nutrition advice from certified professionals. 60-minute consultation with custom meal plans and expert guidance.',
        'nutrition consultation, dietitian, personalized nutrition, meal planning, dietary advice, health goals'
    );
    
    -- Insert Spanish translation
    INSERT INTO public.service_translations_2025_12_11_16_00 (
        service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords
    ) VALUES (
        service_id,
        'es',
        'Consulta Nutricional Personal',
        'Obtén consejos nutricionales personalizados de nuestro nutricionista certificado. Evaluación integral de tus necesidades dietéticas y objetivos de salud.',
        'Nuestra Consulta Nutricional Personal es una sesión integral de 60 minutos diseñada para brindarte orientación dietética personalizada adaptada a tus necesidades únicas y objetivos de salud. Durante esta consulta, nuestro nutricionista certificado realizará una evaluación exhaustiva de tus hábitos alimentarios actuales, revisará tu historial de salud, discutirá tu estilo de vida y preferencias, y creará un plan de nutrición personalizado solo para ti.',
        'Consulta Nutricional Personal | Asesoramiento Dietético Experto | e-Nutritionist',
        'Obtén consejos nutricionales personalizados de profesionales certificados. Consulta de 60 minutos con planes personalizados.',
        'consulta nutricional, dietista, nutrición personalizada, planificación de comidas, consejos dietéticos'
    );
    
    -- Insert Greek translation
    INSERT INTO public.service_translations_2025_12_11_16_00 (
        service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords
    ) VALUES (
        service_id,
        'gr',
        'Προσωπική Διατροφική Συμβουλευτική',
        'Λάβετε εξατομικευμένες διατροφικές συμβουλές από τον πιστοποιημένο διατροφολόγο μας. Ολοκληρωμένη αξιολόγηση των διατροφικών σας αναγκών.',
        'Η Προσωπική Διατροφική Συμβουλευτική μας είναι μια ολοκληρωμένη συνεδρία 60 λεπτών σχεδιασμένη να σας παρέχει εξατομικευμένη διατροφική καθοδήγηση προσαρμοσμένη στις μοναδικές σας ανάγκες και στόχους υγείας. Κατά τη διάρκεια αυτής της συμβουλευτικής, ο πιστοποιημένος διατροφολόγος μας θα διεξάγει μια διεξοδική αξιολόγηση των τρεχόντων διατροφικών σας συνηθειών και θα δημιουργήσει ένα προσαρμοσμένο διατροφικό σχέδιο.',
        'Προσωπική Διατροφική Συμβουλευτική | Εξειδικευμένες Διατροφικές Συμβουλές | e-Nutritionist',
        'Λάβετε εξατομικευμένες διατροφικές συμβουλές από πιστοποιημένους επαγγελματίες. Συμβουλευτική 60 λεπτών με προσαρμοσμένα σχέδια.',
        'διατροφική συμβουλευτική, διατροφολόγος, εξατομικευμένη διατροφή, προγραμματισμός γευμάτων'
    );
    
    -- Insert features for English
    INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index) VALUES
    (service_id, 'en', 'Comprehensive 60-minute one-on-one consultation', 0),
    (service_id, 'en', 'Detailed assessment of current eating habits and health history', 1),
    (service_id, 'en', 'Personalized nutrition plan tailored to your goals', 2),
    (service_id, 'en', 'Practical meal planning and preparation guidance', 3),
    (service_id, 'en', 'Follow-up recommendations and resources', 4),
    (service_id, 'en', 'Written summary of recommendations and action plan', 5);
    
    -- Insert features for Spanish
    INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index) VALUES
    (service_id, 'es', 'Consulta integral de 60 minutos uno a uno', 0),
    (service_id, 'es', 'Evaluación detallada de hábitos alimentarios e historial de salud', 1),
    (service_id, 'es', 'Plan de nutrición personalizado adaptado a tus objetivos', 2),
    (service_id, 'es', 'Orientación práctica para planificación y preparación de comidas', 3),
    (service_id, 'es', 'Recomendaciones de seguimiento y recursos', 4),
    (service_id, 'es', 'Resumen escrito de recomendaciones y plan de acción', 5);
    
    -- Insert features for Greek
    INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index) VALUES
    (service_id, 'gr', 'Ολοκληρωμένη συμβουλευτική 60 λεπτών ένας προς έναν', 0),
    (service_id, 'gr', 'Λεπτομερής αξιολόγηση διατροφικών συνηθειών και ιστορικού υγείας', 1),
    (service_id, 'gr', 'Εξατομικευμένο διατροφικό σχέδιο προσαρμοσμένο στους στόχους σας', 2),
    (service_id, 'gr', 'Πρακτική καθοδήγηση για προγραμματισμό και προετοιμασία γευμάτων', 3),
    (service_id, 'gr', 'Συστάσεις παρακολούθησης και πόρους', 4),
    (service_id, 'gr', 'Γραπτή περίληψη συστάσεων και σχέδιο δράσης', 5);
END $$;