-- Singleton profile row holding the Info page's profile picture.
-- The boolean primary key + check constraint is a standard Postgres trick
-- to guarantee at most one row can ever exist.

create table if not exists profile (
  id boolean primary key default true,
  avatar_path text,
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id)
);

insert into profile (id) values (true) on conflict (id) do nothing;

alter table profile enable row level security;

create policy "Public read access on profile"
  on profile for select
  using (true);

create policy "Authenticated update on profile"
  on profile for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
