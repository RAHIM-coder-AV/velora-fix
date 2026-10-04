alter table public.orders
  add column if not exists delivery_company text,
  add column if not exists tracking_code text,
  add column if not exists delivery_dispatched_at timestamptz,
  add column if not exists label_url text;
