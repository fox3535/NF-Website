-- 0001_foundation.sql
-- Nostalgia Fest platform: extensions, shared enums, helper functions,
-- admin authorisation and the audit log.
--
-- Conventions used by every migration in this directory:
--
--   1. Row Level Security is enabled in the SAME migration that creates the
--      table, before any policy is written. A table can therefore never exist
--      in this database without RLS on it.
--   2. No policy means no access. Postgres RLS denies by default, so a table
--      with RLS enabled and zero policies is readable and writable only by
--      the service role (which bypasses RLS entirely). That is deliberate for
--      the NF Club tables in 0005.
--   3. SECURITY DEFINER functions set `search_path = ''` and schema-qualify
--      every reference, so a caller cannot shadow a table name and hijack the
--      function's elevated rights.

create extension if not exists citext;

-- ---------------------------------------------------------------------------
-- Shared enums
-- ---------------------------------------------------------------------------

-- Internal vendor standing. NEVER exposed to vendors or to the public.
create type public.vendor_standing as enum (
  'good_standing',
  'review_required',
  'restricted',
  'do_not_book'
);

-- A self-signed-up vendor starts unverified and at zero stamps. Historical
-- stamps are only ever added by staff against real completed bookings.
create type public.vendor_verification as enum (
  'pending_verification',
  'verified',
  'rejected'
);

create type public.event_status as enum (
  'upcoming',
  'completed',
  'cancelled'
);

-- 'booking'  = one fully completed NF event booking (the core Passport rule).
-- 'bonus'    = Passport Challenge reward, issued only after ALL qualifying
--              commitments are completed. Exempt from the one-per-event rule.
create type public.stamp_type as enum ('booking', 'bonus');

create type public.challenge_status as enum ('active', 'completed', 'voided');

create type public.opportunity_status as enum ('draft', 'active', 'closed');

create type public.submission_status as enum (
  'submitted',
  'shortlisted',
  'selected',
  'not_selected',
  'withdrawn'
);

create type public.subscriber_status as enum (
  'subscribed',
  'unsubscribed',
  'bounced',
  'complained'
);

create type public.consent_action as enum ('granted', 'withdrawn');

-- ---------------------------------------------------------------------------
-- Shared trigger helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attached to append-only tables (consent history, status history, audit log).
-- Compliance depends on being able to prove what was recorded and when, so
-- those rows must never be edited or removed after the fact.
create or replace function public.reject_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception
    '% is append only: % is not permitted on this table',
    tg_table_name, tg_op;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin authorisation
-- ---------------------------------------------------------------------------

-- Admin rights live in a table, never in a JWT claim the client could set.
create table public.admin_users (
  auth_user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

comment on table public.admin_users is
  'NF staff authorisation. Deliberately has no RLS policies: it is managed only
   via the service role or the Supabase dashboard, and is read by is_admin()
   which is SECURITY DEFINER. A vendor can never read or write this table.';

-- SECURITY DEFINER so a policy can ask "is this user an admin?" without
-- granting the caller read access to admin_users itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a where a.auth_user_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_auth_user_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_table text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_created_at_idx on public.audit_log (created_at desc);
create index audit_log_target_idx on public.audit_log (target_table, target_id);

alter table public.audit_log enable row level security;

create policy "audit_log_admin_read"
  on public.audit_log for select
  to authenticated
  using (public.is_admin());

-- Append only. Writes go through the service role in a server action.
create trigger audit_log_no_update
  before update on public.audit_log
  for each row execute function public.reject_mutation();

create trigger audit_log_no_delete
  before delete on public.audit_log
  for each row execute function public.reject_mutation();

comment on table public.audit_log is
  'Every mutating admin action writes a row here: stamp awards and voids,
   standing changes, opportunity lifecycle. Append only.';
