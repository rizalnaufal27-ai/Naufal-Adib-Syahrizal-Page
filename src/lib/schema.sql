-- Create a table only if it doesn't exist
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number integer not null,
  service_type text not null,
  status text not null check (status in ('pending', 'processing', 'done', 'cancelled')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- Drop existing policies to avoid conflicts if re-running
drop policy if exists "Allow public read access" on public.orders;
drop policy if exists "Allow public insert/update/delete" on public.orders;

-- Create policy to allow anonymous read access (since dashboard is public)
create policy "Allow public read access"
  on public.orders for select
  using (true);

-- Create policy to allow specific users to insert/update/delete
-- For simplicity in this demo, we allow anon write if we trust the client-side password.
-- This is NOT SECURE FOR PRODUCTION but fits the current "password protected" client-side implementation.
create policy "Allow public insert/update/delete"
  on public.orders for all
  using (true)
  with check (true);
