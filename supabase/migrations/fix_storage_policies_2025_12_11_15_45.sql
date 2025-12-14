-- First, let's check if the bucket exists and recreate it if needed
DO $$
BEGIN
    -- Delete existing bucket if it exists
    DELETE FROM storage.buckets WHERE id = 'slide-images';
    
    -- Create the bucket again
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
    VALUES (
        'slide-images', 
        'slide-images', 
        true, 
        52428800, -- 50MB limit
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
END $$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view slide images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload slide images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update slide images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete slide images" ON storage.objects;

-- Create more permissive storage policies for testing
CREATE POLICY "Public can view slide images" ON storage.objects FOR SELECT USING (bucket_id = 'slide-images');

CREATE POLICY "Anyone can upload slide images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'slide-images' AND 
    (storage.foldername(name))[1] = 'slides'
);

CREATE POLICY "Anyone can update slide images" ON storage.objects FOR UPDATE USING (
    bucket_id = 'slide-images'
);

CREATE POLICY "Anyone can delete slide images" ON storage.objects FOR DELETE USING (
    bucket_id = 'slide-images'
);

-- Also update the hero_slides table policies to be more permissive for testing
DROP POLICY IF EXISTS "Authenticated users can manage slides" ON public.hero_slides_2025_12_11_15_30;
DROP POLICY IF EXISTS "Authenticated users can manage slide translations" ON public.slide_translations_2025_12_11_15_30;

-- More permissive policies for testing
CREATE POLICY "Anyone can manage slides" ON public.hero_slides_2025_12_11_15_30 FOR ALL USING (true);
CREATE POLICY "Anyone can manage slide translations" ON public.slide_translations_2025_12_11_15_30 FOR ALL USING (true);

-- Insert some sample data to test
INSERT INTO public.hero_slides_2025_12_11_15_30 (
    order_index,
    background_image_url,
    layer_opacity,
    layer_type,
    layer_direction,
    layer_color_1,
    layer_color_2,
    is_active
) VALUES (
    0,
    '/images/hero-slide-1_20251211_141900.png',
    0.8,
    'gradient_2',
    'horizontal',
    '#075056',
    '#ff5b04',
    true
) ON CONFLICT DO NOTHING;

-- Get the slide ID for translations
DO $$
DECLARE
    slide_uuid UUID;
BEGIN
    SELECT id INTO slide_uuid FROM public.hero_slides_2025_12_11_15_30 WHERE order_index = 0 LIMIT 1;
    
    IF slide_uuid IS NOT NULL THEN
        -- Insert translations for the sample slide
        INSERT INTO public.slide_translations_2025_12_11_15_30 (
            slide_id,
            language_code,
            h1_title,
            paragraph,
            primary_button_text,
            primary_button_url,
            secondary_button_text,
            secondary_button_url
        ) VALUES 
        (
            slide_uuid,
            'en',
            'Transform Your Health with Expert Nutrition',
            'Specialized in athletic nutrition, weight management, and performance optimization. Get personalized meal plans and professional guidance to achieve your health goals.',
            'Book Free Consultation',
            '/contact',
            'View Services',
            '/services'
        ),
        (
            slide_uuid,
            'es',
            'Transforma Tu Salud con Nutrición Experta',
            'Especializado en nutrición deportiva, control de peso y optimización del rendimiento. Obtén planes de comidas personalizados y orientación profesional para lograr tus objetivos de salud.',
            'Reservar Consulta Gratuita',
            '/contact',
            'Ver Servicios',
            '/services'
        ),
        (
            slide_uuid,
            'gr',
            'Μεταμορφώστε την Υγεία σας με Εξειδικευμένη Διατροφή',
            'Εξειδικευμένοι στην αθλητική διατροφή, τη διαχείριση βάρους και τη βελτιστοποίηση της απόδοσης. Αποκτήστε εξατομικευμένα προγράμματα διατροφής και επαγγελματική καθοδήγηση.',
            'Κλείστε Δωρεάν Συνάντηση',
            '/contact',
            'Δείτε Υπηρεσίες',
            '/services'
        )
        ON CONFLICT (slide_id, language_code) DO NOTHING;
    END IF;
END $$;