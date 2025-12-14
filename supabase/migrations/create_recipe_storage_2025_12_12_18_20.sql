-- Create storage bucket for recipe images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'recipe-images', 
    'recipe-images', 
    true, 
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for recipe images
CREATE POLICY "Public can view recipe images" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Anyone can upload recipe images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'recipe-images' AND 
    (storage.foldername(name))[1] = 'recipes'
);

CREATE POLICY "Anyone can update recipe images" ON storage.objects FOR UPDATE USING (
    bucket_id = 'recipe-images'
);

CREATE POLICY "Anyone can delete recipe images" ON storage.objects FOR DELETE USING (
    bucket_id = 'recipe-images'
);