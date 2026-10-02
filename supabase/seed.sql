-- MelodyMind seed data for public.screen_time
-- Run AFTER schema.sql in Supabase -> SQL Editor

insert into public.screen_time (day, minutes, "limit", sort)
values
  ('Mon', 22, 45, 1),
  ('Tue', 35, 45, 2),
  ('Wed', 28, 45, 3),
  ('Thu', 41, 45, 4),
  ('Fri', 18, 45, 5),
  ('Sat', 52, 60, 6),
  ('Sun', 44, 60, 7)
on conflict (day) do update
set minutes = excluded.minutes,
    "limit" = excluded."limit",
    sort = excluded.sort;

-- Verify
select day, minutes, "limit", sort
from public.screen_time
order by sort asc;

