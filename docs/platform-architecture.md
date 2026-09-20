# Platform Architecture

Technical reference for the NF platform backend. **Phase 1 only: the foundation
is in place, no platform feature is built.**

Product rules, tiers, benefits and roadmap live in `docs/platform-v1-plan.md`.
This document does not repeat them. Compliance obligations live in
`docs/site-compliance.md`.

---

## 1. Decision: Supabase and Postgres, confirmed

Inspected against the repo at commit `e1c0d52`. Nothing argued for a change.

What the repo actually is: a Next.js 16 App Router site with three runtime
dependencies, **six statically prerendered public routes**, no API routes, no
server actions, no data fetching and no environment variables at all. Content
lives in typed TypeScript modules under `src/lib/`.

That makes the decision easy, because the platform is genuinely additive:

- **The data is relational.** Vendors, events, stamps, milestones,
  opportunities, subscribers, interests and consent history are joins and
  constraints. A partial unique index is what actually prevents a double stamp.
- **Row Level Security is the point.** "A vendor sees only their own records"
  is enforced by the database, not by remembering a `where` clause. Every
  alternative leaves that guarantee in application code.
- **Auth and Storage come with it**, so no separate auth dependency and no
  separate file host.
- **It is still just Postgres.** A dump and restore moves everything. Not a
  one-way door.

### 1.1 The public site stays independent

This is a hard constraint, verified rather than assumed:

- All six public routes build and render with **every** Supabase variable
  unset. Verified: a production build with no `.env` file at all succeeds and
  all six routes are still marked `○ (Static)` prerendered.
- **No Supabase code reaches the client bundle.** Verified after build: no
  occurrence of `SUPABASE_SECRET_KEY` anywhere in `.next/static`, and no
  Supabase library in any client chunk, because nothing imports it yet.
- Every accessor in `src/lib/supabase/env.ts` is a **function**. A module-level
  throw would turn a missing variable into a build failure for pages that never
  use it.

**A Supabase outage cannot break `/`, `/events/expo-2026`,
`/events/halloween-2026`, `/privacy`, `/terms` or `/refunds`.** They are static
HTML that never queries anything.

---

## 2. What Phase 1 added

```
.env.example                      names only, no secrets, committed
supabase/
  migrations/
    0001_foundation.sql           extensions, enums, helpers, admin, audit log
    0002_vendors.sql              profiles, categories, standing history
    0003_events_passport.sql      events mirror, milestones, stamps, challenges
    0004_opportunities.sql        opportunities, expressions of interest
    0005_nf_club.sql              subscribers, interests, consent, sources
  seed.sql                        reference data only, no monetary values
src/lib/supabase/
  env.ts                          lazy validated env access, never throws on import
  client.ts                       browser client, publishable key, RLS enforced
  server.ts                       server client, publishable key, acts as the user
  admin.ts                        secret key, server only, bypasses RLS
  types.ts                        hand-written Database types
docs/platform-architecture.md     this file
```

Two dependencies added: `@supabase/supabase-js` and `@supabase/ssr`. Nothing
else. `@supabase/ssr` is the current supported way to do cookie-based sessions
in the App Router.

---

## 3. Data model

Seventeen tables plus one view. Entities follow `docs/platform-v1-plan.md`
section L exactly.

| Group | Tables |
| --- | --- |
| Admin | `admin_users`, `audit_log` |
| Vendors | `vendor_profiles`, `vendor_categories`, `vendor_status_history` |
| Events and Passport | `events`, `milestones`, `passport_stamps`, `passport_challenges`, `passport_challenge_events` |
| Opportunities | `opportunities`, `opportunity_submissions` |
| NF Club | `club_subscribers`, `interests`, `subscriber_interests`, `consent_events`, `signup_sources`, `subscriber_source_touches` |
| Derived | `vendor_passport_summary` (view) |

Nothing speculative: no invoices, payments, ticket orders, table bookings,
Airtable sync, attendee accounts or vendor transactions.

### 3.1 Passport rules enforced in the database

The Passport's credibility rests on rules that are easy to break by accident,
so they are enforced in Postgres rather than in application code.

| Rule | Mechanism |
| --- | --- |
| One completed booking equals one stamp | Partial unique index on `(vendor_profile_id, event_id)` where `stamp_type = 'booking' and voided_at is null`. A second admin pass cannot double stamp. Voided rows are excluded, so a correct stamp can be re-issued after a mistaken one is voided. |
| Stamps are awarded after the event, never at booking | `BEFORE INSERT` trigger rejecting a booking stamp unless the event's `ends_on` is strictly in the past, with an error naming the event and both dates. Bonus stamps are exempt. |
| Corrections preserve history | `voided_at` / `voided_by` / `void_reason`, plus a CHECK that a void is incomplete without a reason. No `DELETE` policy exists for any signed-in role. |
| Stamps are lifetime | Nothing expires them. Any future recency requirement (the unapproved 12-month idea) must be a separate derived check, never a deletion. |
| Tier is derived, never stored | `vendor_passport_summary` computes it from the active stamp count against `milestones`. Changing a threshold re-derives every vendor with no data migration and no vendor record rewritten. |
| Thresholds and benefits are data | `milestones` table, seeded with the proposed 0 / 3 / 5 / 8 / 12 tiers. **No monetary value is seeded**, because none is approved. |

### 3.2 NF Club consent model

Consent is **never a boolean**. `consent_events` is append-only and records the
action, the consent type, **the exact wording shown**, a version identifier for
that wording, the source slug, IP and user agent, and a timestamp. `UPDATE` and
`DELETE` triggers reject every attempt, so a later edit to the signup form
cannot retroactively change what someone is recorded as having agreed to.

Supporting behaviours the schema is built for:

- **Duplicate signups merge.** `subscriber_interests` has a composite primary
  key, so a repeat signup is an idempotent upsert that adds interests and never
  drops earlier ones. `created_at` on the subscriber is never overwritten.
- **Identical user-facing result.** Nothing in the schema forces the server to
  reveal whether an address already exists.
- **Unsubscribe suppresses, never deletes.** `status` carries `subscribed`,
  `unsubscribed`, `bounced`, `complained`. Only `subscribed` is ever exported.
  `complained` is terminal.
- **Case-insensitive email.** `citext` with a unique constraint, so two casings
  cannot become two subscribers even if the server forgets to normalise.

### 3.3 The events table is a mirror, not a source of truth

`src/lib/events.ts` remains the source of truth for everything the public site
renders. `public.events` exists only so stamps, challenges and opportunities
have something to point at, and is matched by `slug`. **Keep the slugs
identical.** Do not move public event content into the database: it would put a
database call on the critical path of pages that are static today.

---

## 4. Row Level Security strategy

**RLS is enabled in the same migration that creates each table, before any
policy exists.** A table can therefore never exist in this database without RLS
on it. Postgres denies by default, so a table with RLS enabled and zero
policies is reachable only by the service role.

### 4.1 Policy summary

| Table | anon | Vendor (authenticated) | Admin |
| --- | --- | --- | --- |
| `club_subscribers` and all NF Club tables | none | **none** | none |
| `admin_users` | none | **none** | none |
| `audit_log` | none | none | read |
| `vendor_profiles` | none | read and update **own row only** | full |
| `vendor_categories` | none | read and write own | full |
| `vendor_status_history` | none | **none** | read |
| `events`, `milestones`, `interests` | none | read | full |
| `passport_stamps` | none | read **own, non-voided only** | read all |
| `passport_challenges` | none | read own | full |
| `opportunities` | none | read **`status = 'active'`, approved vendors only** | full |
| `opportunity_submissions` | none | read own | full |

"Own" means `public.current_vendor_profile_id()` since migration 0006 (section
15.3), which is bound **and** verified. Before that it meant bound alone.

### 4.2 The three decisions that matter

**NF Club data has no policies at all.** This is the strongest guarantee in the
schema. It does not depend on a policy being written correctly, on the UI
hiding anything, or on anyone remembering a rule: the publishable key and every
signed-in vendor simply have no grant to use. Subscriber data cannot become
publicly queryable. NF Club signup therefore runs entirely server side through
the admin client, which is exactly where it belongs given the marketing pages
run no Supabase client in the browser.

**Vendors cannot write their own Passport history.** There is deliberately no
`INSERT`, `UPDATE` or `DELETE` policy on `passport_stamps` for `authenticated`.
Awarding, voiding, changing standing and managing opportunities are privileged
server operations. Even a bug that exposed a write path in the UI could not
produce a stamp.

**Internal standing is protected at the column level, not just by RLS.** A
vendor's own-row `SELECT` policy would otherwise expose `standing` and
`verification`. `GRANT SELECT (...)` is narrowed to the columns a vendor may
see, so those two columns are unreachable by a vendor even on their own row.

### 4.3 `is_admin()`

Admin rights live in the `admin_users` table, never in a JWT claim a client
could set. `public.is_admin()` is `SECURITY DEFINER` so a policy can ask the
question without granting the caller read access to `admin_users`. It sets
`search_path = ''` and schema-qualifies every reference, so a caller cannot
shadow a table name and hijack its elevated rights.

**RLS is not a substitute for checking.** The admin client bypasses policies
entirely, so any privileged server action must verify authorisation in code
before it writes.

### 4.4 Testing RLS

Done in Phase 3A. "Vendor A cannot read vendor B's stamps" is now an executed
test rather than an assumption, along with 42 others. See section 15.6 for what
is covered and how the suite is run.

---

## 5. Auth strategy

**Magic link (email OTP) via Supabase Auth remains the right choice**, confirmed
rather than assumed. Vendors sign in a handful of times a year; password reset
support would be most of the support load for almost no benefit, and there is no
password to leak.

No login UI is built in Phase 1, and no test route was added: the foundation is
verifiable without one, and a throwaway auth route would be the only place in
the repo rendering a form.

**No attendee authentication.** NF Club V1 creates no auth user, ever.

### 5.1 Dependency Phase 3 inherits

Supabase's built-in email sender is **rate limited and explicitly not for
production use**. Magic links will not work reliably for real vendors until
**custom SMTP is configured** in the Supabase dashboard.

This is a **transactional** email provider (sign-in links), which is a separate
decision from the **marketing** email provider deliberately not chosen in
`docs/platform-v1-plan.md`. Choosing one does not commit NF to the other.

**Still outstanding after Phase 3A.** The built-in sender was sufficient to
build and test the flow and no provider was selected, per the phase's scope.
It is not sufficient for real vendors: see section 15.5.

---

## 6. Server and client boundaries

Three clients, three different privilege levels.

| Module | Key | Runs | Respects RLS | Use for |
| --- | --- | --- | --- | --- |
| `client.ts` | publishable | browser | yes | Client components in the Vendor Network (Phase 3) |
| `server.ts` | publishable | server | yes | Server components, route handlers and actions acting **as the signed-in user** |
| `admin.ts` | secret | server only | **no, bypasses** | Privileged writes after an explicit authorisation check |

**Prefer `server.ts`.** If a policy is wrong, a query returns nothing rather
than returning someone else's data. Reach for `admin.ts` only where the
operation is genuinely privileged.

### 6.1 How the secret key is kept out of the browser

1. **Structural, and the one that actually guarantees it:** the variable is
   named `SUPABASE_SECRET_KEY` with **no `NEXT_PUBLIC_` prefix**. Next.js
   only inlines `NEXT_PUBLIC_` variables into client bundles, so in the browser
   this is always `undefined`. It cannot be bundled. **Never add that prefix.**
2. **Runtime guard:** `createSupabaseAdminClient()` throws a descriptive error
   if evaluated in a browser, so a mistaken import fails loudly at once.
3. **Verified:** after a production build, `SUPABASE_SECRET_KEY` appears
   nowhere in `.next/static`.

**Recommended for Phase 2:** add the `server-only` package and import it at the
top of `admin.ts`. That upgrades a mistaken import from a runtime error to a
**build-time** error. It was not added now because nothing imports `admin.ts`
yet, and the security outcome is already guaranteed by point 1. The natural
moment is the first server action.

### 6.2 A NEXT_PUBLIC_ gotcha worth knowing

`env.ts` reads the public variables as **literal** property accesses
(`process.env.NEXT_PUBLIC_SUPABASE_URL`), not through a dynamic
`process.env[name]` lookup. Next.js only inlines the literal form; the dynamic
form silently becomes `undefined` in the browser. This is easy to miss and
produces a confusing runtime failure.

---

## 7. Environment variables

| Variable | Exposure | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser, intended | Project Settings, then API, then Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser, intended | Project Settings, then API, then publishable key |
| `SUPABASE_SECRET_KEY` | **Server only, secret** | Project Settings, then API, then secret key |
| `NF_SITE_URL` | Server only, not secret | The origin magic links return to. Optional: see section 15.5 |

The publishable key is safe to publish: it grants nothing on its own because
every table is protected by RLS and the NF Club tables have no policies.

`.env.example` is committed and holds names only. `.gitignore` ignores `.env*`
with an explicit `!.env.example` exception so the template can be tracked while
real values never are.

---

## 8. Migration workflow

Migrations are plain SQL in `supabase/migrations/`, numbered and applied in
order. They work two ways:

**With the Supabase CLI** (recommended once a project exists):

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

**Without the CLI:** open the Supabase dashboard SQL editor and run each file in
numeric order, then `seed.sql`.

Rules:

- **Migrations are append-only.** Never edit a file that has been applied. Add
  `0006_...sql` instead.
- **Enable RLS in the same migration that creates the table.**
- `seed.sql` is idempotent (`on conflict do nothing`) and safe to re-run.

### 8.1 Regenerating types

`src/lib/supabase/types.ts` is hand-written from the SQL because there is no
project to generate from. Replace it as soon as one exists:

```bash
npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
```

**Done in Phase 3A.** `src/lib/supabase/types.ts` is now the generated file,
regenerated after migration 0006. The hand-written version matched it exactly,
so the only diff was the new column and function. Regenerate with the command
above after every migration rather than editing the file.

---

## 9. Local development setup

1. Create a Supabase project (section 10).
2. `cp .env.example .env.local` and fill in the three values.
3. Apply `supabase/migrations/*.sql` in order, then `seed.sql`.
4. `npm run dev`.

Steps 1 to 3 are **not required** to work on the public marketing site. The site
runs, builds and deploys with no Supabase configuration at all.

---

## 10. What Chris needs to create in Supabase

Nothing in this repository can create these. All of it is manual, one time.

1. **Create a Supabase project.** Choose a region; Canada Central is the closest
   to the GTA if data locality matters. Note the choice: `/privacy` currently
   says information may be processed outside Canada, which stays accurate and
   conservative either way.
2. **Save the database password** somewhere safe. Supabase shows it once.
3. **Copy the three values** from Project Settings, then API, into `.env.local`.
   Never commit that file.
4. **Run the migrations**, then `seed.sql` (section 8).
5. **Add the same three variables to Vercel** (Project Settings, then
   Environment Variables) for Preview and Production. The secret key must
   be added as a **secret**, never as a plain value, and never with a
   `NEXT_PUBLIC_` prefix.
6. **Make yourself an admin.** After signing in once so an `auth.users` row
   exists, run in the SQL editor:
   `insert into public.admin_users (auth_user_id, role) values ('<your-auth-uid>', 'owner');`
   There is intentionally no self-service path for this.
7. **Configure custom SMTP** before real vendors sign in (sections 5.1 and
   15.5). The built-in sender is rate limited and not for production. It was
   enough to build and test Phase 3A.
8. **Create the vendor logo storage bucket** when profile editing is built.
   Still not created: nothing uploads yet, and it needs per-vendor path
   policies.
9. **Add the magic-link redirect URLs** (section 15.5). Nothing signs in until
   this is done.

Still open from `docs/platform-v1-plan.md` and unrelated to this setup: the
public mailing address (blocks commercial email under CASL), the marketing email
provider, and the retention schedule.

---

## 11. What Phase 1 deliberately does not include

- No NF Club UI, form, or `/club` route. No email is sent and no provider is
  chosen. **Phase 2A adds the signup backend only** (section 13); the form
  itself is still not built. **Phase 2B adds `/club` and the reusable form**
  (section 13.7).
- No Vendor Network UI, no login screen, no dashboard.
- No Passport UI and no admin UI.
- No NF Opportunities UI.
- No storage bucket, no middleware, no session refresh, no RLS test suite, no
  seeded vendors, subscribers or stamps.
- **No monetary values anywhere**, in seed data or in benefit copy.
- No analytics, no cookies, no tracking. The compliance posture in
  `docs/site-compliance.md` is unchanged: the public site still collects
  nothing and still needs no cookie banner.

---

## 13. Phase 2A: NF Club signup backend

The server-side signup path only. No `/club` page, no homepage or event-page
form, no email sending. Built so every future signup surface calls the same
code rather than each inventing its own writes.

### 13.1 Files

```
src/lib/club/
  consent.ts        CLUB_CONSENT_TEXT and CLUB_CONSENT_VERSION, the single
                     source of truth for what a signup form must show
  signup-core.ts     handleClubSignup(input, meta): all database logic, no
                     next/headers dependency, so it is directly testable
  signup.ts          "use server". submitClubSignup(input) reads request
                     headers and calls signup-core; submitClubSignupForm
                     (formData) is the eventual <form action={...}> target
```

No input-validation library was added: the field set is five values with
simple bounds (length, an email pattern, and two DB-backed allow-lists), and
hand-written checks in `signup-core.ts` cover it without a new dependency.

### 13.2 Security boundary

`signup-core.ts` is the only code that writes to `club_subscribers`,
`consent_events`, `subscriber_interests` and `subscriber_source_touches`, and
it uses `createSupabaseAdminClient()` exclusively. This is necessary, not
optional: those tables have RLS enabled with **zero policies** (section 4.2),
so no anon/publishable-key client could reach them even if one tried. No
Supabase client of any kind runs in the browser for NF Club.

### 13.3 Source-slug contract

`source` must be a slug already present and `active` in `public.signup_sources`
(section 3, seeded in `supabase/seed.sql`). It is supplied by the calling
surface as a fixed value or a `?src=` query param the surface controls, never
typed by the visitor. An unrecognised slug is rejected. Interests follow the
same pattern against `public.interests`.

### 13.4 Consent handling

Every successful submission appends one row to `consent_events`: the exact
wording (`CLUB_CONSENT_TEXT`) and its version (`CLUB_CONSENT_VERSION`) from
`src/lib/club/consent.ts`, the source slug, and the request's IP and user
agent. Bump `CLUB_CONSENT_VERSION` if the wording ever changes; editing the
text in place would misrepresent what earlier signups agreed to (section 3.2).

A repeat signup re-subscribes the address (status back to `subscribed`) on
this fresh consent, **except** when the current status is `complained`, which
`docs/platform-v1-plan.md` section A.9 treats as terminal. First name is set
once and never overwritten by a later signup under a different name.

### 13.5 Duplicate-email behaviour

`email` is matched via the `citext` column, so case does not create a second
row. `handleClubSignup` returns the identical `{ status: "success" }` whether
the address is new or already existed; only malformed input (bad email
shape, unknown interest, unknown source, missing consent) produces a
different, non-enumerating error result.

### 13.6 Anti-abuse

A honeypot field and a minimum-time-to-submit check (1500ms from a
client-supplied render timestamp), both of which respond with the same
generic success so a bot learns nothing. **Per-IP rate limiting is
deliberately deferred**: it needs an edge/KV component this phase does not
add, and the two checks above are what the plan lists as sufficient before
that. No CAPTCHA, per plan section A.4.

---

### 13.7 Phase 2B: `/club` and the reusable form

```
src/app/club/page.tsx             the canonical NF Club page, static
src/components/ClubSignupForm.tsx the reusable form, any signup surface
src/lib/club/options.ts           CLUB_INTERESTS and CLUB_SIGNUP_SOURCES
```

- **One form, one action.** `ClubSignupForm` posts to `clubSignupAction` in
  `signup.ts`, a `useActionState` adapter over the same `submitClubSignup`
  path. It adds no business logic: it catches unexpected throws and returns
  the generic error so nothing internal reaches the browser. The component
  only runs presence checks (name, email shape, consent) for fast feedback;
  the server remains authoritative.
- **Source.** `/club` submits the existing `club-page` slug. No new slug was
  added. The embedding page passes `source` as a `ClubSignupSource` literal,
  rendered as a hidden input; the visitor never types it, and the server
  still rejects anything not active in `public.signup_sources`. `?src=` for
  QR codes is not wired yet.
- **Options are mirrored, not fetched.** `options.ts` copies the seeded
  interests and sources so `/club` stays a static page with no database call
  on render. Keep it in step with `seed.sql`; a drifted slug fails loudly at
  submit rather than being accepted.
- **Consent wording** is rendered verbatim from `CLUB_CONSENT_TEXT`, so the
  text stored in `consent_events` is exactly what the person saw. Current
  version is `v2`; `v1` promised "exclusive drops", an unapproved benefit, and
  was retired. Existing `v1` rows are untouched.
- **Navigation (updated in Phase 2C).** NF Club is in the footer nav, the
  menu and the desktop header. The full-screen menu now serves everything
  below 1024px and the inline desktop nav starts at 1024px (`lg`), because
  four links plus the ticket button do not fit on one row at 768px. The
  desktop "NF Club" link (`ClubNavLink.tsx`, a client component only for
  `usePathname`) shows an underline and `aria-current="page"` on `/club`. It
  is a plain link, not a second button: "Get your tickets" stays the only CTA.
  Header height and stickiness still switch at `md`.

### 13.8 Phase 2C: sitewide entry points

`ClubTeaser` (src/components/ClubTeaser.tsx) is a presentational band placed
after the final ticket CTA on `/`, `/events/expo-2026` and
`/events/halloween-2026`. It links to `/club?src=<slug>` and holds no signup
logic. Placed after the attendance close on purpose, with an ink action
rather than the brand or gold ticket fills, so it never competes with
tickets.

Attribution uses the existing seeded slugs only (`homepage`, `expo-2026`,
`halloween-2026`, `club-page`); no new slug was added. `/club` renders
`ClubSignupForm` with `sourceFromUrl`, which after mount reads `?src=` and
passes it through `resolveClubSignupSource` (src/lib/club/options.ts): an
exact match against `CLUB_SIGNUP_SOURCES` is used, anything else falls back
to `club-page`. The server still re-validates against
`public.signup_sources`. The page stays static; a submit before hydration
records `club-page`.
- **Submission** is dispatched from `onSubmit` once hydrated, because React's
  automatic reset after an action-prop submit unticks checkboxes while their
  state still reads ticked. The `action` prop stays as the pre-hydration
  fallback.

## 14. Known issues

`npm audit` reports two high-severity advisories: `js-yaml` via `eslint` and
`sharp` via `next`. **Both pre-date this phase and neither comes from Supabase.**
They were not fixed here because `npm audit fix` would bump toolchain packages
outside this task's scope. Worth addressing deliberately, separately.

---

## 15. Phase 3A: Vendor Network authentication

Identity and authorisation only. The dashboard is a shell that proves the
chain works; the Passport timeline, tier progress, opportunities and profile
editing are later phases.

### 15.1 Files

```
supabase/migrations/
  0006_vendor_auth.sql        signin_email, current_vendor_profile_id(),
                              vendor policies repointed at it
  0007_actor_release.sql      append-only guard tolerates the FK releasing
                              the actor reference, so an auth user can
                              actually be deleted
src/lib/vendors/
  session.ts                  getVendorAccess(): resolve, bind, read
  auth.ts                     "use server". Sign-in link request, sign out
src/app/vendors/
  page.tsx                    public landing, static
  login/page.tsx              dynamic, reads ?state=
  login/VendorLoginForm.tsx   client, useActionState over the server action
  auth/callback/route.ts      the only place a session is created
  dashboard/page.tsx          force-dynamic, authenticated shell
src/proxy.ts                  session refresh, Vendor Network routes only
```

No dependency was added. `@supabase/ssr` was already present and is the
current supported App Router approach; nothing here uses the deprecated
`auth-helpers` packages.

### 15.2 The sign-in flow

1. The vendor enters an email at `/vendors/login`.
2. `requestVendorSignInLink` (a Server Action) checks the address against
   `vendor_profiles.signin_email` on a **verified** profile, using the admin
   client because `signin_email` has no grant to any signed-in role.
3. If and only if that matches, `signInWithOtp` sends a magic link with
   `emailRedirectTo` pointing at `/vendors/auth/callback`.
4. **The response is identical either way**, so the form cannot be used to
   find out who vends at NF. See 15.4.
5. The callback validates the token, establishes the cookie session and
   redirects to `/vendors/dashboard`. It honours no `next` parameter: the
   destination is fixed, so a crafted link cannot bounce a freshly
   authenticated vendor somewhere else.
6. `/vendors/dashboard` calls `getVendorAccess()`, which resolves the session
   to an approved vendor or renders the neutral no-access state.

There are no passwords anywhere in this flow, and **no public vendor
registration**. Because step 2 gates step 3, a stranger cannot even cause a
Supabase auth user to be created. That was verified: after submitting an
unknown address through the live form, no `auth.users` row existed for it.

The callback accepts both `?code=` (PKCE, the `@supabase/ssr` default, which
requires the link to be opened in the browser that asked for it) and
`?token_hash=&type=` (works across devices, available if the email template is
switched to `{{ .TokenHash }}`). The login copy tells vendors to open the link
on the same device, which is true for the default template.

### 15.3 Binding an auth user to a vendor profile

`vendor_profiles.signin_email` is the staff-controlled allow list: the one
address that may claim a profile.

**Why not `contact_email`.** It is the business contact address and is allowed
to differ from the sign-in address (`docs/platform-v1-plan.md` section B.2),
and 0002 grants `update (contact_email)` to `authenticated`. Reusing it would
have let a vendor rewrite who is allowed to claim their own account.
`signin_email` has no column grant at all, so a vendor can neither read nor
write it.

Binding happens once, on first sign-in, in `bindAuthUserToProfile`. It is the
only privileged write in the Vendor Network, it writes an `audit_log` row, and
the database decides it: the profile must match `signin_email`, be
`verified`, be unclaimed, and the auth user must hold no profile already.

**After binding, the email plays no part in authorisation.** Everything reads
`auth.uid()` through `public.current_vendor_profile_id()`, which returns the
caller's profile id only when the profile is bound to that uid **and**
verified, and NULL otherwise. Every vendor-facing policy is written against
that function, so `id = null` denies by default. No vendor id is ever accepted
from a query string, a hidden field, a cookie or a client claim.

One further detail worth knowing: the re-read that confirms the binding took
effect is filtered by id on purpose. Next.js memoizes identical GET requests
within a single render, so an unfiltered repeat is served the empty result
from the read before the binding, and a vendor is told they have no access on
the very request that granted it. This was a real failure observed in testing,
not a theoretical one.

### 15.4 What the login screen must never reveal

Every well-formed address gets: *"If this email is eligible for NF Vendor
Network access, a sign in link is on its way."* Only the shape of the text
typed can change the answer, which is a property of the input rather than of
anything NF holds.

That covers whether an address belongs to a vendor, whether an account exists,
whether a profile is pending or was rejected, the internal standing, and
whether the person is staff. A delivery failure (rate limit, SMTP problem) is
logged and still produces the same screen, because a difference there would be
the enumeration oracle everything else avoids.

**Known residual.** An eligible address costs one extra network call, so the
response is measurably slower. Closing that needs a constant-time path and was
not built here. Noted rather than hidden.

The no-access state on the dashboard follows the same rule: it never says why,
never shows a standing label and never shows a reason, only a route to a human
(`docs/platform-v1-plan.md` section H).

### 15.5 Supabase dashboard configuration (manual)

None of this can be done from the repository.

**Authentication, then URL Configuration.** Add every origin that will receive
a magic link to **Redirect URLs**:

| Environment | Value | Status |
| --- | --- | --- |
| Local development | `http://localhost:3000/vendors/auth/callback` | Needed now |
| Vercel previews | `https://*-<your-team>.vercel.app/vendors/auth/callback` | Needed when the Vendor Network is deployed to a preview |
| Vercel production | the current production origin, plus `/vendors/auth/callback` | Needed at deploy |
| `nostalgiafest.ca` | `https://nostalgiafest.ca/vendors/auth/callback` | **Not yet.** The domain is not connected to Vercel, so add this only once it is. |

**Site URL** should be the production origin once one exists. Until then
leaving it at `http://localhost:3000` is fine.

The application never derives this origin from the request's `Host` header,
which an attacker controls. It reads `NF_SITE_URL` (server only, see
`.env.example`), falling back to `VERCEL_URL` on previews and
`http://localhost:3000` locally. Supabase's allow list is the second line of
defence and both are needed.

**Email delivery.** Supabase's built-in sender was used for this phase and is
enough for bounded development testing. It is rate limited and explicitly not
for production, so **custom SMTP must be configured before real vendors sign
in** (section 5.1). No transactional provider was selected here, and that
decision stays separate from the marketing provider.

**Admin users.** Unchanged and still manual (section 10, step 6). Admin
authorisation lives in `admin_users` and is read by `is_admin()`. It is
entirely separate from vendor authorisation: `current_vendor_profile_id()`
never consults it, `is_admin()` never consults vendor tables, and the admin
policies were not touched by 0006.

**Adding a vendor.** Also deliberately manual, and the only way in:

```sql
update public.vendor_profiles
   set signin_email = 'them@example.com',
       verification = 'verified'
 where id = '<vendor-profile-id>';
```

### 15.6 Live authorisation tests

Run against the real linked project with disposable auth users and vendor
fixtures. **43 of 43 passed.** Covered:

- an unknown address gets the same login response as a known one, and creates
  no auth user
- an approved vendor authenticates, binds, and reads exactly one profile
- binding is case insensitive, cannot claim an unverified profile, cannot take
  over a claimed one, and cannot be reassigned by the vendor
- an authenticated user with no approved relationship reads no vendor profile,
  stamp, summary, opportunity, submission or challenge
- vendor A cannot read or write vendor B's profile, stamps, summary or
  categories
- a vendor cannot award a stamp to itself or to anyone else
- a vendor cannot void or delete a stamp
- a vendor cannot create or modify a milestone
- a vendor cannot select `standing`, `verification`, `signin_email` or `*` on
  its own row, and cannot write `standing` or `verification`
- a vendor cannot read `vendor_status_history`, `admin_users` or `audit_log`,
  and cannot insert itself into `admin_users`
- no NF Club table is reachable from a vendor session
- the publishable key on its own reaches none of it
- signing out removes access; `/vendors/dashboard` then redirects to login

**A note on reading the results.** PostgREST answers a write that RLS filtered
to zero rows with `204`, not `403`: the statement ran and changed nothing.
Both are refusals, so every write test also re-reads the row with the service
role and asserts the data is untouched. That re-read is the real assertion.

Fixtures were removed afterwards and **zero Phase 3A test rows remain**:
`vendor_profiles`, `vendor_status_history`, `audit_log`, `passport_stamps`,
`vendor_categories` and every NF Club table are empty, `auth.users` holds no
accounts, and `events` holds only the two seeded real shows.

Most of that went through ordinary deletes. Two profiles could not, because
`vendor_status_history` rejects `DELETE` and also refuses the `ON DELETE
CASCADE` from `vendor_profiles`, and neither could four `audit_log` rows.
That was the one case genuinely needing the guards off, so it was done as a
single throwaway migration pushed with `supabase db push`, then marked
reverted with `supabase migration repair --status reverted 0008` and deleted.
Migration history is back to 0001 to 0007, local and remote in sync.

That migration refused to run unless every row in all three tables was test
data, disabled only the two `*_no_delete` triggers, deleted only tagged rows,
re-enabled them, and asserted `tgenabled = 'O'` on both before committing, so
a failure anywhere would have rolled the guards back on. Confirmed afterwards
from a fresh `supabase db dump`: all six append-only triggers present, none
disabled, with only the two UPDATE triggers pointing at
`allow_only_actor_release` and everything else still on `reject_mutation`.

### 15.7 Deleting an auth user (migration 0007)

`audit_log.actor_auth_user_id` and `vendor_status_history.changed_by` both
reference `auth.users` with `ON DELETE SET NULL`, and both tables carry a
`BEFORE UPDATE` trigger that refused every update. Deleting an auth user made
Postgres perform the SET NULL, the trigger refused it, and the delete failed
with `audit_log is append only: UPDATE is not permitted on this table`.

**Any auth user who had ever written a history row was therefore
undeletable**: a departing staff member, a vendor exercising a deletion
request under PIPEDA, or a disposable test identity.

0007 replaces the UPDATE trigger function on those two tables only, with
`public.allow_only_actor_release(<actor column>)`. It permits exactly one
shape of update: the actor column going from a real uuid to NULL with every
other column byte-identical. Everything else still raises.

| Still refused | Now permitted |
| --- | --- |
| Any UPDATE to any other column | The FK releasing the actor to NULL |
| Nulling the actor *while* changing another column | |
| Any DELETE on either table | |
| Any UPDATE or DELETE on `consent_events` | |

No foreign key was dropped, no row was deleted, no RLS policy or grant
changed, and neither `*_no_delete` trigger was touched. Neither table has an
UPDATE policy for any signed-in role, so `anon` and `authenticated` still
cannot reach these rows at all; this trigger is the layer behind that.

Verified live, 14 of 14, using the **service role** so the trigger itself was
under test rather than the policy in front of it: ordinary UPDATE and DELETE
still rejected on both tables, the combined "null the actor and edit
something" attempt rejected, the auth user deleted successfully, both history
rows still present, only the actor column NULL, every other column unchanged,
and the guard still shut afterwards.

**A second, separate conflict exists and was deliberately left alone.**
`vendor_status_history.vendor_profile_id` references `vendor_profiles` with
`ON DELETE CASCADE`, while `vendor_status_history_no_delete` rejects every
delete, so **a vendor profile that has any standing history cannot be
deleted**. That is a DELETE, not the auth-user lifecycle 0007 fixes, and
whether a vendor profile may ever be hard deleted is a product decision
(`docs/platform-v1-plan.md` section J says to prefer void and correction over
deletion). Left as-is rather than widened. Practical consequence: create
standing history only for profiles meant to be permanent.

### 15.8 Security hygiene, re-verified

- `SUPABASE_SECRET_KEY` has no `NEXT_PUBLIC_` prefix and appears nowhere in
  `.next/static`, neither the name nor the value.
- No Supabase client runs in the browser on any Vendor Network page. The login
  form talks to a Server Action; the dashboard is a Server Component.
- `src/lib/supabase/server.ts` now pins `cache: "no-store"` on its fetch.
  Next.js already defaults to that, but a future default change must not be
  able to turn one vendor's dashboard into a cached page served to another.
- `.env.local` and `supabase/.temp/` remain gitignored. No test password, auth
  token or session token is written to the repository, and no email address or
  token is logged: failures log an error name only.
- `/vendors/login` and `/vendors/dashboard` are `noindex`.
- The public marketing routes are untouched and still build as `○ (Static)`.
  `src/proxy.ts` matches Vendor Network routes only.

### 15.9 What Phase 3A deliberately does not include

No Passport timeline, tier progress UI, benefit lists, opportunities UI,
profile editing, logo upload, storage bucket, table booking, invoices,
payments, applications, messaging, Airtable sync, admin UI, attendee accounts
or transactional email provider. No Passport milestone rule changed, and
nothing in NF Club was touched.
