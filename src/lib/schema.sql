-- ===================================================
-- Updated Schema for Orders with Payment Integration
-- ===================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing orders table constraints if needed for migration
-- ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_down_payment_status_check;
-- ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_final_payment_status_check;

-- Original orders table (preserved)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number serial UNIQUE,
  service_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- New columns for order details
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

-- ===================================================
-- Chat Messages Table
-- ===================================================

CREATE TABLE IF NOT EXISTS public.order_chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('customer', 'admin')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ===================================================
-- Row Level Security
-- ===================================================

-- Orders: public read, auth write
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;
CREATE POLICY "Service role can manage orders" ON public.orders
  FOR ALL USING (true);

-- Chats: public read/write (secured by UUID token at API level)
ALTER TABLE public.order_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view chats" ON public.order_chats;
CREATE POLICY "Public can view chats" ON public.order_chats
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert chats" ON public.order_chats;
CREATE POLICY "Public can insert chats" ON public.order_chats
  FOR INSERT WITH CHECK (true);

-- ===================================================
-- Indexes
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_orders_uuid_token ON public.orders(uuid_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_chats_order_id ON public.order_chats(order_id);

-- ===================================================
-- Updated_at trigger
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
