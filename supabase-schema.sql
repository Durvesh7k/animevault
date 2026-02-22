-- ============================================================
-- AnimeVault — Supabase Schema
-- Run in SQL Editor AFTER creating bucket "anime-posters"
-- via Dashboard → Storage → New bucket (set as Public)
-- ============================================================

-- 1. ANIME TABLE
create table if not exists public.anime (
  id          bigint generated always as identity primary key,
  name        text        not null,
  poster      text        default '',
  description text        default '',
  created_at  timestamptz default now() not null
);

-- 2. ROW LEVEL SECURITY — anime table
alter table public.anime enable row level security;

create policy "Public read access"
  on public.anime for select using (true);

create policy "Auth insert"
  on public.anime for insert to authenticated with check (true);

create policy "Auth update"
  on public.anime for update to authenticated using (true);

create policy "Auth delete"
  on public.anime for delete to authenticated using (true);

-- 3. ROW LEVEL SECURITY — storage (run after creating bucket in UI)
create policy "Public read posters"
  on storage.objects for select
  using (bucket_id = 'anime-posters');

create policy "Auth upload posters"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'anime-posters');

create policy "Auth update posters"
  on storage.objects for update to authenticated
  using (bucket_id = 'anime-posters');

create policy "Auth delete posters"
  on storage.objects for delete to authenticated
  using (bucket_id = 'anime-posters');
