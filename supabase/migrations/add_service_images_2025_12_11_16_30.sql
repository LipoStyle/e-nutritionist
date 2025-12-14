-- Add image_url column to services table
ALTER TABLE public.services_new_2025_12_11_16_00 
ADD COLUMN image_url TEXT;

-- Create storage bucket for service images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'service-images', 
    'service-images', 
    true, 
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for service images
CREATE POLICY "Public can view service images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Anyone can upload service images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND 
    (storage.foldername(name))[1] = 'services'
);

CREATE POLICY "Anyone can update service images" ON storage.objects FOR UPDATE USING (
    bucket_id = 'service-images'
);

CREATE POLICY "Anyone can delete service images" ON storage.objects FOR DELETE USING (
    bucket_id = 'service-images'
);

-- Update existing services with placeholder images (optional)
UPDATE public.services_new_2025_12_11_16_00 
SET image_url = '/images/hero-nutritionist_20251211_133643.png'
WHERE image_url IS NULL;