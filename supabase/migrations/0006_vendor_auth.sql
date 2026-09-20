-- 0006_vendor_auth.sql
-- Vendor Network authentication: bind a Supabase auth user to exactly one
-- APPROVED vendor profile, and make "approved" a database-enforced condition
-- rather than an application check.
--
-- Two additions, both minimal:
--
--   1. vendor_profiles.signin_email, the staff-controlled allow-list address
--      that may claim a profile by magic link.
--   2. public.current_vendor_profile_id(), the single definition of "which
--      vendor is the caller", used by every vendor-facing policy.
--
-- No new table, no new enum, no speculative column. Vendor account
-- verification remains staff-driven: docs/platform-v1-plan.md section P.2
-- item 17 is still undecided, and nothing here opens self-signup.

-- ---------------------------------------------------------------------------
-- 1. Sign-in allow-list address
-- ---------------------------------------------------------------------------
-- contact_email is deliberately NOT reused for this. It is the business
-- contact address (plan section B.2), it may differ from the address a person
-- signs in with, and 0002 grants `update (contact_email)` to authenticated: a
-- vendor could therefore rewrite who is allowed to claim their own profile.
--
-- signin_email receives no column grant at all, so a signed-in vendor can
-- neither read nor write it. It is set by staff through the service role.

alter table public.vendor_profiles
  add column signin_email citext;

-- citext, so casing cannot produce two profiles claiming one address. Partial,
-- so any number of profiles may have no sign-in address yet.
create unique index vendor_profiles_signin_email_key
  on public.vendor_profiles (signin_email)
  where signin_email is not null;

comment on column public.vendor_profiles.signin_email is
  'Staff-controlled allow list: the ONE address that may claim this profile by
   magic link. There is no public vendor registration. Never granted to
   `authenticated`, so a vendor can neither read nor change it. Distinct from
   contact_email, which is the business address and IS vendor-editable.';

-- ---------------------------------------------------------------------------
-- 2. Which vendor is the caller
-- ---------------------------------------------------------------------------
-- The one definition of vendor identity, used by every vendor-facing policy
-- below. It reads auth.uid() only: no browser-supplied vendor id, no query
-- string, no hidden field and no email claim participate in authorisation.
-- The auth-user-to-profile link is written once, by the server, during
-- binding; from then on the uid is the whole answer.
--
-- Returns NULL when the caller has no profile or an unapproved one. `id = null`
-- is NULL, never true, so every policy below denies by default.
--
-- SECURITY DEFINER so a policy can ask the question without granting the
-- caller read access to the verification column, which is internal.

create or replace function public.current_vendor_profile_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select v.id
  from public.vendor_profiles v
  where v.auth_user_id = auth.uid()
    and v.verification = 'verified'
  limit 1;
$$;

revoke execute on function public.current_vendor_profile_id() from public;
grant execute on function public.current_vendor_profile_id() to authenticated;

comment on function public.current_vendor_profile_id() is
  'The authenticated caller''s approved vendor profile id, or NULL. A Supabase
   auth account alone grants nothing: the profile must exist, be bound to this
   uid, and be verified. Vendor Network authorisation starts and ends here.';

-- ---------------------------------------------------------------------------
-- 3. Repoint the vendor-facing policies
-- ---------------------------------------------------------------------------
-- Same boundaries as 0002 and 0003, narrowed by the approval gate. Nothing is
-- widened: no INSERT or DELETE policy is added anywhere, passport_stamps still
-- has no vendor write path of any kind, vendor_status_history stays admin-only,
-- and the admin policies are untouched and independent.

drop policy "vendor_profiles_self_read" on public.vendor_profiles;
create policy "vendor_profiles_self_read"
  on public.vendor_profiles for select
  to authenticated
  using (id = public.current_vendor_profile_id());

drop policy "vendor_profiles_self_update" on public.vendor_profiles;
create policy "vendor_profiles_self_update"
  on public.vendor_profiles for update
  to authenticated
  using (id = public.current_vendor_profile_id())
  with check (id = public.current_vendor_profile_id());

drop policy "vendor_categories_self_read" on public.vendor_categories;
create policy "vendor_categories_self_read"
  on public.vendor_categories for select
  to authenticated
  using (vendor_profile_id = public.current_vendor_profile_id());

drop policy "vendor_categories_self_write" on public.vendor_categories;
create policy "vendor_categories_self_write"
  on public.vendor_categories for all
  to authenticated
  using (vendor_profile_id = public.current_vendor_profile_id())
  with check (vendor_profile_id = public.current_vendor_profile_id());

drop policy "passport_stamps_self_read_active" on public.passport_stamps;
create policy "passport_stamps_self_read_active"
  on public.passport_stamps for select
  to authenticated
  using (
    voided_at is null
    and vendor_profile_id = public.current_vendor_profile_id()
  );

drop policy "passport_challenges_self_read" on public.passport_challenges;
create policy "passport_challenges_self_read"
  on public.passport_challenges for select
  to authenticated
  using (vendor_profile_id = public.current_vendor_profile_id());

drop policy "passport_challenge_events_self_read" on public.passport_challenge_events;
create policy "passport_challenge_events_self_read"
  on public.passport_challenge_events for select
  to authenticated
  using (
    exists (
      select 1 from public.passport_challenges c
      where c.id = passport_challenge_events.challenge_id
        and c.vendor_profile_id = public.current_vendor_profile_id()
    )
  );

drop policy "opportunity_submissions_self_read" on public.opportunity_submissions;
create policy "opportunity_submissions_self_read"
  on public.opportunity_submissions for select
  to authenticated
  using (vendor_profile_id = public.current_vendor_profile_id());

-- Reading the active opportunity list now also requires an approved vendor
-- relationship, so a bare auth account sees nothing of the Vendor Network.
-- There is still no vendor INSERT policy here: expressing interest is a
-- Phase 5 server operation, so a vendor cannot grant themselves anything.
drop policy "opportunities_vendor_read_active" on public.opportunities;
create policy "opportunities_vendor_read_active"
  on public.opportunities for select
  to authenticated
  using (
    status = 'active'
    and public.current_vendor_profile_id() is not null
  );

-- public.events, public.milestones and public.interests keep their
-- `using (true)` read policies on purpose. They are reference data mirroring
-- what is already public (event dates, tier names, category labels) and carry
-- nothing about any vendor.
