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
  status text not null default 'pending' check (status in (
    'pending', 'pending_confirmation', 'confirmed', 'customer_confirmed',
    'processing', 'no_answer', 'postponed', 'busy', 'waiting_customer',
    'shipped', 'delivered', 'cancelled', 'customer_cancelled', 'fake',
    'duplicate', 'returned'
  )),
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

create table if not exists public.store_pixel_settings (
  id text primary key check (id = 'default'),
  meta_pixel_ids jsonb not null default '["","","","","",""]'::jsonb,
  meta_pixel_enabled jsonb not null default '[false,false,false,false,false,false]'::jsonb,
  tiktok_pixel_ids jsonb not null default '["","","",""]'::jsonb,
  tiktok_pixel_enabled jsonb not null default '[false,false,false,false]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.store_pixel_settings (id)
values ('default')
on conflict (id) do nothing;

alter table public.store_pixel_settings enable row level security;
create policy "public read pixel settings"
  on public.store_pixel_settings for select using (true);
create policy "admin insert pixel settings"
  on public.store_pixel_settings for insert with check (public.is_admin());
create policy "admin update pixel settings"
  on public.store_pixel_settings for update using (public.is_admin()) with check (public.is_admin());

create table if not exists public.abandoned_checkouts (
  session_id uuid primary key,
  product_id text not null,
  product_name text not null,
  size text not null default '',
  color text not null default '',
  quantity integer not null check (quantity between 1 and 1000),
  value integer not null check (value >= 0),
  contact_consent boolean not null default false,
  customer_name text,
  phone text,
  wilaya text,
  commune text,
  status text not null default 'open' check (status in ('open', 'converted')),
  order_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  constraint abandoned_contact_requires_consent check (
    contact_consent or (
      customer_name is null and phone is null and wilaya is null and commune is null
    )
  )
);

create index if not exists abandoned_checkouts_expiry_idx
  on public.abandoned_checkouts (expires_at);
create index if not exists abandoned_checkouts_updated_idx
  on public.abandoned_checkouts (updated_at desc);
alter table public.abandoned_checkouts enable row level security;
create policy "admin read abandoned checkouts"
  on public.abandoned_checkouts for select using (public.is_admin());
create policy "admin delete abandoned checkouts"
  on public.abandoned_checkouts for delete using (public.is_admin());

create or replace function public.save_abandoned_checkout(
  p_session_id uuid,
  p_product_id text,
  p_product_name text,
  p_size text,
  p_color text,
  p_quantity integer,
  p_value integer,
  p_contact_consent boolean default false,
  p_customer_name text default null,
  p_phone text default null,
  p_wilaya text default null,
  p_commune text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_product_id is null or length(p_product_id) > 100
    or p_product_name is null or length(p_product_name) not between 1 and 200
    or p_quantity not between 1 and 1000
    or p_value < 0
    or length(coalesce(p_size, '')) > 40
    or length(coalesce(p_color, '')) > 80
  then
    raise exception 'INVALID_CHECKOUT_DRAFT';
  end if;

  delete from public.abandoned_checkouts where expires_at < now();
  insert into public.abandoned_checkouts (
    session_id, product_id, product_name, size, color, quantity, value,
    contact_consent, customer_name, phone, wilaya, commune, updated_at, expires_at
  )
  values (
    p_session_id, p_product_id, p_product_name, coalesce(p_size, ''),
    coalesce(p_color, ''), p_quantity, p_value, coalesce(p_contact_consent, false),
    case when p_contact_consent then left(nullif(trim(p_customer_name), ''), 120) end,
    case
      when p_contact_consent and trim(coalesce(p_phone, '')) ~ '^\+?[0-9 ()-]{8,24}$'
      then trim(p_phone)
    end,
    case when p_contact_consent then left(nullif(trim(p_wilaya), ''), 100) end,
    case when p_contact_consent then left(nullif(trim(p_commune), ''), 100) end,
    now(), now() + interval '30 days'
  )
  on conflict (session_id) do update set
    product_id = excluded.product_id,
    product_name = excluded.product_name,
    size = excluded.size,
    color = excluded.color,
    quantity = excluded.quantity,
    value = excluded.value,
    contact_consent = excluded.contact_consent,
    customer_name = excluded.customer_name,
    phone = excluded.phone,
    wilaya = excluded.wilaya,
    commune = excluded.commune,
    updated_at = now(),
    expires_at = now() + interval '30 days'
  where public.abandoned_checkouts.status = 'open';
end;
$$;

create or replace function public.complete_abandoned_checkout(
  p_session_id uuid,
  p_order_reference text
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.abandoned_checkouts
  set status = 'converted',
      order_reference = left(p_order_reference, 80),
      updated_at = now()
  where session_id = p_session_id and status = 'open';
$$;

create or replace function public.place_order_with_checkout(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  checkout_session uuid;
begin
  result := public.place_order(payload);
  checkout_session := nullif(payload->>'checkout_session_id', '')::uuid;
  if checkout_session is not null then
    update public.abandoned_checkouts
    set status = 'converted',
        order_reference = left(result->>'reference', 80),
        updated_at = now()
    where session_id = checkout_session and status = 'open';
  end if;
  return result;
end;
$$;

revoke all on function public.save_abandoned_checkout(uuid, text, text, text, text, integer, integer, boolean, text, text, text, text) from public;
revoke all on function public.complete_abandoned_checkout(uuid, text) from public;
revoke all on function public.place_order_with_checkout(jsonb) from public;
grant execute on function public.save_abandoned_checkout(uuid, text, text, text, text, integer, integer, boolean, text, text, text, text) to anon, authenticated;
grant execute on function public.complete_abandoned_checkout(uuid, text) to anon, authenticated;
grant execute on function public.place_order_with_checkout(jsonb) to anon, authenticated;
