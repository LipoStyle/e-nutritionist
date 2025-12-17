-- Phase 1 security hardening: admins table, helper function, and policy updates

-- 1. Admins table and RLS
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view their record" ON public.admins;
DROP POLICY IF EXISTS "Service role can insert admins" ON public.admins;
DROP POLICY IF EXISTS "Service role can delete admins" ON public.admins;

CREATE POLICY "Admins can view their record"
ON public.admins
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Service role can insert admins"
ON public.admins
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can delete admins"
ON public.admins
FOR DELETE
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update admins"
ON public.admins
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Helper to reuse admin checks in policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. Services (legacy)
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services_2025_12_11_13_27;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services_2025_12_11_13_27;

CREATE POLICY "Public can view active services (legacy)"
ON public.services_2025_12_11_13_27
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manage services (legacy)"
ON public.services_2025_12_11_13_27
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Services (new structure)
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services_new_2025_12_11_16_00;
DROP POLICY IF EXISTS "Anyone can manage services" ON public.services_new_2025_12_11_16_00;

CREATE POLICY "Public can view active services"
ON public.services_new_2025_12_11_16_00
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manage services"
ON public.services_new_2025_12_11_16_00
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view service translations" ON public.service_translations_2025_12_11_16_00;
DROP POLICY IF EXISTS "Anyone can manage service translations" ON public.service_translations_2025_12_11_16_00;

CREATE POLICY "Public can view service translations"
ON public.service_translations_2025_12_11_16_00
FOR SELECT
USING (true);

CREATE POLICY "Admins manage service translations"
ON public.service_translations_2025_12_11_16_00
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view service features" ON public.service_features_2025_12_11_16_00;
DROP POLICY IF EXISTS "Anyone can manage service features" ON public.service_features_2025_12_11_16_00;

CREATE POLICY "Public can view service features"
ON public.service_features_2025_12_11_16_00
FOR SELECT
USING (true);

CREATE POLICY "Admins manage service features"
ON public.service_features_2025_12_11_16_00
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Recipes (legacy)
DROP POLICY IF EXISTS "Anyone can view published recipes" ON public.recipes_2025_12_11_13_27;
DROP POLICY IF EXISTS "Authenticated users can manage recipes" ON public.recipes_2025_12_11_13_27;

CREATE POLICY "Public can view published recipes (legacy)"
ON public.recipes_2025_12_11_13_27
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins manage recipes (legacy)"
ON public.recipes_2025_12_11_13_27
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Recipes (new normalized structure)
DROP POLICY IF EXISTS "Anyone can view published recipes" ON public.recipes_2025_12_12_18_15;
DROP POLICY IF EXISTS "Anyone can manage recipes" ON public.recipes_2025_12_12_18_15;

CREATE POLICY "Public can view published recipes"
ON public.recipes_2025_12_12_18_15
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins manage recipes"
ON public.recipes_2025_12_12_18_15
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view recipe translations" ON public.recipe_translations_2025_12_12_18_15;
DROP POLICY IF EXISTS "Anyone can manage recipe translations" ON public.recipe_translations_2025_12_12_18_15;

CREATE POLICY "Public can view recipe translations"
ON public.recipe_translations_2025_12_12_18_15
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.recipes_2025_12_12_18_15 r
    WHERE r.id = recipe_id AND r.is_published = true
  )
);

CREATE POLICY "Admins manage recipe translations"
ON public.recipe_translations_2025_12_12_18_15
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view recipe ingredients" ON public.recipe_ingredients_2025_12_12_18_15;
DROP POLICY IF EXISTS "Anyone can manage recipe ingredients" ON public.recipe_ingredients_2025_12_12_18_15;

CREATE POLICY "Public can view recipe ingredients"
ON public.recipe_ingredients_2025_12_12_18_15
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.recipes_2025_12_12_18_15 r
    WHERE r.id = recipe_id AND r.is_published = true
  )
);

CREATE POLICY "Admins manage recipe ingredients"
ON public.recipe_ingredients_2025_12_12_18_15
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view recipe instructions" ON public.recipe_instructions_2025_12_12_18_15;
DROP POLICY IF EXISTS "Anyone can manage recipe instructions" ON public.recipe_instructions_2025_12_12_18_15;

CREATE POLICY "Public can view recipe instructions"
ON public.recipe_instructions_2025_12_12_18_15
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.recipes_2025_12_12_18_15 r
    WHERE r.id = recipe_id AND r.is_published = true
  )
);

CREATE POLICY "Admins manage recipe instructions"
ON public.recipe_instructions_2025_12_12_18_15
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view recipe info" ON public.recipe_info_2025_12_12_18_15;
DROP POLICY IF EXISTS "Anyone can manage recipe info" ON public.recipe_info_2025_12_12_18_15;

CREATE POLICY "Public can view recipe info"
ON public.recipe_info_2025_12_12_18_15
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.recipes_2025_12_12_18_15 r
    WHERE r.id = recipe_id AND r.is_published = true
  )
);

CREATE POLICY "Admins manage recipe info"
ON public.recipe_info_2025_12_12_18_15
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00;
DROP POLICY IF EXISTS "Anyone can insert nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00;
DROP POLICY IF EXISTS "Anyone can update nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00;
DROP POLICY IF EXISTS "Anyone can delete nutritional facts" ON public.recipe_nutritional_facts_2025_12_12_19_00;

CREATE POLICY "Public can view nutritional facts"
ON public.recipe_nutritional_facts_2025_12_12_19_00
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.recipes_2025_12_12_18_15 r
    WHERE r.id = recipe_id AND r.is_published = true
  )
);

CREATE POLICY "Admins manage nutritional facts"
ON public.recipe_nutritional_facts_2025_12_12_19_00
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. Hero slides and translations
DROP POLICY IF EXISTS "Anyone can view active slides" ON public.hero_slides_2025_12_11_15_30;
DROP POLICY IF EXISTS "Authenticated users can manage slides" ON public.hero_slides_2025_12_11_15_30;

CREATE POLICY "Public can view active slides"
ON public.hero_slides_2025_12_11_15_30
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manage slides"
ON public.hero_slides_2025_12_11_15_30
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view slide translations" ON public.slide_translations_2025_12_11_15_30;
DROP POLICY IF EXISTS "Authenticated users can manage slide translations" ON public.slide_translations_2025_12_11_15_30;

CREATE POLICY "Public can view slide translations"
ON public.slide_translations_2025_12_11_15_30
FOR SELECT
USING (true);

CREATE POLICY "Admins manage slide translations"
ON public.slide_translations_2025_12_11_15_30
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view website translations" ON public.website_translations_2025_12_11_15_30;
DROP POLICY IF EXISTS "Authenticated users can manage website translations" ON public.website_translations_2025_12_11_15_30;

CREATE POLICY "Public can view website translations"
ON public.website_translations_2025_12_11_15_30
FOR SELECT
USING (true);

CREATE POLICY "Admins manage website translations"
ON public.website_translations_2025_12_11_15_30
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Storage buckets
DROP POLICY IF EXISTS "Public can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload service images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update service images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete service images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view slide images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload slide images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update slide images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete slide images" ON storage.objects;

CREATE POLICY "Public can view recipe images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'recipe-images');

CREATE POLICY "Admins manage recipe images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'recipe-images' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'recipe-images' AND public.is_admin()
);

CREATE POLICY "Public can view service images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Admins manage service images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'service-images' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'service-images' AND public.is_admin()
);

CREATE POLICY "Public can view slide images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'slide-images');

CREATE POLICY "Admins manage slide images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'slide-images' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'slide-images' AND public.is_admin()
);
