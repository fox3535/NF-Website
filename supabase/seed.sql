-- seed.sql
-- Reference data only. Safe to run more than once (every insert is idempotent).
--
-- Contains NO vendor records, NO subscribers, NO stamps and NO monetary values.
-- Passport thresholds and benefit wording below are PROPOSED, not approved
-- (docs/platform-v1-plan.md section P.2). They live in data precisely so Chris
-- can change them later without touching a single vendor record.

-- ---------------------------------------------------------------------------
-- Passport milestones
-- ---------------------------------------------------------------------------
-- Benefit strings are written the way they must appear to a vendor: eligibility
-- and consideration, never a guarantee.
--
-- DELIBERATELY OMITTED: the "small one-time loyalty credit" mentioned against
-- Preferred Vendor in the plan. No monetary amount has been approved, so
-- nothing monetary is seeded here. Do not add a dollar figure to this file.

insert into public.milestones (threshold, name, benefits, display_order) values
  (
    0,
    'NF Vendor',
    array[
      'Passport membership with your lifetime NF history',
      'Progress tracking toward the next milestone'
    ],
    1
  ),
  (
    3,
    'Returning Vendor',
    array[
      'May submit table placement preferences. Preferences are not guarantees and NF retains final placement control',
      'Eligible to be considered for selected NF promotional opportunities'
    ],
    2
  ),
  (
    5,
    'Preferred Vendor',
    array[
      'Table selection access for selected NF events, from a designated pool of tables released by NF',
      'Eligible for NF Vendor Feature consideration',
      'Eligible for selected promotional and content opportunities'
    ],
    3
  ),
  (
    8,
    'Veteran Vendor',
    array[
      'Earlier table selection access where it is offered',
      'Stronger placement consideration',
      'Higher priority for selected NF content opportunities',
      'Higher priority for sponsor activation consideration',
      'Stronger multi show loyalty offers'
    ],
    4
  ),
  (
    12,
    'Legacy Vendor',
    array[
      'Legacy Vendor badge and status',
      'Strongest normal placement consideration',
      'Highest consideration for selective NF opportunities',
      'Occasional loyalty benefit'
    ],
    5
  )
on conflict (threshold) do nothing;

-- ---------------------------------------------------------------------------
-- Interests / vendor product categories
-- ---------------------------------------------------------------------------
-- Proposed list from docs/platform-v1-plan.md section A.2. Not final.

insert into public.interests (slug, label, display_order) values
  ('pokemon',          'Pokemon',              1),
  ('one-piece',        'One Piece',            2),
  ('sports-cards',     'Sports Cards',         3),
  ('other-tcgs',       'Other TCGs',           4),
  ('toys-figures',     'Toys and Figures',     5),
  ('anime-pop-culture','Anime and Pop Culture',6),
  ('comics',           'Comics',               7),
  ('art',              'Art',                  8),
  ('cosplay',          'Cosplay',              9)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Signup sources
-- ---------------------------------------------------------------------------
-- PROPOSED convention, not locked. Must be agreed before any QR signage is
-- printed, because a printed code cannot be corrected later.

insert into public.signup_sources (slug, label) values
  ('homepage',        'Homepage'),
  ('club-page',       'Club page'),
  ('expo-2026',       'Expo 2026 event page'),
  ('halloween-2026',  'Halloween 2026 event page'),
  ('expo-entry-qr',   'Expo 2026 entrance QR code'),
  ('expo-giveaway',   'Expo 2026 giveaway flow')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------
-- Thin mirror of src/lib/events.ts, matched by slug. The public site does NOT
-- read these rows; they exist so stamps and opportunities have a target.
-- Keep slugs identical to the static data or nothing will line up.

insert into public.events (slug, name, starts_on, ends_on, status) values
  ('expo-2026',      'Nostalgia Fest Expo',      date '2026-10-09', date '2026-10-11', 'upcoming'),
  ('halloween-2026', 'Nostalgia Fest Halloween', date '2026-10-31', date '2026-11-01', 'upcoming')
on conflict (slug) do nothing;
