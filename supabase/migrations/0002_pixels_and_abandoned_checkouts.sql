alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (status in (
    'pending', 'pending_confirmation', 'confirmed', 'customer_confirmed',
    'processing', 'no_answer', 'postponed', 'busy', 'waiting_customer',
    'shipped', 'delivered', 'cancelled', 'customer_cancelled', 'fake',
    'duplicate', 'returned'
  ));

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
    p_session_id,
    p_product_id,
    p_product_name,
    coalesce(p_size, ''),
    coalesce(p_color, ''),
    p_quantity,
    p_value,
    coalesce(p_contact_consent, false),
    case when p_contact_consent then left(nullif(trim(p_customer_name), ''), 120) end,
    case
      when p_contact_consent and trim(coalesce(p_phone, '')) ~ '^\+?[0-9 ()-]{8,24}$'
      then trim(p_phone)
    end,
    case when p_contact_consent then left(nullif(trim(p_wilaya), ''), 100) end,
    case when p_contact_consent then left(nullif(trim(p_commune), ''), 100) end,
    now(),
    now() + interval '30 days'
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
