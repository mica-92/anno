-- Anno Tracker: single JSON-blob table holding the app's whole STATE object
-- (same shape it already keeps in localStorage), so it syncs across devices/browsers.
create table if not exists anno_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table anno_state enable row level security;

-- No per-user auth in this app (shared passphrase gate in front of it instead);
-- anon key is meant to be public, this just allows the one app to read/write its own row.
create policy "anno_state anon full access" on anno_state
  for all
  using (true)
  with check (true);
