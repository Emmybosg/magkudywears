create table public.try_on_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text unique not null,
  garment_source text not null,
  mannequin_id text not null,
  pose text not null,
  image_path text not null,
  created_at timestamptz not null default now()
);

grant all on public.try_on_cache to service_role;

alter table public.try_on_cache enable row level security;

create policy "Public read try-on renders"
on storage.objects for select to anon
using (bucket_id = 'try-on');

create policy "Service writes try-on renders"
on storage.objects for insert to service_role
with check (bucket_id = 'try-on');