create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  participant_number text unique,
  qr_code_value text unique,
  full_name text not null,
  nik text,
  birth_place text,
  birth_date date,
  gender text,
  address text,
  rw text,
  phone text,
  email text,
  school text,
  lomba_category_id uuid references public.event_categories_lomba(id) on delete set null,
  ktp_url text,
  kk_url text,
  photo_url text,
  payment_proof_url text,
  agreement_checked boolean not null default false,
  verification_status public.verification_status not null default 'pending',
  created_at timestamptz not null default now()
);
grant insert on public.registrations to anon;
grant select, insert, update, delete on public.registrations to authenticated;
grant all on public.registrations to service_role;
alter table public.registrations enable row level security;
create policy "registrations owner read" on public.registrations for select to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "registrations insert" on public.registrations for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "registrations owner update" on public.registrations for update to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid())) with check (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "registrations staff delete" on public.registrations for delete to authenticated using (public.is_staff(auth.uid()));

create sequence if not exists public.participant_seq;

create or replace function public.registrations_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.participant_number is null then
    new.participant_number := 'GENCB-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.participant_seq')::text, 4, '0');
  end if;
  if new.qr_code_value is null then
    new.qr_code_value := 'GENCB:' || replace(gen_random_uuid()::text,'-','');
  end if;
  return new;
end; $$;
create trigger registrations_before_insert before insert on public.registrations
  for each row execute function public.registrations_before_insert();

create or replace function public.sync_registered_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  target uuid := coalesce(new.event_id, old.event_id);
begin
  update public.events e
     set registered_count = (select count(*) from public.registrations r where r.event_id = target)
   where e.id = target;
  update public.events e
     set status = 'closed'
   where e.id = target
     and e.status = 'open'
     and ((e.quota > 0 and e.registered_count >= e.quota)
       or (e.registration_end is not null and e.registration_end < now()));
  return null;
end; $$;
create trigger registrations_count_sync after insert or delete on public.registrations
  for each row execute function public.sync_registered_count();

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  check_in_time timestamptz,
  check_out_time timestamptz,
  checked_by uuid references auth.users(id) on delete set null,
  unique (registration_id)
);
grant select, insert, update, delete on public.attendance to authenticated;
grant all on public.attendance to service_role;
alter table public.attendance enable row level security;
create policy "attendance owner read" on public.attendance for select to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.registrations r where r.id = registration_id and r.user_id = auth.uid()));
create policy "attendance staff write" on public.attendance for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.certificate_templates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  design_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
grant select on public.certificate_templates to anon;
grant select, insert, update, delete on public.certificate_templates to authenticated;
grant all on public.certificate_templates to service_role;
alter table public.certificate_templates enable row level security;
create policy "templates read" on public.certificate_templates for select to anon, authenticated using (true);
create policy "templates staff write" on public.certificate_templates for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  template_id uuid references public.certificate_templates(id) on delete set null,
  certificate_number text unique,
  qr_verification_value text unique,
  file_url text,
  issued_at timestamptz not null default now()
);
grant select on public.certificates to anon;
grant select, insert, update, delete on public.certificates to authenticated;
grant all on public.certificates to service_role;
alter table public.certificates enable row level security;
create policy "certificates public verify" on public.certificates for select to anon, authenticated using (true);
create policy "certificates staff write" on public.certificates for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Pengumuman',
  content text,
  cover_image text,
  video_url text,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  status public.news_status not null default 'draft',
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
grant select on public.news to anon;
grant select, insert, update, delete on public.news to authenticated;
grant all on public.news to service_role;
alter table public.news enable row level security;
create policy "news public read" on public.news for select to anon, authenticated
  using (status = 'published' or public.is_staff(auth.uid()));
create policy "news staff write" on public.news for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text,
  comment_text text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert on public.news_comments to anon;
grant select, insert, update, delete on public.news_comments to authenticated;
grant all on public.news_comments to service_role;
alter table public.news_comments enable row level security;
create policy "comments read approved" on public.news_comments for select to anon, authenticated
  using (is_approved or public.is_staff(auth.uid()) or user_id = auth.uid());
create policy "comments insert" on public.news_comments for insert to anon, authenticated
  with check (is_approved = false and (user_id is null or user_id = auth.uid()));
create policy "comments staff manage" on public.news_comments for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "comments staff delete" on public.news_comments for delete to authenticated using (public.is_staff(auth.uid()));

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_id uuid references public.events(id) on delete set null,
  description text,
  cover_image text,
  created_at timestamptz not null default now()
);
grant select on public.gallery_albums to anon;
grant select, insert, update, delete on public.gallery_albums to authenticated;
grant all on public.gallery_albums to service_role;
alter table public.gallery_albums enable row level security;
create policy "albums read" on public.gallery_albums for select to anon, authenticated using (true);
create policy "albums staff write" on public.gallery_albums for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  media_type public.media_type not null default 'photo',
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);
grant select on public.gallery_media to anon;
grant select, insert, update, delete on public.gallery_media to authenticated;
grant all on public.gallery_media to service_role;
alter table public.gallery_media enable row level security;
create policy "media read" on public.gallery_media for select to anon, authenticated using (true);
create policy "media staff write" on public.gallery_media for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  category text,
  website_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.partners to anon;
grant select, insert, update, delete on public.partners to authenticated;
grant all on public.partners to service_role;
alter table public.partners enable row level security;
create policy "partners read" on public.partners for select to anon, authenticated using (true);
create policy "partners staff write" on public.partners for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.donation_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  target_amount numeric not null default 0,
  collected_amount numeric not null default 0,
  cover_image text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.donation_programs to anon;
grant select, insert, update, delete on public.donation_programs to authenticated;
grant all on public.donation_programs to service_role;
alter table public.donation_programs enable row level security;
create policy "donation programs read" on public.donation_programs for select to anon, authenticated using (true);
create policy "donation programs staff write" on public.donation_programs for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  donation_program_id uuid references public.donation_programs(id) on delete set null,
  donor_name text,
  amount numeric not null default 0,
  method public.donation_method not null default 'transfer',
  proof_url text,
  is_verified boolean not null default false,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.donations to anon;
grant select, insert, update, delete on public.donations to authenticated;
grant all on public.donations to service_role;
alter table public.donations enable row level security;
create policy "donations staff read" on public.donations for select to authenticated using (public.is_staff(auth.uid()));
create policy "donations insert" on public.donations for insert to anon, authenticated with check (is_verified = false);
create policy "donations staff write" on public.donations for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "donations staff delete" on public.donations for delete to authenticated using (public.is_staff(auth.uid()));

create or replace function public.sync_collected_amount()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  target uuid := coalesce(new.donation_program_id, old.donation_program_id);
begin
  if target is not null then
    update public.donation_programs p
       set collected_amount = (select coalesce(sum(d.amount),0) from public.donations d
                                where d.donation_program_id = target and d.is_verified)
     where p.id = target;
  end if;
  return null;
end; $$;
create trigger donations_amount_sync after insert or update or delete on public.donations
  for each row execute function public.sync_collected_amount();

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_or_affiliation text,
  photo_url text,
  message text not null,
  rating integer not null default 5,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "testimonials read" on public.testimonials for select to anon, authenticated
  using (is_published or public.is_staff(auth.uid()));
create policy "testimonials staff write" on public.testimonials for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.notifications_log (
  id uuid primary key default gen_random_uuid(),
  target_user_id uuid references auth.users(id) on delete cascade,
  channel public.notif_channel not null default 'email',
  title text not null,
  message text,
  status text not null default 'queued',
  sent_at timestamptz
);
grant select, insert, update, delete on public.notifications_log to authenticated;
grant all on public.notifications_log to service_role;
alter table public.notifications_log enable row level security;
create policy "notifications read" on public.notifications_log for select to authenticated
  using (target_user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "notifications staff write" on public.notifications_log for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "contact insert" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "contact staff read" on public.contact_messages for select to authenticated using (public.is_staff(auth.uid()));
create policy "contact staff write" on public.contact_messages for update to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "contact staff delete" on public.contact_messages for delete to authenticated using (public.is_staff(auth.uid()));