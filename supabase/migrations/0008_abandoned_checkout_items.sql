alter table public.abandoned_checkouts
  add column if not exists items jsonb not null default '[]'::jsonb;

drop function if exists public.save_abandoned_checkout(
  uuid, text, text, text, text, integer, integer, boolean, text, text, text, text
);

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
  p_commune text default null,
  p_items jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
begin
  if p_product_id is null or length(p_product_id) > 100
    or p_product_name is null or length(p_product_name) not between 1 and 200
    or p_quantity not between 1 and 1000
    or p_value < 0
    or length(coalesce(p_size, '')) > 40
    or length(coalesce(p_color, '')) > 80
    or p_items is null
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_array_length(p_items) > 50
    or pg_column_size(p_items) > 65536
  then
    raise exception 'INVALID_CHECKOUT_DRAFT';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item) <> 'object'
      or length(coalesce(v_item->>'productId', '')) not between 1 and 100
      or length(coalesce(v_item->>'variantId', '')) not between 1 and 100
      or length(coalesce(v_item->>'size', '')) > 40
      or length(coalesce(v_item->>'image', '')) > 2000
      or coalesce((v_item->>'quantity')::integer, 0) not between 1 and 1000
      or coalesce((v_item->>'unitPrice')::integer, -1) < 0
    then
      raise exception 'INVALID_CHECKOUT_DRAFT_ITEM';
    end if;
  end loop;

  delete from public.abandoned_checkouts where expires_at < now();

  insert into public.abandoned_checkouts (
    session_id, product_id, product_name, size, color, quantity, value, items,
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
    p_items,
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
    items = excluded.items,
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

revoke all on function public.save_abandoned_checkout(
  uuid, text, text, text, text, integer, integer, boolean, text, text, text, text, jsonb
) from public;
grant execute on function public.save_abandoned_checkout(
  uuid, text, text, text, text, integer, integer, boolean, text, text, text, text, jsonb
) to anon, authenticated;
