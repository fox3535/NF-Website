-- 0002_vendors.sql
-- Vendor Network: profiles, product categories, and internal standing history.
--
-- Internal standing is kept strictly separate from Passport history, per
-- docs/platform-v1-plan.md section H. Stamps record what a vendor completed;
-- standing records whether NF wants to keep working with them. Neither is
-- derived from the other, and standing is never shown to the vendor.

-- ---------------------------------------------------------------------------
-- Shared interest / category vocabulary
-- ---------------------------------------------------------------------------
-- One list serves both NF Club interests and vendor product categories, so the
-- two never drift. Created here because vendors reference it first.

create table public.interests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.interests enable row level security;

-- Reference data. Readable by anyone signed in (a vendor picks categories from
-- it, and later the Club form renders it). Writable only via the service role.
create policy "interests_read"
  on public.interests for select
  to authenticated
  using (true);

comment on table public.interests is
  'Shared vocabulary for NF Club subscriber interests and vendor product
   categories. Data, not an enum, so the list changes without a migration.';

-- ---------------------------------------------------------------------------
-- Vendor profiles
-- ---------------------------------------------------------------------------

create table public.vendor_profiles (
  id uuid primary key default gen_random_uuid(),

  -- One auth user per profile in V1. Nullable and non-unique on purpose:
  -- staff can create a profile for a vendor who has not signed up yet, and a
  -- future join table can move this to many-to-many without a data migration.
  auth_user_id uuid unique references auth.users (id) on delete set null,

  business_name text not null,
  contact_name text,
  contact_email citext,
  instagram_handle text,
  city text,

  -- Storage object path, not a public URL. Resolved through Supabase Storage
  -- with its own per-vendor path policies. No bucket is created in Phase 1.
  logo_path text,

  -- Internal only. Never selected into a vendor-facing query.
  standing public.vendor_standing not null default 'good_standing',
  verification public.vendor_verification not null default 'pending_verification',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint vendor_profiles_business_name_not_blank
    check (length(btrim(business_name)) > 0)
);

create index vendor_profiles_auth_user_idx on public.vendor_profiles (auth_user_id);
create index vendor_profiles_business_name_idx on public.vendor_profiles (lower(business_name));

create trigger vendor_profiles_set_updated_at
  before update on public.vendor_profiles
  for each row execute function public.set_updated_at();

alter table public.vendor_profiles enable row level security;

-- A vendor reads and updates only its own profile.
create policy "vendor_profiles_self_read"
  on public.vendor_profiles for select
  to authenticated
  using (auth_user_id = auth.uid());

create policy "vendor_profiles_self_update"
  on public.vendor_profiles for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create policy "vendor_profiles_admin_all"
  on public.vendor_profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

comment on column public.vendor_profiles.standing is
  'INTERNAL ONLY. Never expose to the vendor or the public, and never render a
   reliability score. A vendor whose benefits are gated sees a neutral state
   directing them to their NF contact, not this value.';

-- RLS lets a vendor SELECT its own row including `standing`. Column-level
-- privileges are what actually keep the internal columns out of reach, so the
-- vendor-facing grant is narrowed to the columns a vendor may see.
revoke all on public.vendor_profiles from authenticated;
grant select (
  id, auth_user_id, business_name, contact_name, contact_email,
  instagram_handle, city, logo_path, created_at, updated_at
) on public.vendor_profiles to authenticated;
grant update (
  business_name, contact_name, contact_email, instagram_handle, city, logo_path
) on public.vendor_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Vendor product categories
-- ---------------------------------------------------------------------------

create table public.vendor_categories (
  vendor_profile_id uuid not null
    references public.vendor_profiles (id) on delete cascade,
  interest_id uuid not null
    references public.interests (id) on delete cascade,
  primary key (vendor_profile_id, interest_id)
);

alter table public.vendor_categories enable row level security;

create policy "vendor_categories_self_read"
  on public.vendor_categories for select
  to authenticated
  using (
    exists (
      select 1 from public.vendor_profiles v
      where v.id = vendor_categories.vendor_profile_id
        and v.auth_user_id = auth.uid()
    )
  );

create policy "vendor_categories_self_write"
  on public.vendor_categories for all
  to authenticated
  using (
    exists (
      select 1 from public.vendor_profiles v
      where v.id = vendor_categories.vendor_profile_id
        and v.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.vendor_profiles v
      where v.id = vendor_categories.vendor_profile_id
        and v.auth_user_id = auth.uid()
    )
  );

create policy "vendor_categories_admin_all"
  on public.vendor_categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Vendor standing history
-- ---------------------------------------------------------------------------

create table public.vendor_status_history (
  id bigint generated always as identity primary key,
  vendor_profile_id uuid not null
    references public.vendor_profiles (id) on delete cascade,
  previous_standing public.vendor_standing,
  new_standing public.vendor_standing not null,
  reason text not null,
  changed_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),

  constraint vendor_status_history_reason_not_blank
    check (length(btrim(reason)) > 0)
);

create index vendor_status_history_vendor_idx
  on public.vendor_status_history (vendor_profile_id, created_at desc);

alter table public.vendor_status_history enable row level security;

-- Admin read only. A vendor must never see its own standing history.
create policy "vendor_status_history_admin_read"
  on public.vendor_status_history for select
  to authenticated
  using (public.is_admin());

create trigger vendor_status_history_no_update
  before update on public.vendor_status_history
  for each row execute function public.reject_mutation();

create trigger vendor_status_history_no_delete
  before delete on public.vendor_status_history
  for each row execute function public.reject_mutation();

comment on table public.vendor_status_history is
  'Append-only record of every standing change, with a required reason and the
   staff member who made it. Standing is easy to apply informally and regret,
   so the history is mandatory. Admin-readable only.';
