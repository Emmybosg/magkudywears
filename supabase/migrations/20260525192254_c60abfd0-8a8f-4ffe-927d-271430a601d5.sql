
-- Role enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create policy "Admins can view all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products" on public.products
  for select using (true);

create policy "Admins can insert products" on public.products
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products" on public.products
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete products" on public.products
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Storage
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "Admins can upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'));

-- Auto-assign first signup as admin, others as user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  user_count int;
begin
  select count(*) into user_count from public.user_roles;
  if user_count = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
