create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if new.email = 'emmanuel.henryhenri@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

-- If the account already exists, grant admin now
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role from auth.users
where email = 'emmanuel.henryhenri@gmail.com'
on conflict do nothing;