create type public.app_role as enum ('super_admin','admin','editor','panitia','peserta');
create type public.event_status as enum ('open','soon','ongoing','closed');
create type public.verification_status as enum ('pending','verified','rejected');
create type public.news_status as enum ('draft','published');
create type public.media_type as enum ('photo','video');
create type public.donation_method as enum ('transfer','qris');
create type public.notif_channel as enum ('email','whatsapp','push');

create table public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.users_profile to authenticated;
grant all on public.users_profile to service_role;
alter table public.users_profile enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','super_admin'))
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','super_admin','editor','panitia'))
$$;

create policy "profile readable by self and staff" on public.users_profile for select to authenticated
  using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "profile insert self" on public.users_profile for insert to authenticated with check (id = auth.uid());
create policy "profile update self or admin" on public.users_profile for update to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()));

create policy "roles readable by self and staff" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid()));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users_profile (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'peserta') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  target_text text,
  cover_image text,
  documents jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.programs to anon;
grant select, insert, update, delete on public.programs to authenticated;
grant all on public.programs to service_role;
alter table public.programs enable row level security;
create policy "programs public read" on public.programs for select to anon, authenticated using (is_published or public.is_staff(auth.uid()));
create policy "programs staff write" on public.programs for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Umum',
  description text,
  rundown jsonb not null default '[]'::jsonb,
  location_text text,
  location_lat double precision,
  location_lng double precision,
  poster_url text,
  proposal_doc_url text,
  guidebook_url text,
  quota integer not null default 0,
  registered_count integer not null default 0,
  registration_start timestamptz,
  registration_end timestamptz,
  event_date_start timestamptz,
  event_date_end timestamptz,
  status public.event_status not null default 'soon',
  price numeric,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
grant select on public.events to anon;
grant select, insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "events public read" on public.events for select to anon, authenticated using (true);
create policy "events staff write" on public.events for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.event_categories_lomba (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  requirements_text text
);
grant select on public.event_categories_lomba to anon;
grant select, insert, update, delete on public.event_categories_lomba to authenticated;
grant all on public.event_categories_lomba to service_role;
alter table public.event_categories_lomba enable row level security;
create policy "lomba public read" on public.event_categories_lomba for select to anon, authenticated using (true);
create policy "lomba staff write" on public.event_categories_lomba for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.event_committee (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_in_event text,
  unique (event_id, user_id)
);
grant select, insert, update, delete on public.event_committee to authenticated;
grant all on public.event_committee to service_role;
alter table public.event_committee enable row level security;
create policy "committee read" on public.event_committee for select to authenticated using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "committee admin write" on public.event_committee for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create or replace function public.is_committee(_user_id uuid, _event_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.event_committee where user_id = _user_id and event_id = _event_id)
$$;