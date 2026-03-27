create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  role text not null default 'student' check (role in ('student', 'admin')),
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_slug text not null,
  submitted_text text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  rating integer check (rating is null or rating between 1 and 5),
  feedback_text text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  lesson_slug text not null,
  started_at timestamptz not null default timezone('utc', now()),
  last_viewed_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create table if not exists public.section_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  lesson_slug text not null,
  section_id text not null,
  section_slug text not null,
  completed_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, section_id)
);

create table if not exists public.lesson_bookmarks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  lesson_slug text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, lesson_id)
);

create table if not exists public.lesson_notes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  lesson_slug text not null,
  note_text text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, lesson_id)
);

create table if not exists public.entry_favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_id text not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, entry_id)
);

create table if not exists public.entry_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_id text not null,
  entry_headword text not null,
  reason text not null check (
    reason in ('typo', 'translation', 'grammar', 'relation', 'other')
  ),
  commentary text not null check (
    char_length(commentary) between 10 and 5000
  ),
  status text not null default 'open' check (
    status in ('open', 'reviewed', 'resolved', 'dismissed')
  ),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists submissions_user_id_idx
  on public.submissions (user_id);

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);

create index if not exists submissions_lesson_slug_idx
  on public.submissions (lesson_slug);

create index if not exists lesson_progress_user_id_idx
  on public.lesson_progress (user_id);

create index if not exists lesson_progress_lesson_slug_idx
  on public.lesson_progress (lesson_slug);

create index if not exists lesson_progress_last_viewed_at_idx
  on public.lesson_progress (last_viewed_at desc);

create index if not exists section_progress_user_id_idx
  on public.section_progress (user_id);

create index if not exists section_progress_lesson_id_idx
  on public.section_progress (lesson_id);

create index if not exists section_progress_completed_at_idx
  on public.section_progress (completed_at desc);

create index if not exists lesson_bookmarks_user_id_idx
  on public.lesson_bookmarks (user_id);

create index if not exists lesson_bookmarks_created_at_idx
  on public.lesson_bookmarks (created_at desc);

create index if not exists lesson_notes_user_id_idx
  on public.lesson_notes (user_id);

create index if not exists lesson_notes_updated_at_idx
  on public.lesson_notes (updated_at desc);

create index if not exists entry_favorites_user_id_idx
  on public.entry_favorites (user_id);

create index if not exists entry_favorites_created_at_idx
  on public.entry_favorites (created_at desc);

create index if not exists entry_favorites_entry_id_idx
  on public.entry_favorites (entry_id);

create index if not exists entry_reports_user_id_idx
  on public.entry_reports (user_id);

create index if not exists entry_reports_entry_id_idx
  on public.entry_reports (entry_id);

create index if not exists entry_reports_status_created_at_idx
  on public.entry_reports (status, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, full_name, avatar_url)
  values (
    new.id,
    new.email,
    'student',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    if not public.is_admin() then
      raise exception 'Security Breach: Unauthorized role change attempt';
    end if;
  end if;

  return new;
end;
$$;

grant execute on function public.is_admin() to anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists check_role_update on public.profiles;

create trigger check_role_update
before update on public.profiles
for each row execute function public.protect_profile_role();

insert into public.profiles (id, email, role, full_name, avatar_url)
select
  id,
  email,
  'student',
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update
  set public = excluded.public;

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.section_progress enable row level security;
alter table public.lesson_bookmarks enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.entry_favorites enable row level security;
alter table public.entry_reports enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can read their own submissions" on public.submissions;
drop policy if exists "Admins can read all submissions" on public.submissions;
drop policy if exists "Users can insert their own submissions" on public.submissions;
drop policy if exists "Admins can update submissions" on public.submissions;
drop policy if exists "Users can read their own lesson progress" on public.lesson_progress;
drop policy if exists "Users can insert their own lesson progress" on public.lesson_progress;
drop policy if exists "Users can update their own lesson progress" on public.lesson_progress;
drop policy if exists "Admins can read all lesson progress" on public.lesson_progress;
drop policy if exists "Users can read their own section progress" on public.section_progress;
drop policy if exists "Users can insert their own section progress" on public.section_progress;
drop policy if exists "Users can update their own section progress" on public.section_progress;
drop policy if exists "Users can delete their own section progress" on public.section_progress;
drop policy if exists "Admins can read all section progress" on public.section_progress;
drop policy if exists "Users can read their own lesson bookmarks" on public.lesson_bookmarks;
drop policy if exists "Users can insert their own lesson bookmarks" on public.lesson_bookmarks;
drop policy if exists "Users can delete their own lesson bookmarks" on public.lesson_bookmarks;
drop policy if exists "Admins can read all lesson bookmarks" on public.lesson_bookmarks;
drop policy if exists "Users can read their own lesson notes" on public.lesson_notes;
drop policy if exists "Users can insert their own lesson notes" on public.lesson_notes;
drop policy if exists "Users can update their own lesson notes" on public.lesson_notes;
drop policy if exists "Users can delete their own lesson notes" on public.lesson_notes;
drop policy if exists "Admins can read all lesson notes" on public.lesson_notes;
drop policy if exists "Users can read their own entry favorites" on public.entry_favorites;
drop policy if exists "Users can insert their own entry favorites" on public.entry_favorites;
drop policy if exists "Users can delete their own entry favorites" on public.entry_favorites;
drop policy if exists "Admins can read all entry favorites" on public.entry_favorites;
drop policy if exists "Users can read their own entry reports" on public.entry_reports;
drop policy if exists "Users can insert their own entry reports" on public.entry_reports;
drop policy if exists "Admins can read all entry reports" on public.entry_reports;
drop policy if exists "Admins can update entry reports" on public.entry_reports;
drop policy if exists "Avatars are publicly accessible." on storage.objects;
drop policy if exists "Users can upload their own avatar." on storage.objects;
drop policy if exists "Users can update their own avatar." on storage.objects;
drop policy if exists "Users can delete their own avatar." on storage.objects;
drop policy if exists "Users can read their own avatar objects" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read their own submissions"
on public.submissions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all submissions"
on public.submissions
for select
to authenticated
using (public.is_admin());

create policy "Users can insert their own submissions"
on public.submissions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can update submissions"
on public.submissions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read their own lesson progress"
on public.lesson_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own lesson progress"
on public.lesson_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own lesson progress"
on public.lesson_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Admins can read all lesson progress"
on public.lesson_progress
for select
to authenticated
using (public.is_admin());

create policy "Users can read their own section progress"
on public.section_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own section progress"
on public.section_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own section progress"
on public.section_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own section progress"
on public.section_progress
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all section progress"
on public.section_progress
for select
to authenticated
using (public.is_admin());

create policy "Users can read their own lesson bookmarks"
on public.lesson_bookmarks
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own lesson bookmarks"
on public.lesson_bookmarks
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own lesson bookmarks"
on public.lesson_bookmarks
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all lesson bookmarks"
on public.lesson_bookmarks
for select
to authenticated
using (public.is_admin());

create policy "Users can read their own lesson notes"
on public.lesson_notes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own lesson notes"
on public.lesson_notes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own lesson notes"
on public.lesson_notes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own lesson notes"
on public.lesson_notes
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all lesson notes"
on public.lesson_notes
for select
to authenticated
using (public.is_admin());

create policy "Users can read their own entry favorites"
on public.entry_favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own entry favorites"
on public.entry_favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own entry favorites"
on public.entry_favorites
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Admins can read all entry favorites"
on public.entry_favorites
for select
to authenticated
using (public.is_admin());

create policy "Users can read their own entry reports"
on public.entry_reports
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own entry reports"
on public.entry_reports
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins can read all entry reports"
on public.entry_reports
for select
to authenticated
using (public.is_admin());

create policy "Admins can update entry reports"
on public.entry_reports
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read their own avatar objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
