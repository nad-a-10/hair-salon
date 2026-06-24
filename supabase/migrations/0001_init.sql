-- Beauty clinic — initial schema
create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  blurb text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_cents int not null check (price_cents >= 0),
  duration_minutes int not null check (duration_minutes between 5 and 480),
  image_url text,
  -- bit 0 = Sun, bit 1 = Mon, ..., bit 6 = Sat. Default Mon-Sat = 0b1111110 = 126.
  weekday_mask smallint not null default 126,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

do $$ begin
  create type booking_status as enum (
    'pending', 'confirmed', 'denied', 'expired', 'cancelled'
  );
exception when duplicate_object then null; end $$;

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete restrict,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  notes text,
  scheduled_at timestamptz not null,
  ends_at timestamptz not null,
  status booking_status not null default 'pending',
  hold_expires_at timestamptz not null,
  owner_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create index if not exists bookings_active_window_idx
  on bookings (service_id, scheduled_at, ends_at)
  where status in ('pending', 'confirmed');

create table if not exists business_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table categories enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table business_config enable row level security;

drop policy if exists "categories readable" on categories;
create policy "categories readable" on categories for select using (true);

drop policy if exists "active services readable" on services;
create policy "active services readable" on services for select using (is_active);

drop policy if exists "config readable" on business_config;
create policy "config readable" on business_config for select using (true);

-- bookings: no anon access. Server Actions use the service role key.
