-- Canada Sleigh media admin MVP schema
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  title_lv text,
  title_en text,
  title_ru text,
  title_lt text,
  title_est text,
  alt_lv text,
  alt_en text,
  alt_ru text,
  alt_lt text,
  alt_est text,
  url text not null,
  cloudinary_public_id text,
  width integer,
  height integer,
  format text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_videos (
  id uuid primary key default gen_random_uuid(),
  title_lv text,
  title_en text,
  title_ru text,
  title_lt text,
  title_est text,
  description_lv text,
  description_en text,
  description_ru text,
  description_lt text,
  description_est text,
  video_url text not null,
  thumbnail_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_media_public_idx
  on public.site_media (section, is_active, sort_order, created_at);

create index if not exists site_videos_public_idx
  on public.site_videos (is_active, sort_order, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_media_updated_at on public.site_media;
create trigger set_site_media_updated_at
before update on public.site_media
for each row execute function public.set_updated_at();

drop trigger if exists set_site_videos_updated_at on public.site_videos;
create trigger set_site_videos_updated_at
before update on public.site_videos
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.site_media enable row level security;
alter table public.site_videos enable row level security;

drop policy if exists "Admin users can read own status" on public.admin_users;
create policy "Admin users can read own status"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can insert admin users" on public.admin_users;
create policy "Admins can insert admin users"
on public.admin_users
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update admin users" on public.admin_users;
create policy "Admins can update admin users"
on public.admin_users
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete admin users" on public.admin_users;
create policy "Admins can delete admin users"
on public.admin_users
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read active media" on public.site_media;
create policy "Public can read active media"
on public.site_media
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can read all media" on public.site_media;
create policy "Admins can read all media"
on public.site_media
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert media" on public.site_media;
create policy "Admins can insert media"
on public.site_media
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update media" on public.site_media;
create policy "Admins can update media"
on public.site_media
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete media" on public.site_media;
create policy "Admins can delete media"
on public.site_media
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read active videos" on public.site_videos;
create policy "Public can read active videos"
on public.site_videos
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can read all videos" on public.site_videos;
create policy "Admins can read all videos"
on public.site_videos
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert videos" on public.site_videos;
create policy "Admins can insert videos"
on public.site_videos
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update videos" on public.site_videos;
create policy "Admins can update videos"
on public.site_videos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete videos" on public.site_videos;
create policy "Admins can delete videos"
on public.site_videos
for delete
to authenticated
using (public.is_admin());

-- First admin user:
-- 1. Create the user in Supabase Authentication.
-- 2. Replace the email below and run it once.
--
-- insert into public.admin_users (user_id, email)
-- select id, email
-- from auth.users
-- where email = 'admin@example.com'
-- on conflict (user_id) do update set email = excluded.email;
