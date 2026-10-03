alter table public.products
  add column if not exists sku text,
  add column if not exists active boolean not null default true,
  add column if not exists offers jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_offers_array_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_offers_array_check
      check (jsonb_typeof(offers) = 'array');
  end if;
end;
$$;
