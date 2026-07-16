-- ============================================================
-- VoltLab Builds — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. PROFILES ---------------------------------------------------
-- Extends auth.users with app-specific fields (username, role, theme).
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'staff')),
  theme text not null default 'y2k' check (theme in ('y2k', 'midnight', 'obsidian', 'cyberlime', 'nightfall', 'slate', 'dusk', 'ocean', 'glacier', 'steel', 'aurora', 'sage', 'forest', 'meadow', 'terracotta', 'rosewood', 'solaris', 'citrus', 'coral', 'paper', 'blossom', 'ivory', 'plum', 'amethyst', 'icloud', 'icloud-dark')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up (Google OAuth).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    split_part(new.email, '@', 1),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PRODUCTS -----------------------------------------------------
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  category text not null default 'arduino' check (category in ('arduino', 'non-arduino', 'accessory')),
  stock integer not null default 0,
  image_url text,
  features text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "published products are public"
  on public.products for select
  using (is_published = true or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

create policy "staff can insert products"
  on public.products for insert
  with check (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

create policy "staff can update products"
  on public.products for update
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

create policy "staff can delete products"
  on public.products for delete
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

-- 3. ORDERS -------------------------------------------------------
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),
  total numeric(10,2) not null,
  delivery_charge numeric(10,2) not null default 0,
  report_fee numeric(10,2) not null default 0,
  project_report boolean not null default false,
  shipping_name text,
  shipping_address text,
  shipping_phone text,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "customers view own orders"
  on public.orders for select
  using (auth.uid() = user_id or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

create policy "customers create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "staff update orders"
  on public.orders for update
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

create policy "staff delete orders"
  on public.orders for delete
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  ));

-- 4. ORDER ITEMS ----------------------------------------------------
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null
);

alter table public.order_items enable row level security;

create policy "order items follow parent order"
  on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id
    and (o.user_id = auth.uid() or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'staff'
    ))
  ));

create policy "customers insert own order items"
  on public.order_items for insert
  with check (exists (
    select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
  ));

-- 5. STOCK MANAGEMENT -----------------------------------------------
-- Atomically decrements stock after a paid order. Floors at 0 so a race
-- between two near-simultaneous orders can't push stock negative.
create or replace function public.decrement_stock(p_product_id uuid, p_qty integer)
returns void as $$
begin
  update public.products
  set stock = greatest(stock - p_qty, 0)
  where id = p_product_id;
end;
$$ language plpgsql security definer;

-- 6. SEED DATA (matches the products already shown on your Instagram) -----
insert into public.products (name, slug, description, price, category, stock, image_url, features)
values
  ('Gas Leakage Detector', 'gas-leakage-detector', 'MQ-2 gas sensor with instant LCD + buzzer alert.', 499, 'arduino', 15, null, array['MQ-2 Gas Sensor','LCD Display','Buzzer & LED Alert']),
  ('Fire Detection System', 'fire-detection-system', 'Flame sensor triggers instant alert with LCD readout.', 449, 'arduino', 15, null, array['Flame Sensor','Instant Alert','LCD Display']),
  ('Touch Doorbell', 'touch-doorbell', 'Touch-activated doorbell with sound + LED indicator.', 299, 'non-arduino', 20, null, array['Touch Activated','Doorbell Sound','LED Indicator']),
  ('Rain Alarm', 'rain-alarm', 'Alerts you the moment it starts raining.', 279, 'non-arduino', 20, null, array['Rain Detection','Buzzer Alert','LED Indicator']),
  ('Water Level Indicator', 'water-level-indicator', 'Know your tank''s water level at a glance.', 349, 'arduino', 12, null, array['3 Level Indication','LED Display','Simple & Useful']),
  ('Clap Switch', 'clap-switch', 'Switch anything on or off with a clap.', 259, 'non-arduino', 18, null, array['Clap Activated','Relay Output']),
  ('LED Flasher', 'led-flasher', 'Continuously flashing LED circuit.', 199, 'non-arduino', 25, null, array['Continuous Flash','Adjustable Rate']),
  ('Police LED Flasher', 'police-led-flasher', 'Strobe light effect, red & blue alternating.', 229, 'non-arduino', 25, null, array['Strobe Effect','Red & Blue LEDs']),
  ('Digital Thermometer', 'digital-thermometer', 'Real-time temperature readout on LCD.', 399, 'arduino', 14, null, array['Real-time Reading','LCD Display']),
  ('Weather Station', 'weather-station', 'Multi-sensor weather station with LCD dashboard.', 599, 'arduino', 10, null, array['Temp + Humidity','LCD Dashboard','Expandable'])
on conflict (slug) do nothing;

-- 6. Make yourself staff after your first Google sign-in -------------
-- Run this manually once, replacing the email:
-- update public.profiles set role = 'staff' where id = (select id from auth.users where email = 'you@example.com');
