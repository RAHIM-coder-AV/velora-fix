-- Atomic order placement function for Velora
-- Ensures zero overselling using FOR UPDATE row locking and stock decrement check.

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
    reference,
    user_id,
    email,
    customer_name,
    phone,
    wilaya,
    commune,
    address,
    notes,
    payment_method,
    subtotal,
    shipping,
    total
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
    (payload->>'total')::int
  )
  returning id into v_order_id;

  for item in select * from jsonb_array_elements(payload->'items')
  loop
    select * into v_variant
    from public.product_variants
    where id = (item->>'variant_id')::uuid
    for update; -- قفل الصف حتى لا يتسابق زبونان على نفس القطعة

    if not found then
      raise exception 'VARIANT_NOT_FOUND';
    end if;

    update public.product_variants
    set stock = stock - (item->>'quantity')::int
    where id = v_variant.id and stock >= (item->>'quantity')::int;

    if not found then
      raise exception 'OUT_OF_STOCK: %', v_variant.sku; -- تراجع كامل للمعاملة
    end if;

    insert into public.inventory_movements (variant_id, delta, reason)
    values (v_variant.id, -(item->>'quantity')::int, 'order ' || v_reference);

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      name_fr,
      name_ar,
      size,
      color_fr,
      color_ar,
      image,
      unit_price,
      quantity
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
