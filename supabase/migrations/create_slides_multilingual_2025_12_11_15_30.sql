-- Create hero_slides table
CREATE TABLE public.hero_slides_2025_12_11_15_30 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_index INTEGER NOT NULL DEFAULT 0,
    background_image_url TEXT,
    layer_opacity DECIMAL(3,2) DEFAULT 0.7 CHECK (layer_opacity >= 0 AND layer_opacity <= 1),
    layer_type TEXT DEFAULT 'single' CHECK (layer_type IN ('single', 'gradient_2', 'gradient_3')),
    layer_direction TEXT DEFAULT 'horizontal' CHECK (layer_direction IN ('horizontal', 'vertical', 'radial')),
    layer_color_1 TEXT DEFAULT '#075056',
    layer_color_2 TEXT,
    layer_color_3 TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slide_translations table for multilingual content
CREATE TABLE public.slide_translations_2025_12_11_15_30 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slide_id UUID REFERENCES public.hero_slides_2025_12_11_15_30(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    h1_title TEXT NOT NULL,
    paragraph TEXT NOT NULL,
    primary_button_text TEXT NOT NULL,
    primary_button_url TEXT NOT NULL,
    secondary_button_text TEXT NOT NULL,
    secondary_button_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(slide_id, language_code)
);

-- Create website_translations table for general website content
CREATE TABLE public.website_translations_2025_12_11_15_30 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    translation_key TEXT NOT NULL,
    language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'gr')),
    translation_value TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(translation_key, language_code)
);

-- Create storage bucket for slide images
INSERT INTO storage.buckets (id, name, public) VALUES ('slide-images', 'slide-images', true);

-- Create RLS policies for hero_slides
ALTER TABLE public.hero_slides_2025_12_11_15_30 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active slides" ON public.hero_slides_2025_12_11_15_30 FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage slides" ON public.hero_slides_2025_12_11_15_30 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Create RLS policies for slide_translations
ALTER TABLE public.slide_translations_2025_12_11_15_30 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view slide translations" ON public.slide_translations_2025_12_11_15_30 FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage slide translations" ON public.slide_translations_2025_12_11_15_30 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Create RLS policies for website_translations
ALTER TABLE public.website_translations_2025_12_11_15_30 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view website translations" ON public.website_translations_2025_12_11_15_30 FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage website translations" ON public.website_translations_2025_12_11_15_30 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Create storage policy for slide images
CREATE POLICY "Anyone can view slide images" ON storage.objects FOR SELECT USING (bucket_id = 'slide-images');
CREATE POLICY "Authenticated users can upload slide images" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'slide-images' AND 
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);
CREATE POLICY "Authenticated users can update slide images" ON storage.objects FOR UPDATE USING (
    bucket_id = 'slide-images' AND 
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);
CREATE POLICY "Authenticated users can delete slide images" ON storage.objects FOR DELETE USING (
    bucket_id = 'slide-images' AND 
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Insert default website translations
INSERT INTO public.website_translations_2025_12_11_15_30 (translation_key, language_code, translation_value, category) VALUES
-- Navigation
('nav.home', 'en', 'Home', 'navigation'),
('nav.home', 'es', 'Inicio', 'navigation'),
('nav.home', 'gr', 'Αρχική', 'navigation'),
('nav.services', 'en', 'Services', 'navigation'),
('nav.services', 'es', 'Servicios', 'navigation'),
('nav.services', 'gr', 'Υπηρεσίες', 'navigation'),
('nav.blog', 'en', 'Blog', 'navigation'),
('nav.blog', 'es', 'Blog', 'navigation'),
('nav.blog', 'gr', 'Ιστολόγιο', 'navigation'),
('nav.recipes', 'en', 'Recipes', 'navigation'),
('nav.recipes', 'es', 'Recetas', 'navigation'),
('nav.recipes', 'gr', 'Συνταγές', 'navigation'),
('nav.about', 'en', 'About', 'navigation'),
('nav.about', 'es', 'Acerca de', 'navigation'),
('nav.about', 'gr', 'Σχετικά', 'navigation'),
('nav.contact', 'en', 'Contact', 'navigation'),
('nav.contact', 'es', 'Contacto', 'navigation'),
('nav.contact', 'gr', 'Επικοινωνία', 'navigation'),
-- Common buttons
('button.book_consultation', 'en', 'Book Consultation', 'buttons'),
('button.book_consultation', 'es', 'Reservar Consulta', 'buttons'),
('button.book_consultation', 'gr', 'Κλείστε Συνάντηση', 'buttons'),
-- Theme and language
('theme.light', 'en', 'Light', 'theme'),
('theme.light', 'es', 'Claro', 'theme'),
('theme.light', 'gr', 'Φωτεινό', 'theme'),
('theme.dark', 'en', 'Dark', 'theme'),
('theme.dark', 'es', 'Oscuro', 'theme'),
('theme.dark', 'gr', 'Σκοτεινό', 'theme');

-- Create indexes for better performance
CREATE INDEX idx_hero_slides_order ON public.hero_slides_2025_12_11_15_30(order_index);
CREATE INDEX idx_hero_slides_active ON public.hero_slides_2025_12_11_15_30(is_active);
CREATE INDEX idx_slide_translations_slide_lang ON public.slide_translations_2025_12_11_15_30(slide_id, language_code);
CREATE INDEX idx_website_translations_key_lang ON public.website_translations_2025_12_11_15_30(translation_key, language_code);