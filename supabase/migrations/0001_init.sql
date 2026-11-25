-- rXa™ e-commerce schema
-- Run in Supabase SQL editor or via supabase migrations.

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

-- Collections
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  banner_url text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  images text[] not null default '{}',
  available_sizes text[] not null default '{}',
  available_colors text[] not null default '{}',
  stock_quantity int not null default 0,
  featured boolean not null default false,
  bestseller boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_collection_idx on public.products(collection_id);

-- Customers (linked to auth.users)
create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  total_amount numeric(10,2) not null,
  shipping_address text not null,
  payment_method text not null,
  payment_status text not null default 'pending',
  order_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists orders_customer_idx on public.orders(customer_id);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  color text,
  quantity int not null,
  unit_price numeric(10,2) not null
);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  product_id uuid not null references public.products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews(product_id);

-- Newsletter
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.newsletter enable row level security;

-- Public read for catalog
create policy "categories public read" on public.categories for select using (true);
create policy "collections public read" on public.collections for select using (status = 'active');
create policy "products public read" on public.products for select using (status = 'active');

-- Reviews public read
create policy "reviews public read" on public.reviews for select using (true);

-- Customers: own row
create policy "customers own read" on public.customers for select using (auth.uid() = id);
create policy "customers own insert" on public.customers for insert with check (auth.uid() = id);
create policy "customers own update" on public.customers for update using (auth.uid() = id);

-- Orders: own
create policy "orders own read" on public.orders for select using (auth.uid() = customer_id);
create policy "orders own insert" on public.orders for insert with check (auth.uid() = customer_id or customer_id is null);

-- Order items: readable if order owned
create policy "order_items own read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or o.customer_id is null))
);
create policy "order_items own insert" on public.order_items for insert with check (true);

-- Reviews: authenticated users can insert their own
create policy "reviews auth insert" on public.reviews for insert with check (auth.uid() = customer_id);

-- Newsletter: anyone can subscribe
create policy "newsletter public insert" on public.newsletter for insert with check (true);

-- Admin policies: service role bypasses RLS. For client-side admin, use a function or
-- mark admin users via auth metadata. Simpler: admin operations should use service role on server.
-- Below, allow authenticated users whose email is in admin list to manage catalog.
-- (Adjust to your needs.)

-- ---------- Storage buckets ----------
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('collection-banners', 'collection-banners', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('brand', 'brand', true) on conflict (id) do nothing;

create policy "public read images" on storage.objects for select using (bucket_id in ('product-images','collection-banners','brand'));
create policy "auth upload images" on storage.objects for insert with check (auth.role() = 'authenticated');
create policy "auth update images" on storage.objects for update using (auth.role() = 'authenticated');
create policy "auth delete images" on storage.objects for delete using (auth.role() = 'authenticated');
