-- Sawit Insight — skema Neon (Postgres)
-- Jalankan sekali via: npm run db:migrate

create table if not exists app_settings (
  key text primary key,
  value jsonb not null
);

create table if not exists estates (
  id text primary key,
  nama text not null,
  luas_tm numeric not null,
  ton numeric not null,
  ton_per_ha numeric not null,
  ach_budget numeric not null,
  kec_tk numeric not null,
  hke numeric not null,
  restan numeric not null
);

create table if not exists divisions (
  id text primary key,
  estate text not null,
  divisi text not null,
  luas_tm numeric not null,
  akp numeric not null,
  bjr numeric not null,
  rotasi_rencana numeric not null,
  kebutuhan numeric not null,
  tersedia numeric not null,
  hke numeric not null
);

create table if not exists monthly_trend (
  urutan int primary key,
  bulan text not null,
  aktual numeric,
  budget numeric not null,
  forecast numeric
);

create table if not exists forecast_table (
  urutan int primary key,
  bulan text not null,
  indeks_musiman numeric not null,
  janjang_rb numeric not null,
  bjr numeric not null,
  ton numeric not null,
  ton_per_ha numeric not null,
  vs_budget numeric
);

create table if not exists alerts (
  id serial primary key,
  urutan int not null,
  level text not null,
  kicker text not null,
  text text not null,
  detail text,
  link_label text not null,
  href text not null
);

create table if not exists uploads (
  id serial primary key,
  nama text not null,
  jenis text not null,
  periode text not null,
  baris int not null default 0,
  tanggal text not null,
  pengunggah text not null,
  status text not null default 'ok',
  blob_url text,
  created_at timestamptz not null default now()
);
