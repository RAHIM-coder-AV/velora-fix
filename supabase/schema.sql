-- VELORA commerce schema for Supabase (PostgreSQL)
-- Run in the SQL editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  address text,
  wilaya text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_fr text not null,
  name_ar text not null,
  description_fr text not null default '',
  description_ar text not null default '',
  image text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_fr text not null,
  name_ar text not null,
  description_fr text not null,
  description_ar text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  price integer not null check (price >= 0),
  compare_at_price integer,
  featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_fr text not null default '',
  alt_ar text not null default '',
  position integer not null default 0
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique not null,
  size text not null,
  color_fr text not null,
  color_ar text not null,
  color_hex text not null,
  stock integer not null default 0 check (stock >= 0),
  price integer
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author text not null,
  rating integer not null check (rating between 1 and 5),
  comment_fr text not null default '',
  comment_ar text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  customer_name text not null,
  phone text not null,
  wilaya text not null,
  commune text not null,
  address text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_method text not null default 'cod',
  subtotal integer not null,
  shipping integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  name_fr text not null,
  name_ar text not null,
  size text not null,
  color_fr text not null,
  color_ar text not null,
  image text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists variants_product_idx on public.product_variants (product_id);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "public read categories" on public.categories for select using (true);
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "public read products" on public.products for select using (true);
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "public read images" on public.product_images for select using (true);
create policy "admin write images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

create policy "public read variants" on public.product_variants for select using (true);
create policy "admin write variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

create policy "public read reviews" on public.reviews for select using (true);
create policy "users insert reviews" on public.reviews for insert with check (auth.uid() is not null);

create policy "own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "admin profiles" on public.profiles for all using (public.is_admin());

create policy "own wishlist" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "insert orders" on public.orders for insert with check (true);
create policy "admin update orders" on public.orders for update using (public.is_admin());

create policy "order items via order" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "insert order items" on public.order_items for insert with check (true);

create policy "admin inventory" on public.inventory_movements for all using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
