-- V2 Schema: RBAC, Pricing Config, Portfolio Items
-- Run this in your Supabase SQL Editor

-- Profiles table for RBAC
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'client');
  RETURN NEW;
END;
$$ language plpgsql security definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Pricing Config table (admin-editable prices)
CREATE TABLE IF NOT EXISTS public.pricing_config (
  id text PRIMARY KEY,
  service text NOT NULL,
  label text NOT NULL,
  price_usd numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pricing" ON public.pricing_config
  FOR SELECT USING (true);

CREATE POLICY "Admins can update pricing" ON public.pricing_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed default pricing
INSERT INTO public.pricing_config (id, service, label, price_usd) VALUES
  ('design_logo', 'Graphic Design', 'Logo Design', 5),
  ('design_banner', 'Graphic Design', 'Banner Design', 5),
  ('design_poster', 'Graphic Design', 'Poster Design', 5),
  ('design_brand', 'Graphic Design', 'Brand Identity Package', 20),
  ('illus_half', 'Illustration', 'Half Body', 5),
  ('illus_full', 'Illustration', 'Full Body', 8),
  ('illus_render', 'Illustration', 'Full Render', 12),
  ('photo_package', 'Photography', 'Photography Package (2hrs)', 20),
  ('photo_raw', 'Photography', 'RAW Files Add-on', 5),
  ('photo_edit', 'Photography', 'Photo Editing (per complexity)', 1),
  ('video_low', 'Video', 'Video Base (Low)', 10),
  ('video_med', 'Video', 'Video Base (Medium)', 30),
  ('video_high', 'Video', 'Video Base (High)', 50),
  ('video_overtime', 'Video', 'Video Overtime (per min)', 2),
  ('web_base', 'Web Design', 'Web Design Base (per page)', 25),
  ('app_base', 'App Design', 'App Design Base (per flow)', 30)
ON CONFLICT (id) DO NOTHING;

-- Portfolio Items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  service_type text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published portfolio" ON public.portfolio_items
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage portfolio" ON public.portfolio_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
