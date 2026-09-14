-- Photography portfolio schema: series + photos, RLS, and public storage bucket.

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  year int not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references series (id) on delete cascade,
  storage_path text not null,
  thumb_path text not null,
  medium_path text not null,
  caption text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photos_series_id_idx on photos (series_id);

alter table series enable row level security;
alter table photos enable row level security;

-- Public (anonymous) read access.
create policy "Public read access on series"
  on series for select
  using (true);

create policy "Public read access on photos"
  on photos for select
  using (true);

-- Authenticated-only writes.
create policy "Authenticated insert on series"
  on series for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update on series"
  on series for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated delete on series"
  on series for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated insert on photos"
  on photos for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update on photos"
  on photos for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated delete on photos"
  on photos for delete
  using (auth.role() = 'authenticated');

-- Storage bucket for photo assets: public read, authenticated write.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "Public read access on photos bucket"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Authenticated insert on photos bucket"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Authenticated update on photos bucket"
  on storage.objects for update
  using (bucket_id = 'photos' and auth.role() = 'authenticated')
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Authenticated delete on photos bucket"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');
