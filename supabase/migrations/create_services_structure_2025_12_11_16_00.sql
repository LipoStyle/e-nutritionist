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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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