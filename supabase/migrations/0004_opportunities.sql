-- 0004_opportunities.sql
-- NF Opportunities and vendor expressions of interest.
--
-- Eligibility is not selection. Passport level and good standing decide who may
-- express interest; NF chooses the final participants. The schema reflects that:
-- a submission is an expression of interest with a status only staff can move.
--
-- No standby list, no queue position, no visible ranking.

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,

  -- Optional: some opportunities are tied to a show, some are not.
  event_id uuid references public.events (id) on delete set null,

  opens_at timestamptz,
  closes_at timestamptz,

  -- Eligibility gates. Compared against the DERIVED stamp count, so changing a
  -- milestone threshold re-derives eligibility with no data migration.
  min_stamp_threshold integer not null default 0,
  requires_good_standing boolean not null default true,

  status public.opportunity_status not null default 'draft',

  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint opportunities_window_ordered check (
    opens_at is null or closes_at is null or closes_at >= opens_at
  ),
  constraint opportunities_min_threshold_non_negative
    check (min_stamp_threshold >= 0)
);

create index opportunities_status_idx on public.opportunities (status);

create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

alter table public.opportunities enable row level security;

-- Vendors see active opportunities only. Drafts and closed ones stay internal,
-- which is what keeps the dashboard module from rendering when nothing is live.
create policy "opportunities_vendor_read_active"
  on public.opportunities for select
  to authenticated
  using (status = 'active');

create policy "opportunities_admin_all"
  on public.opportunities for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on table public.opportunities is
  'An NF Opportunity is a specific, time-boxed offer. The dashboard module must
   not render at all when no active opportunity exists: an empty rewards shelf
   makes a loyalty programme feel abandoned.';

-- ---------------------------------------------------------------------------
-- Expressions of interest
-- ---------------------------------------------------------------------------

create table public.opportunity_submissions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null
    references public.opportunities (id) on delete cascade,
  vendor_profile_id uuid not null
    references public.vendor_profiles (id) on delete cascade,
  note text,
  status public.submission_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One expression of interest per vendor per opportunity.
  unique (opportunity_id, vendor_profile_id)
);

create index opportunity_submissions_opportunity_idx
  on public.opportunity_submissions (opportunity_id);

create trigger opportunity_submissions_set_updated_at
  before update on public.opportunity_submissions
  for each row execute function public.set_updated_at();

alter table public.opportunity_submissions enable row level security;

-- A vendor sees only its own submission status, never how many others applied.
create policy "opportunity_submissions_self_read"
  on public.opportunity_submissions for select
  to authenticated
  using (
    exists (
      select 1 from public.vendor_profiles v
      where v.id = opportunity_submissions.vendor_profile_id
        and v.auth_user_id = auth.uid()
    )
  );

create policy "opportunity_submissions_admin_all"
  on public.opportunity_submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Deliberately NO vendor INSERT or UPDATE policy. Expressing interest runs
-- through a server action so eligibility (stamp count, standing, open window)
-- is checked server side rather than trusted from the client. Withdrawing is
-- the same path. Phase 5 builds it.

comment on table public.opportunity_submissions is
  'Vendor expressions of interest. Status is staff-controlled: submitted,
   shortlisted, selected, not_selected, withdrawn. Vendors read only their own
   row and never see other applicants or any ranking.';
