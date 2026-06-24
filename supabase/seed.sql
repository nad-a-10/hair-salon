-- Placeholder seed data. Replace with real services as they're finalised.
-- Run after `0001_init.sql`.

insert into business_config (key, value) values
  ('clinic_hours', '{
    "mon":["09:00","19:00"],
    "tue":["09:00","19:00"],
    "wed":["09:00","19:00"],
    "thu":["09:00","19:00"],
    "fri":["09:00","19:00"],
    "sat":["09:00","19:00"],
    "sun":["11:00","17:00"]
  }'::jsonb),
  ('hold_window_minutes', '1440'::jsonb),
  ('owner_whatsapp_e164', '"+9613542197"'::jsonb),
  ('slot_granularity_minutes', '15'::jsonb)
on conflict (key) do nothing;

with cats as (
  insert into categories (name, slug, blurb, sort_order) values
    ('Facials',         'facials',       'Hydration, brightening, and skin rituals tailored to your needs.',     1),
    ('Lashes & Brows',  'lashes-brows',  'Soft, defined eyes — extensions, lifts, tints, and brow lamination.',  2),
    ('Nails',           'nails',         'Manicures, pedicures, and gel work in our calm corner.',                3),
    ('Body & Wellness', 'body',          'Massage, body scrubs, and quiet rituals to slow you down.',             4),
    ('Hair Treatments', 'hair',          'Scalp care, treatments, and gentle styling.',                            5),
    ('Makeup',          'makeup',        'Editorial, bridal, and event makeup by appointment.',                   6)
  on conflict (slug) do nothing
  returning id, slug
)
select 1;
-- Add `services` insert statements per the placeholder catalog as needed.
-- See src/data/catalog.ts for the canonical list while we run on placeholders.
