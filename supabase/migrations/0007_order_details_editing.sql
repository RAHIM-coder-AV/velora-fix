alter table public.orders
  add column if not exists is_stopdesk boolean not null default false;

create or replace function public.admin_update_order_details(
  p_order_id uuid,
  p_customer_name text,
  p_phone text,
  p_wilaya text,
  p_commune text,
  p_address text,
  p_is_stopdesk boolean,
  p_subtotal integer,
  p_shipping integer,
  p_total integer,
  p_items jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item jsonb;
  v_existing public.order_items%rowtype;
  v_old_variant public.product_variants%rowtype;
  v_new_variant public.product_variants%rowtype;
  v_variant_id uuid;
  v_item_count integer;
  v_updated_count integer := 0;
  v_size text;
  v_color_fr text;
  v_color_ar text;
begin
  if not public.is_admin() then
    raise exception 'ADMIN_REQUIRED';
  end if;
  if length(trim(coalesce(p_customer_name, ''))) = 0
     or length(trim(coalesce(p_phone, ''))) = 0
     or length(trim(coalesce(p_wilaya, ''))) = 0
     or length(trim(coalesce(p_commune, ''))) = 0
     or length(trim(coalesce(p_address, ''))) = 0
     or p_subtotal < 0 or p_shipping < 0 or p_total <> p_subtotal + p_shipping
     or p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'INVALID_ORDER_DETAILS';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;
  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;
  if p_subtotal <> v_order.subtotal then
    raise exception 'ORDER_SUBTOTAL_CANNOT_CHANGE';
  end if;
  if v_order.tracking_code is not null or v_order.delivery_dispatched_at is not null then
    raise exception 'ORDER_ALREADY_DISPATCHED';
  end if;

  select count(*) into v_item_count
  from public.order_items
  where order_id = p_order_id;
  if v_item_count <> jsonb_array_length(p_items) then
    raise exception 'ORDER_ITEMS_CHANGED';
  end if;
  if v_item_count <> (select count(distinct value->>'id') from jsonb_array_elements(p_items)) then
    raise exception 'ORDER_ITEMS_CHANGED';
  end if;

  update public.orders
  set customer_name = trim(p_customer_name),
      phone = trim(p_phone),
      wilaya = trim(p_wilaya),
      commune = trim(p_commune),
      address = trim(p_address),
      is_stopdesk = p_is_stopdesk,
      subtotal = p_subtotal,
      shipping = p_shipping,
      total = p_total
  where id = p_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select * into v_existing
    from public.order_items
    where id = (v_item->>'id')::uuid and order_id = p_order_id
    for update;
    if not found then
      raise exception 'ORDER_ITEM_NOT_FOUND';
    end if;
    if (v_item->>'quantity')::integer <> v_existing.quantity
       or (v_item->>'unit_price')::integer <> v_existing.unit_price then
      raise exception 'ORDER_ITEM_PRICE_OR_QUANTITY_CHANGED';
    end if;

    v_variant_id := nullif(v_item->>'variant_id', '')::uuid;
    v_size := coalesce(v_item->>'size', v_existing.size);
    v_color_fr := coalesce(v_item->>'color_fr', v_existing.color_fr);
    v_color_ar := coalesce(v_item->>'color_ar', v_existing.color_ar);

    if v_variant_id is distinct from v_existing.variant_id then
      if v_existing.variant_id is not null then
        select * into v_old_variant
        from public.product_variants
        where id = v_existing.variant_id
        for update;
        if found then
          update public.product_variants
          set stock = stock + v_existing.quantity
          where id = v_existing.variant_id;
          insert into public.inventory_movements (variant_id, delta, reason)
          values (v_existing.variant_id, v_existing.quantity, 'admin order edit: restore old variant');
        end if;
      end if;

      if v_variant_id is not null then
        select * into v_new_variant
        from public.product_variants
        where id = v_variant_id
        for update;
        if not found or v_new_variant.product_id is distinct from v_existing.product_id then
          raise exception 'VARIANT_NOT_FOUND';
        end if;
        if v_new_variant.stock < v_existing.quantity then
          raise exception 'OUT_OF_STOCK';
        end if;
        update public.product_variants
        set stock = stock - v_existing.quantity
        where id = v_variant_id;
        insert into public.inventory_movements (variant_id, delta, reason)
        values (v_variant_id, -v_existing.quantity, 'admin order edit: reserve new variant');
        v_size := v_new_variant.size;
        v_color_fr := v_new_variant.color_fr;
        v_color_ar := v_new_variant.color_ar;
      end if;
    elsif v_variant_id is not null then
      select * into v_new_variant
      from public.product_variants
      where id = v_variant_id;
      if not found then
        raise exception 'VARIANT_NOT_FOUND';
      end if;
      v_size := v_new_variant.size;
      v_color_fr := v_new_variant.color_fr;
      v_color_ar := v_new_variant.color_ar;
    end if;

    update public.order_items
    set variant_id = v_variant_id,
        size = v_size,
        color_fr = v_color_fr,
        color_ar = v_color_ar
    where id = v_existing.id;
    v_updated_count := v_updated_count + 1;
  end loop;

  if v_updated_count <> v_item_count then
    raise exception 'ORDER_ITEMS_CHANGED';
  end if;
end;
$$;

revoke all on function public.admin_update_order_details(uuid, text, text, text, text, text, boolean, integer, integer, integer, jsonb) from public, anon;
grant execute on function public.admin_update_order_details(uuid, text, text, text, text, text, boolean, integer, integer, integer, jsonb) to authenticated;

create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_reference text;
  item jsonb;
  v_variant public.product_variants%rowtype;
begin
  v_reference := 'VLR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.orders (
    reference, user_id, email, customer_name, phone, wilaya, commune, address,
    notes, payment_method, subtotal, shipping, total, is_stopdesk
  )
  values (
    v_reference,
    nullif(payload->>'user_id', '')::uuid,
    payload->>'email',
    payload->>'customer_name',
    payload->>'phone',
    payload->>'wilaya',
    payload->>'commune',
    payload->>'address',
    nullif(payload->>'notes', ''),
    coalesce(payload->>'payment_method', 'cod'),
    (payload->>'subtotal')::int,
    (payload->>'shipping')::int,
    (payload->>'total')::int,
    coalesce((payload->>'is_stopdesk')::boolean, false)
  )
  returning id into v_order_id;

  for item in select * from jsonb_array_elements(payload->'items')
  loop
    select * into v_variant
    from public.product_variants
    where id = (item->>'variant_id')::uuid
    for update;
    if not found then
      raise exception 'VARIANT_NOT_FOUND';
    end if;

    update public.product_variants
    set stock = stock - (item->>'quantity')::int
    where id = v_variant.id and stock >= (item->>'quantity')::int;
    if not found then
      raise exception 'OUT_OF_STOCK: %', v_variant.sku;
    end if;

    insert into public.inventory_movements (variant_id, delta, reason)
    values (v_variant.id, -(item->>'quantity')::int, 'order ' || v_reference);

    insert into public.order_items (
      order_id, product_id, variant_id, name_fr, name_ar, size, color_fr,
      color_ar, image, unit_price, quantity
    )
    values (
      v_order_id,
      nullif(item->>'product_id', '')::uuid,
      v_variant.id,
      item->>'name_fr',
      item->>'name_ar',
      item->>'size',
      item->>'color_fr',
      item->>'color_ar',
      item->>'image',
      (item->>'unit_price')::int,
      (item->>'quantity')::int
    );
  end loop;
  return jsonb_build_object('id', v_order_id, 'reference', v_reference);
end;
$$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
