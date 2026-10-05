create table if not exists public.storefront_configuration (
  id text primary key check (id = 'default'),
  configuration jsonb not null default '{}'::jsonb
    check (jsonb_typeof(configuration) = 'object' and pg_column_size(configuration) <= 131072),
  updated_at timestamptz not null default now()
);

alter table public.storefront_configuration enable row level security;

create policy "public read storefront configuration"
  on public.storefront_configuration for select using (true);
create policy "admin insert storefront configuration"
  on public.storefront_configuration for insert
  with check (public.is_admin());
create policy "admin update storefront configuration"
  on public.storefront_configuration for update
  using (public.is_admin()) with check (public.is_admin());

revoke all on public.storefront_configuration from anon, authenticated;
grant select on public.storefront_configuration to anon, authenticated;
grant insert, update on public.storefront_configuration to authenticated;
