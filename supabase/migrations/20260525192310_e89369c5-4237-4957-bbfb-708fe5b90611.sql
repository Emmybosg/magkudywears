
-- Fix search_path on trigger functions and lock them down
create or replace function public.set_updated_at()
returns trigger language plpgsql security definer set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, app_role) from public, anon;

-- Restrict object listing: only admins can list raw objects; public can still read individual files by URL
drop policy if exists "Public can view product images" on storage.objects;
create policy "Admins can list product images" on storage.objects
  for select to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));
