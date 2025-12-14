-- Insert the 3-Month Physique Efficiency Intensive service
INSERT INTO public.services_new_2025_12_11_16_00 (
    slug, 
    price, 
    service_type, 
    duration_minutes, 
    is_active,
    image_url
) VALUES (
    '3-month-physique-efficiency-intensive',
    497.00,
    'paid_consultation',
    90,
    true,
    '/images/hero-nutritionist_20251211_133643.png'
);

-- Get the service ID for translations and features
DO $$
DECLARE
    service_id UUID;
BEGIN
    SELECT id INTO service_id FROM public.services_new_2025_12_11_16_00 WHERE slug = '3-month-physique-efficiency-intensive';
    
    -- Insert English translation
    INSERT INTO public.service_translations_2025_12_11_16_00 (
        service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords
    ) VALUES (
        service_id,
        'en',
        '3-Month Physique Efficiency Intensive',
        '12 weeks of dedicated 1-on-1 coaching to build your peak physique, achieve new performance levels, and gain nutritional knowledge to sustain results for life.',
        'Beyond the Plan: 12 weeks of dedicated 1-on-1 coaching to build your peak physique, achieve new levels of performance, and gain the nutritional knowledge to sustain it for life.

This is For You If...
• You have your "Physique Blueprint" from the Audit and want expert accountability to execute it flawlessly
• You''re tired of the "start-stop" cycle and are ready to build lasting habits with consistent, professional support
• You''re ready to make a serious investment in your health to finally achieve the elite results you''ve been working towards
• You''re ready to trade confusing myths and wishful thinking for a clear, scientific understanding of nutrition

This comprehensive 12-week program combines personalized nutrition planning with intensive coaching support to help you achieve and maintain your ideal physique.',
        '3-Month Physique Transformation Program | Elite Nutrition Coaching | e-Nutritionist',
        'Transform your physique in 12 weeks with dedicated 1-on-1 nutrition coaching. Customized plans, weekly check-ins, and ongoing support.',
        'physique transformation, 12 week program, nutrition coaching, body composition, elite fitness, personalized nutrition'
    );
    
    -- Insert Spanish translation
    INSERT INTO public.service_translations_2025_12_11_16_00 (
        service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords
    ) VALUES (
        service_id,
        'es',
        'Intensivo de Eficiencia Física de 3 Meses',
        '12 semanas de coaching dedicado 1-a-1 para construir tu físico máximo, alcanzar nuevos niveles de rendimiento y obtener conocimiento nutricional de por vida.',
        'Más Allá del Plan: 12 semanas de coaching dedicado 1-a-1 para construir tu físico máximo, alcanzar nuevos niveles de rendimiento y obtener el conocimiento nutricional para mantenerlo de por vida.

Esto es Para Ti Si...
• Tienes tu "Plano Físico" de la Auditoría y quieres responsabilidad experta para ejecutarlo perfectamente
• Estás cansado del ciclo "empezar-parar" y estás listo para construir hábitos duraderos con apoyo profesional consistente
• Estás listo para hacer una inversión seria en tu salud para finalmente lograr los resultados de elite que has estado buscando
• Estás listo para cambiar mitos confusos por una comprensión científica clara de la nutrición',
        'Programa de Transformación Física 3 Meses | Coaching Nutricional Elite | e-Nutritionist',
        'Transforma tu físico en 12 semanas con coaching nutricional dedicado 1-a-1. Planes personalizados y apoyo continuo.',
        'transformación física, programa 12 semanas, coaching nutricional, composición corporal, fitness elite'
    );
    
    -- Insert Greek translation
    INSERT INTO public.service_translations_2025_12_11_16_00 (
        service_id, language_code, title, summary, description, seo_title, seo_description, seo_keywords
    ) VALUES (
        service_id,
        'gr',
        'Εντατικό Πρόγραμμα Φυσικής Απόδοσης 3 Μηνών',
        '12 εβδομάδες αφοσιωμένης προπόνησης 1-προς-1 για να χτίσετε την κορυφαία σας φυσική κατάσταση και να αποκτήσετε διατροφική γνώση για μια ζωή.',
        'Πέρα από το Σχέδιο: 12 εβδομάδες αφοσιωμένης προπόνησης 1-προς-1 για να χτίσετε την κορυφαία σας φυσική κατάσταση, να επιτύχετε νέα επίπεδα απόδοσης και να αποκτήσετε τη διατροφική γνώση για να τη διατηρήσετε για μια ζωή.',
        'Πρόγραμμα Μεταμόρφωσης Σώματος 3 Μηνών | Coaching Διατροφής Elite | e-Nutritionist',
        'Μεταμορφώστε τη φυσική σας κατάσταση σε 12 εβδομάδες με αφοσιωμένο coaching διατροφής 1-προς-1.',
        'μεταμόρφωση σώματος, πρόγραμμα 12 εβδομάδων, coaching διατροφής, σύνθεση σώματος, fitness ελίτ'
    );
    
    -- Insert features for English
    INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index) VALUES
    (service_id, 'en', 'Fully customized nutrition plan, updated as you progress to ensure you never plateau', 0),
    (service_id, 'en', 'Weekly, in-depth check-ins via private shared document to track metrics and receive detailed feedback', 1),
    (service_id, 'en', 'Direct message support for real-time questions and accountability, Monday-Friday', 2),
    (service_id, 'en', 'Ongoing education on the "why" behind your plan to build knowledge for life', 3),
    (service_id, 'en', '12 weeks of dedicated 1-on-1 professional coaching', 4),
    (service_id, 'en', 'Progress tracking with detailed metrics analysis', 5),
    (service_id, 'en', 'Scientific approach to nutrition without myths or guesswork', 6),
    (service_id, 'en', 'Sustainable habit formation with expert accountability', 7);
    
    -- Insert features for Spanish
    INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index) VALUES
    (service_id, 'es', 'Plan de nutrición completamente personalizado, actualizado según tu progreso', 0),
    (service_id, 'es', 'Revisiones semanales profundas vía documento privado compartido', 1),
    (service_id, 'es', 'Soporte por mensaje directo para preguntas en tiempo real, lunes a viernes', 2),
    (service_id, 'es', 'Educación continua sobre el "por qué" detrás de tu plan', 3),
    (service_id, 'es', '12 semanas de coaching profesional dedicado 1-a-1', 4),
    (service_id, 'es', 'Seguimiento de progreso con análisis detallado de métricas', 5),
    (service_id, 'es', 'Enfoque científico de la nutrición sin mitos ni conjeturas', 6),
    (service_id, 'es', 'Formación de hábitos sostenibles con responsabilidad experta', 7);
    
    -- Insert features for Greek
    INSERT INTO public.service_features_2025_12_11_16_00 (service_id, language_code, feature_text, order_index) VALUES
    (service_id, 'gr', 'Πλήρως εξατομικευμένο σχέδιο διατροφής, ενημερωμένο καθώς προοδεύετε', 0),
    (service_id, 'gr', 'Εβδομαδιαίοι, εις βάθος έλεγχοι μέσω ιδιωτικού κοινόχρηστου εγγράφου', 1),
    (service_id, 'gr', 'Υποστήριξη άμεσων μηνυμάτων για ερωτήσεις σε πραγματικό χρόνο, Δευτέρα-Παρασκευή', 2),
    (service_id, 'gr', 'Συνεχής εκπαίδευση στο "γιατί" πίσω από το σχέδιό σας', 3),
    (service_id, 'gr', '12 εβδομάδες αφοσιωμένου επαγγελματικού coaching 1-προς-1', 4),
    (service_id, 'gr', 'Παρακολούθηση προόδου με λεπτομερή ανάλυση μετρήσεων', 5),
    (service_id, 'gr', 'Επιστημονική προσέγγιση στη διατροφή χωρίς μύθους ή εικασίες', 6),
    (service_id, 'gr', 'Διαμόρφωση βιώσιμων συνηθειών με εμπειρογνώμονα υπευθυνότητα', 7);
END $$;