-- Add column to store the Midtrans Order ID (e.g. DP-123-1715000000)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS midtrans_order_id text;
