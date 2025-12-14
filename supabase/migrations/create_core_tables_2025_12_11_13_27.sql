-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create admin_users table to manage admin access
CREATE TABLE public.admin_users_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2),
    duration_minutes INTEGER,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE public.blogs_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    slug TEXT UNIQUE NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE public.recipes_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    servings INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    image_url TEXT,
    nutrition_info JSONB,
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.services_2025_12_11_13_27(id),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE public.subscribers_2025_12_11_13_27 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies

-- Admin users policies
ALTER TABLE public.admin_users_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users can view all admin records" ON public.admin_users_2025_12_11_13_27 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin users can insert their own record" ON public.admin_users_2025_12_11_13_27 FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Services policies (public read, admin write)
ALTER TABLE public.services_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.services_2025_12_11_13_27 FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage services" ON public.services_2025_12_11_13_27 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Blogs policies (public read published, admin write)
ALTER TABLE public.blogs_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published blogs" ON public.blogs_2025_12_11_13_27 FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage blogs" ON public.blogs_2025_12_11_13_27 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Recipes policies (public read published, admin write)
ALTER TABLE public.recipes_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published recipes" ON public.recipes_2025_12_11_13_27 FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage recipes" ON public.recipes_2025_12_11_13_27 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Bookings policies (admin can view all, clients can create)
ALTER TABLE public.bookings_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create bookings" ON public.bookings_2025_12_11_13_27 FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage bookings" ON public.bookings_2025_12_11_13_27 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Contact messages policies (anyone can create, admin can read)
ALTER TABLE public.contact_messages_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages_2025_12_11_13_27 FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view contact messages" ON public.contact_messages_2025_12_11_13_27 FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Subscribers policies (anyone can subscribe, admin can manage)
ALTER TABLE public.subscribers_2025_12_11_13_27 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.subscribers_2025_12_11_13_27 FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage subscribers" ON public.subscribers_2025_12_11_13_27 FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users_2025_12_11_13_27 WHERE user_id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX idx_blogs_slug ON public.blogs_2025_12_11_13_27(slug);
CREATE INDEX idx_blogs_published ON public.blogs_2025_12_11_13_27(is_published);
CREATE INDEX idx_recipes_published ON public.recipes_2025_12_11_13_27(is_published);
CREATE INDEX idx_bookings_date ON public.bookings_2025_12_11_13_27(appointment_date);
CREATE INDEX idx_bookings_status ON public.bookings_2025_12_11_13_27(status);