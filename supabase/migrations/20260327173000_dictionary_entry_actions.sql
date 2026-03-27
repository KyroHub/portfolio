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

alter table public.entry_favorites enable row level security;
alter table public.entry_reports enable row level security;

drop policy if exists "Users can read their own entry favorites" on public.entry_favorites;
drop policy if exists "Users can insert their own entry favorites" on public.entry_favorites;
drop policy if exists "Users can delete their own entry favorites" on public.entry_favorites;
drop policy if exists "Admins can read all entry favorites" on public.entry_favorites;
drop policy if exists "Users can read their own entry reports" on public.entry_reports;
drop policy if exists "Users can insert their own entry reports" on public.entry_reports;
drop policy if exists "Admins can read all entry reports" on public.entry_reports;
drop policy if exists "Admins can update entry reports" on public.entry_reports;

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
