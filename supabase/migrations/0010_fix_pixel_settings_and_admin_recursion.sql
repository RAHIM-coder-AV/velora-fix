-- Migration 0010: Fix infinite recursion on profiles and allow saving pixel settings
-- Run this script in your Supabase SQL Editor if you experience "stack depth limit exceeded" errors.

-- 1. Fix recursive policies on public.profiles
drop policy if exists "own profile" on public.profiles;
create policy "own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "admin profiles" on public.profiles;
create policy "admin profiles"
  on public.profiles for all
  using (
    auth.jwt() ->> 'role' = 'service_role' or (auth.uid() = id)
  );

-- 2. Provide a reliable security definer RPC function to save pixel settings
create or replace function public.save_pixel_settings(
  p_meta_pixel_ids jsonb default '["","","","","",""]'::jsonb,
  p_meta_pixel_enabled jsonb default '[false,false,false,false,false,false]'::jsonb,
  p_tiktok_pixel_ids jsonb default '["","","",""]'::jsonb,
  p_tiktok_pixel_enabled jsonb default '[false,false,false,false]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.store_pixel_settings (
    id,
    meta_pixel_ids,
    meta_pixel_enabled,
    tiktok_pixel_ids,
    tiktok_pixel_enabled,
    updated_at
  )
  values (
    'default',
    coalesce(p_meta_pixel_ids, '["","","","","",""]'::jsonb),
    coalesce(p_meta_pixel_enabled, '[false,false,false,false,false,false]'::jsonb),
    coalesce(p_tiktok_pixel_ids, '["","","",""]'::jsonb),
    coalesce(p_tiktok_pixel_enabled, '[false,false,false,false]'::jsonb),
    now()
  )
  on conflict (id) do update set
    meta_pixel_ids = excluded.meta_pixel_ids,
    meta_pixel_enabled = excluded.meta_pixel_enabled,
    tiktok_pixel_ids = excluded.tiktok_pixel_ids,
    tiktok_pixel_enabled = excluded.tiktok_pixel_enabled,
    updated_at = now();
end;
$$;

revoke all on function public.save_pixel_settings(jsonb, jsonb, jsonb, jsonb) from public;
grant execute on function public.save_pixel_settings(jsonb, jsonb, jsonb, jsonb) to anon, authenticated;

-- 3. Ensure table policies and grants allow updating pixel settings
drop policy if exists "admin update pixel settings" on public.store_pixel_settings;
create policy "admin update pixel settings"
  on public.store_pixel_settings for update
  using (true)
  with check (true);

drop policy if exists "admin insert pixel settings" on public.store_pixel_settings;
create policy "admin insert pixel settings"
  on public.store_pixel_settings for insert
  with check (true);

grant select, insert, update on public.store_pixel_settings to anon, authenticated;
