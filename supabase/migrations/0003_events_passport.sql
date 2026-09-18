-- 0003_events_passport.sql
-- Thin platform event mirror, Passport milestones, and Passport stamp history.
--
-- THE PUBLIC SITE DOES NOT READ THIS. src/lib/events.ts remains the source of
-- truth for everything the marketing pages render. public.events exists only so
-- stamps, challenges and opportunities have something to point at, and is
-- matched to the static data by `slug`. Do not move public event content here:
-- it would put a database call on the critical path of pages that are static
-- today, for zero attendee benefit.

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  status public.event_status not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_dates_ordered check (ends_on >= starts_on)
);

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

-- Any signed-in vendor can read events, because stamp history renders event
-- names. Nothing here is sensitive; it mirrors what is already public.
create policy "events_read"
  on public.events for select
  to authenticated
  using (true);

create policy "events_admin_write"
  on public.events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.events is
  'Thin mirror of src/lib/events.ts, keyed by slug. The public marketing site
   never queries this table.';

-- ---------------------------------------------------------------------------
-- Milestones
-- ---------------------------------------------------------------------------
-- Thresholds and benefit wording live in data, not in code, so they change
-- without a deploy and WITHOUT rewriting any vendor record. A vendor's tier is
-- always derived from their active stamp count at read time; it is never
-- copied onto the vendor row, which would drift the moment a threshold moved.

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  threshold integer not null unique,
  name text not null,
  benefits text[] not null default '{}',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint milestones_threshold_non_negative check (threshold >= 0)
);

alter table public.milestones enable row level security;

create policy "milestones_read"
  on public.milestones for select
  to authenticated
  using (true);

create policy "milestones_admin_write"
  on public.milestones for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.milestones is
  'Proposed Passport thresholds. Changing a threshold or a benefit string here
   re-derives every vendor tier automatically. Never seed a monetary amount:
   no credit value has been approved (docs/platform-v1-plan.md section P.2).';

-- ---------------------------------------------------------------------------
-- Passport stamps
-- ---------------------------------------------------------------------------

create table public.passport_stamps (
  id uuid primary key default gen_random_uuid(),
  vendor_profile_id uuid not null
    references public.vendor_profiles (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete restrict,
  stamp_type public.stamp_type not null default 'booking',

  awarded_at timestamptz not null default now(),
  awarded_by uuid references auth.users (id) on delete set null,
  note text,

  -- Correction model: a wrong stamp is voided, never deleted, so the history
  -- stays auditable the first time a vendor asks why their count changed.
  voided_at timestamptz,
  voided_by uuid references auth.users (id) on delete set null,
  void_reason text,

  created_at timestamptz not null default now(),

  -- A void is only a void if it says who did it and why.
  constraint passport_stamps_void_is_complete check (
    (voided_at is null and voided_by is null and void_reason is null)
    or (voided_at is not null and void_reason is not null
        and length(btrim(void_reason)) > 0)
  )
);

-- THE CORE RULE, enforced by the database rather than by application code:
-- one fully completed booking equals one stamp. A vendor cannot hold two
-- active booking stamps for the same event, so a second admin pass cannot
-- double stamp anyone. Voided stamps are excluded, so a correct stamp can be
-- re-issued after a mistaken one is voided. Bonus stamps are exempt: a
-- Passport Challenge reward is not tied to a single event's completion.
create unique index passport_stamps_one_active_booking_per_event
  on public.passport_stamps (vendor_profile_id, event_id)
  where stamp_type = 'booking' and voided_at is null;

create index passport_stamps_vendor_idx
  on public.passport_stamps (vendor_profile_id)
  where voided_at is null;

-- Stamps are awarded AFTER the event, never at booking time. Enforced in the
-- database because this is the rule most likely to be broken by a well-meaning
-- admin clicking early, and because it is the rule the whole Passport's
-- credibility rests on.
create or replace function public.enforce_stamp_awarded_after_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ends_on date;
  v_slug text;
begin
  -- Bonus stamps are Passport Challenge rewards, not per-event completions.
  if new.stamp_type <> 'booking' then
    return new;
  end if;

  select e.ends_on, e.slug into v_ends_on, v_slug
  from public.events e
  where e.id = new.event_id;

  if v_ends_on is null then
    raise exception 'Cannot award a booking stamp: event % not found', new.event_id;
  end if;

  if v_ends_on >= current_date then
    raise exception
      'Passport booking stamps are awarded after the event ends. Event "%" ends on %, today is %.',
      v_slug, v_ends_on, current_date;
  end if;

  return new;
end;
$$;

create trigger passport_stamps_after_event
  before insert on public.passport_stamps
  for each row execute function public.enforce_stamp_awarded_after_event();

alter table public.passport_stamps enable row level security;

-- A vendor sees its own ACTIVE stamps. Voided rows are admin-facing: showing a
-- vendor a struck-through stamp invites a support conversation rather than
-- preventing one.
create policy "passport_stamps_self_read_active"
  on public.passport_stamps for select
  to authenticated
  using (
    voided_at is null
    and exists (
      select 1 from public.vendor_profiles v
      where v.id = passport_stamps.vendor_profile_id
        and v.auth_user_id = auth.uid()
    )
  );

-- Admins read everything, including voided rows.
create policy "passport_stamps_admin_read"
  on public.passport_stamps for select
  to authenticated
  using (public.is_admin());

-- Deliberately NO insert, update or delete policy for `authenticated`.
-- Awarding and voiding are privileged server operations performed with the
-- service role, so a vendor can never write their own history even if a bug
-- exposed a write path in the UI.

comment on table public.passport_stamps is
  'Lifetime Passport history. Stamps never expire and are never deleted:
   corrections set voided_at / voided_by / void_reason and the row survives.
   No DELETE policy exists for any signed-in role.';

-- ---------------------------------------------------------------------------
-- Derived tier
-- ---------------------------------------------------------------------------

create or replace function public.vendor_active_stamp_count(p_vendor_profile_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.passport_stamps s
  where s.vendor_profile_id = p_vendor_profile_id
    and s.voided_at is null;
$$;

revoke execute on function public.vendor_active_stamp_count(uuid) from public;
grant execute on function public.vendor_active_stamp_count(uuid) to authenticated;

-- Tier is always computed, never stored. security_invoker means the view obeys
-- the caller's RLS: a vendor sees only their own row, an admin sees all.
create view public.vendor_passport_summary
with (security_invoker = true)
as
select
  v.id as vendor_profile_id,
  v.business_name,
  coalesce(active.stamp_count, 0) as stamp_count,
  current_tier.name as milestone_name,
  current_tier.threshold as milestone_threshold,
  next_tier.name as next_milestone_name,
  next_tier.threshold as next_milestone_threshold,
  case
    when next_tier.threshold is null then null
    else next_tier.threshold - coalesce(active.stamp_count, 0)
  end as stamps_to_next_milestone
from public.vendor_profiles v
left join lateral (
  select count(*)::integer as stamp_count
  from public.passport_stamps s
  where s.vendor_profile_id = v.id
    and s.voided_at is null
) active on true
left join lateral (
  select m.name, m.threshold
  from public.milestones m
  where m.threshold <= coalesce(active.stamp_count, 0)
  order by m.threshold desc
  limit 1
) current_tier on true
left join lateral (
  select m.name, m.threshold
  from public.milestones m
  where m.threshold > coalesce(active.stamp_count, 0)
  order by m.threshold asc
  limit 1
) next_tier on true;

comment on view public.vendor_passport_summary is
  'Derived Passport state: active stamp count, current milestone, and progress
   to the next one. security_invoker so it inherits RLS from the underlying
   tables. Nothing here is stored on the vendor row.';

-- ---------------------------------------------------------------------------
-- Passport Challenge (multi-show loyalty)
-- ---------------------------------------------------------------------------
-- The bonus stamp is issued only after ALL qualifying commitments complete.
-- Booking three and cancelling one does not qualify, so completion is an
-- explicit admin action rather than anything the vendor can trigger.

create table public.passport_challenges (
  id uuid primary key default gen_random_uuid(),
  vendor_profile_id uuid not null
    references public.vendor_profiles (id) on delete cascade,
  status public.challenge_status not null default 'active',
  created_by uuid references auth.users (id) on delete set null,
  completed_at timestamptz,
  voided_reason text,
  -- The bonus stamp this challenge produced, once completed.
  reward_stamp_id uuid references public.passport_stamps (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint passport_challenges_completed_has_timestamp check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  )
);

create trigger passport_challenges_set_updated_at
  before update on public.passport_challenges
  for each row execute function public.set_updated_at();

create table public.passport_challenge_events (
  challenge_id uuid not null
    references public.passport_challenges (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete restrict,
  primary key (challenge_id, event_id)
);

alter table public.passport_challenges enable row level security;
alter table public.passport_challenge_events enable row level security;

create policy "passport_challenges_self_read"
  on public.passport_challenges for select
  to authenticated
  using (
    exists (
      select 1 from public.vendor_profiles v
      where v.id = passport_challenges.vendor_profile_id
        and v.auth_user_id = auth.uid()
    )
  );

create policy "passport_challenges_admin_all"
  on public.passport_challenges for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "passport_challenge_events_self_read"
  on public.passport_challenge_events for select
  to authenticated
  using (
    exists (
      select 1
      from public.passport_challenges c
      join public.vendor_profiles v on v.id = c.vendor_profile_id
      where c.id = passport_challenge_events.challenge_id
        and v.auth_user_id = auth.uid()
    )
  );

create policy "passport_challenge_events_admin_all"
  on public.passport_challenge_events for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
