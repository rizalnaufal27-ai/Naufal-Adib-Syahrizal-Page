-- ===================================================
-- Master Schema – Consolidated (v1 + v2 + v4)
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- 1. Orders Table
-- ===================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number serial UNIQUE,
  service_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order detail columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_days integer;

-- Payment columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS gross_amount numeric NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS down_payment_amount numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS down_payment_status text DEFAULT 'unpaid'
  CHECK (down_payment_status IN ('unpaid', 'pending', 'paid'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS final_payment_amount numeric DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS final_payment_status text DEFAULT 'unpaid'
  CHECK (final_payment_status IN ('unpaid', 'pending', 'paid'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_type text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS transaction_id text;

-- Evidence and media
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS evidence_links jsonb DEFAULT '[]';

-- Private access token
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS uuid_token uuid DEFAULT gen_random_uuid() UNIQUE;

-- Chat enabled flag
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS chat_enabled boolean DEFAULT false;

-- v4: Pricing details
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pricing_details jsonb;

-- ===================================================
-- 2. Chat Messages Table
-- ===================================================

CREATE TABLE IF NOT EXISTS public.order_chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('customer', 'admin')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ===================================================
-- 3. Profiles Table (RBAC)
-- ===================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  full_name text,
  created_at timestamptz DEFAULT now()
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

-- ===================================================
-- 4. Pricing Config Table
-- ===================================================

CREATE TABLE IF NOT EXISTS public.pricing_config (
  id text PRIMARY KEY,
  service text NOT NULL,
  label text NOT NULL,
  price_usd numeric NOT NULL,
  updated_at timestamptz DEFAULT now()
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

-- ===================================================
-- 5. Portfolio Items Table
-- ===================================================

CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  service_type text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===================================================
-- 6. Row Level Security
-- ===================================================

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;
CREATE POLICY "Service role can manage orders" ON public.orders FOR ALL USING (true);

-- Chats
ALTER TABLE public.order_chats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view chats" ON public.order_chats;
CREATE POLICY "Public can view chats" ON public.order_chats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can insert chats" ON public.order_chats;
CREATE POLICY "Public can insert chats" ON public.order_chats FOR INSERT WITH CHECK (true);

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pricing
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read pricing" ON public.pricing_config;
CREATE POLICY "Anyone can read pricing" ON public.pricing_config FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can update pricing" ON public.pricing_config;
CREATE POLICY "Admins can update pricing" ON public.pricing_config FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Portfolio
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read published portfolio" ON public.portfolio_items;
CREATE POLICY "Anyone can read published portfolio" ON public.portfolio_items FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio_items;
CREATE POLICY "Admins can manage portfolio" ON public.portfolio_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Public Read Portfolio" ON public.portfolio_items;
CREATE POLICY "Public Read Portfolio" ON public.portfolio_items FOR SELECT USING (true);

-- ===================================================
-- 7. Indexes
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_orders_uuid_token ON public.orders(uuid_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_chats_order_id ON public.order_chats(order_id);

-- ===================================================
-- 8. Triggers
-- ===================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
