-- 0005_nf_club.sql
-- NF Club: subscribers, interests, signup sources and consent history.
--
-- SECURITY POSTURE FOR THIS ENTIRE FILE
--
-- Every table here has RLS enabled and DELIBERATELY NO POLICIES for `anon` or
-- `authenticated`. Postgres RLS denies by default, so with zero policies these
-- tables are unreachable by the browser-safe anon key and by any signed-in
-- vendor. Only the service role, which bypasses RLS and lives exclusively on
-- the server, can read or write them.
--
-- That is the structural guarantee behind "NF Club subscriber data must never
-- become publicly queryable". It does not depend on a policy being written
-- correctly, on the UI hiding anything, or on anyone remembering a rule: there
-- is simply no grant for a client-side key to use.
--
-- NF Club signup will therefore run entirely through a Next.js Server Action
-- using the admin client. No Supabase client runs in the browser on the
-- marketing pages at all.
--
-- NOTE: no email is sent in this phase, and no email provider is selected.

-- ---------------------------------------------------------------------------
-- Signup sources
-- ---------------------------------------------------------------------------
-- A lookup table so source slugs stay canonical and a typo in a printed QR
-- code becomes a visible unknown rather than a silent new category.
--
-- The slug convention is PROPOSED and not locked. It must be agreed before any
-- signage is printed (docs/platform-v1-plan.md section P.2, item 11).

create table public.signup_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.signup_sources enable row level security;

-- ---------------------------------------------------------------------------
-- Subscribers
-- ---------------------------------------------------------------------------

create table public.club_subscribers (
  id uuid primary key default gen_random_uuid(),

  first_name text not null,

  -- citext gives case-insensitive uniqueness at the database level, so
  -- "Chris@x.com" and "chris@x.com" cannot become two subscribers. The server
  -- still trims and lowercases before writing; this is the backstop.
  email citext not null unique,

  status public.subscriber_status not null default 'subscribed',

  -- Set once at first signup and never overwritten, even when the same person
  -- signs up again at a later event.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Outbox marker for a future one-way push to whichever email provider is
  -- eventually chosen. Postgres stays the system of record for consent.
  provider_synced_at timestamptz,

  constraint club_subscribers_first_name_not_blank
    check (length(btrim(first_name)) > 0),
  constraint club_subscribers_email_shape
    check (position('@' in email) > 1)
);

create index club_subscribers_status_idx on public.club_subscribers (status);
create index club_subscribers_sync_idx
  on public.club_subscribers (provider_synced_at)
  where status = 'subscribed';

create trigger club_subscribers_set_updated_at
  before update on public.club_subscribers
  for each row execute function public.set_updated_at();

alter table public.club_subscribers enable row level security;

comment on table public.club_subscribers is
  'NF Club subscribers. RLS enabled with NO policies: unreachable by the anon
   key or any signed-in vendor. Service-role access only, from server code.
   Unsubscribing sets status and never deletes the row, because the record is
   needed as a suppression entry. Only status = subscribed is ever exported.';

comment on column public.club_subscribers.status is
  'subscribed | unsubscribed | bounced | complained. `complained` is terminal:
   never re-subscribe automatically on a new form signup, because a spam
   complaint is a stronger signal than a form tick.';

-- ---------------------------------------------------------------------------
-- Subscriber interests
-- ---------------------------------------------------------------------------
-- Many-to-many. A repeat signup MERGES interests rather than replacing them,
-- so a second signup never silently drops earlier selections. The primary key
-- makes that merge a plain idempotent upsert.

create table public.subscriber_interests (
  subscriber_id uuid not null
    references public.club_subscribers (id) on delete cascade,
  interest_id uuid not null
    references public.interests (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (subscriber_id, interest_id)
);

alter table public.subscriber_interests enable row level security;

-- ---------------------------------------------------------------------------
-- Consent history
-- ---------------------------------------------------------------------------
-- Consent is NOT a boolean on the subscriber row. CASL requires being able to
-- demonstrate consent, which means recording WHAT wording the person agreed
-- to, WHEN, and from WHERE. These rows are append only and are never edited or
-- deleted, enforced by trigger rather than by convention.

create table public.consent_events (
  id bigint generated always as identity primary key,
  subscriber_id uuid not null
    references public.club_subscribers (id) on delete cascade,

  action public.consent_action not null,

  -- What kind of consent. Kept as text so a future consent type (for example a
  -- separate vendor-newsletter consent) does not need an enum migration.
  consent_type text not null default 'email_marketing',

  -- The exact wording shown, plus a version identifier for it. Storing the
  -- text itself means a later edit to the form cannot retroactively change
  -- what a given person is recorded as having agreed to.
  consent_text text not null,
  consent_version text not null,

  -- Where the person was when they consented.
  source_slug text,

  -- Request metadata, captured as evidence of the consent action.
  ip_address inet,
  user_agent text,

  created_at timestamptz not null default now(),

  constraint consent_events_text_not_blank
    check (length(btrim(consent_text)) > 0),
  constraint consent_events_version_not_blank
    check (length(btrim(consent_version)) > 0)
);

create index consent_events_subscriber_idx
  on public.consent_events (subscriber_id, created_at desc);

alter table public.consent_events enable row level security;

create trigger consent_events_no_update
  before update on public.consent_events
  for each row execute function public.reject_mutation();

create trigger consent_events_no_delete
  before delete on public.consent_events
  for each row execute function public.reject_mutation();

comment on table public.consent_events is
  'Append-only consent history. Never represent consent as a boolean alone:
   this table is the evidence. Storing consent_text as well as consent_version
   means editing the signup form later cannot rewrite what someone agreed to.';

-- ---------------------------------------------------------------------------
-- Source touches
-- ---------------------------------------------------------------------------
-- One row per signup attempt, so a person who signs up on the homepage and
-- again at an event QR code shows both. The subscriber row keeps its original
-- created_at; this table carries the attribution history.

create table public.subscriber_source_touches (
  id bigint generated always as identity primary key,
  subscriber_id uuid not null
    references public.club_subscribers (id) on delete cascade,
  source_slug text not null,

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  created_at timestamptz not null default now()
);

create index subscriber_source_touches_subscriber_idx
  on public.subscriber_source_touches (subscriber_id, created_at desc);
create index subscriber_source_touches_source_idx
  on public.subscriber_source_touches (source_slug);

alter table public.subscriber_source_touches enable row level security;

comment on table public.subscriber_source_touches is
  'Append-only signup attribution. The slug is the primary dimension because it
   survives sharing, reprints and campaign renaming; UTM values ride alongside.';
