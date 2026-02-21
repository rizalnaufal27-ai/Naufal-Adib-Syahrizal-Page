-- Add pricing_details to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS pricing_details JSONB;

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    service_type TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on portfolio_items
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone for portfolio_items (Public Dashboard needs this)
CREATE POLICY "Public Read Portfolio"
ON portfolio_items FOR SELECT
USING (true);

-- Allow Admin (Service Role) full access (handled by API, but strictly speaking we can leave RLS open if we want, but better closed for writes?)
-- Since we use Supabase Service Role in API, RLS is bypassed.
-- But if using client-side auth... we don't have auth.
-- So writes MUST go through API.

-- Fix Orders RLS if needed (but we are moving to API updates)
