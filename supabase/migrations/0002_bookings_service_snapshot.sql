-- The service catalog lives in application code (src/data/catalog.ts), not in
-- the database, so bookings can't reference a services row. Store the catalog
-- id as text and snapshot the service details onto each booking instead.

-- Drop the FK to services and switch service_id to a plain text catalog id
-- (e.g. "srv-nails-manicure").
alter table bookings
  drop constraint if exists bookings_service_id_fkey;

alter table bookings
  alter column service_id type text using service_id::text;

-- Snapshot of the service at the time of booking, so the owner-manage page
-- and history don't depend on a services table.
alter table bookings
  add column if not exists service_name text not null default '',
  add column if not exists service_price_cents int not null default 0,
  add column if not exists service_duration_minutes int not null default 0;
