drop policy if exists "admin delete orders" on public.orders;
create policy "admin delete orders"
  on public.orders for delete
  using (public.is_admin());

grant delete on public.orders to authenticated;
