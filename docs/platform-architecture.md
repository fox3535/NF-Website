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
  occurrence of `SUPABASE_SERVICE_ROLE_KEY` anywhere in `.next/static`, and no
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
  client.ts                       browser client, anon key, RLS enforced
  server.ts                       server client, anon key, acts as the user
  admin.ts                        service role, server only, bypasses RLS
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
| `opportunities` | none | read **`status = 'active'` only** | full |
| `opportunity_submissions` | none | read own | full |

### 4.2 The three decisions that matter

**NF Club data has no policies at all.** This is the strongest guarantee in the
schema. It does not depend on a policy being written correctly, on the UI
hiding anything, or on anyone remembering a rule: the anon key and every
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

Not yet written, because there is no project to run it against. Before Phase 3
ships, "vendor A cannot read vendor B's stamps" must exist as an **explicit
test**, not an assumption. This is the single most important test in the
system.

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

---

## 6. Server and client boundaries

Three clients, three different privilege levels.

| Module | Key | Runs | Respects RLS | Use for |
| --- | --- | --- | --- | --- |
| `client.ts` | anon | browser | yes | Client components in the Vendor Network (Phase 3) |
| `server.ts` | anon | server | yes | Server components, route handlers and actions acting **as the signed-in user** |
| `admin.ts` | service role | server only | **no, bypasses** | Privileged writes after an explicit authorisation check |

**Prefer `server.ts`.** If a policy is wrong, a query returns nothing rather
than returning someone else's data. Reach for `admin.ts` only where the
operation is genuinely privileged.

### 6.1 How the service role key is kept out of the browser

1. **Structural, and the one that actually guarantees it:** the variable is
   named `SUPABASE_SERVICE_ROLE_KEY` with **no `NEXT_PUBLIC_` prefix**. Next.js
   only inlines `NEXT_PUBLIC_` variables into client bundles, so in the browser
   this is always `undefined`. It cannot be bundled. **Never add that prefix.**
2. **Runtime guard:** `createSupabaseAdminClient()` throws a descriptive error
   if evaluated in a browser, so a mistaken import fails loudly at once.
3. **Verified:** after a production build, `SUPABASE_SERVICE_ROLE_KEY` appears
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
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser, intended | Project Settings, then API, then anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only, secret** | Project Settings, then API, then service_role |

The anon key is safe to publish: it grants nothing on its own because every
table is protected by RLS and the NF Club tables have no policies.

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

It is shaped like Supabase's generated output specifically so this is a
drop-in replacement. Until then, **the SQL is the source of truth** and the
types are a copy that can drift.

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
   Environment Variables) for Preview and Production. The service role key must
   be added as a **secret**, never as a plain value, and never with a
   `NEXT_PUBLIC_` prefix.
6. **Make yourself an admin.** After signing in once so an `auth.users` row
   exists, run in the SQL editor:
   `insert into public.admin_users (auth_user_id, role) values ('<your-auth-uid>', 'owner');`
   There is intentionally no self-service path for this.
7. **Configure custom SMTP** before Phase 3 (section 5.1). The built-in sender
   is rate limited and not for production.
8. **Create the vendor logo storage bucket** when Phase 3 needs it. Not created
   in Phase 1 because nothing uploads yet; it needs per-vendor path policies.

Still open from `docs/platform-v1-plan.md` and unrelated to this setup: the
public mailing address (blocks commercial email under CASL), the marketing email
provider, and the retention schedule.

---

## 11. What Phase 1 deliberately does not include

- No NF Club UI, form, or `/club` route. No email is sent and no provider is
  chosen.
- No Vendor Network UI, no login screen, no dashboard.
- No Passport UI and no admin UI.
- No NF Opportunities UI.
- **No input validation library.** Nothing accepts input yet, so adding one now
  would be guessing at a shape. Phase 2 introduces the first form; a small
  schema validator such as Zod is the recommended choice at that point, used in
  the server action, backed by the CHECK constraints already in the schema.
- No storage bucket, no middleware, no session refresh, no RLS test suite, no
  seeded vendors, subscribers or stamps.
- **No monetary values anywhere**, in seed data or in benefit copy.
- No analytics, no cookies, no tracking. The compliance posture in
  `docs/site-compliance.md` is unchanged: the public site still collects
  nothing and still needs no cookie banner.

---

## 12. Known issues

`npm audit` reports two high-severity advisories: `js-yaml` via `eslint` and
`sharp` via `next`. **Both pre-date this phase and neither comes from Supabase.**
They were not fixed here because `npm audit fix` would bump toolchain packages
outside this task's scope. Worth addressing deliberately, separately.
