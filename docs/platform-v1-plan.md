# NF Platform V1 Plan

**Status: planning only. Nothing here is built.**

This is the single source of truth for NF Club, the NF Vendor Network, the NF
Vendor Passport, lightweight NF admin, and the phases that deliver them. There
is no second roadmap document. Where this file and an older note disagree, this
file wins.

Written against commit `e1c0d52`. Companion documents:

- `docs/site-compliance.md` for what the live site actually does, the confirmed
  business identity, and the compliance obligations NF Club inherits.
- `docs/event-data.md` for confirmed public event facts.

Nothing in this document is a promise to a vendor or an attendee until it
appears in section P under **Locked**.

---

## 1. What this phase is

The public site is complete: homepage, `/events/expo-2026`,
`/events/halloween-2026`, plus `/privacy`, `/terms` and `/refunds`. This phase
adds four things behind and beside it.

1. **NF Club**, an attendee marketing membership with no attendee account.
2. **NF Vendor Network**, a vendor retention portal with accounts.
3. **NF Vendor Passport**, the loyalty system inside the Vendor Network.
4. **NF Admin**, a small internal tool for staff to run the above.

The site today has no database, no authentication and no server state
(`src/lib/*.ts` is static TypeScript). This phase is the first time NF takes on
a real backend, so the job is to do it deliberately and keep the blast radius
small.

---

## 2. Locked principles

These are settled and should not be relitigated while building V1.

**NF Club**

- Attendee facing.
- Its purpose is marketing and audience ownership: an NF-owned list instead of
  renting reach from Instagram or a ticketing platform.
- **No attendee account, no attendee login in V1.** A club signup must never
  create an auth user.

**NF Vendor Network**

- Vendor facing **retention portal**.
- **Not** a booking ERP. **Not** invoicing. **Not** payment collection. **Not**
  an Airtable integration. **Not** a replacement for Instagram vendor
  conversations yet.
- **The current sales workflow stays outside the portal.** Bookings continue to
  happen through Instagram conversations and NF representatives, and records
  continue to live where they live today. The portal's job is retention and
  visibility, on top of a sales process that does not change.

**NF Vendor Passport**

- The loyalty and retention system inside the Vendor Network.

**Cross cutting**

- **Attendance stays the north star.** A club signup or a vendor login is a
  supporting conversion, never the goal.
- **The marketing pages must not get slower.** The homepage and both event pages
  stay statically rendered with no database on their critical path. NF Club adds
  a form; it does not add a data fetch to page render.
- **Never invent facts.** No invented milestone benefits, no invented vendor
  history, no promised outcomes.
- **No guarantees to vendors.** Every benefit is written as eligibility or
  consideration. See section D for what is explicitly excluded and why.

---

## 3. Where each piece lives

| Surface | Route | Auth | Rendering |
| --- | --- | --- | --- |
| NF Club signup | `/club`, plus an embedded form on home, Expo, Halloween | None | Static page, server action on submit |
| NF Club success | Inline state, no route change | None | Client state |
| Vendor Network | `/vendors/...` | Vendor session | Dynamic, per request |
| Admin | `/admin/...` | Admin session | Dynamic, per request |

`/vendors` may later also carry a public "sell with us" page. Out of scope here,
and not to be conflated with the logged-in portal.

---

## A. NF Club V1

### A.1 Purpose

Build an NF-owned attendee audience: capture emails with explicit marketing
consent, understand what those attendees actually collect, know which surface
or event brought them in, and own that list rather than renting reach.

**V1 requires no attendee account and no login.**

### A.2 V1 fields

| Field | Required | Notes |
| --- | --- | --- |
| First name | Yes | One field. Do not split first and last. |
| Email | Yes | Lowercased and trimmed before storage and comparison. |
| Interests | Optional | Multi select. Signup must succeed with none selected. |
| Marketing consent | Yes | Unticked checkbox. Express opt in, never pre ticked, never bundled into the submit button. |
| Signup source | Automatic | Not a visible field. Derived from the surface plus `?src=` plus UTM parameters. |
| Created timestamp | Automatic | Set once at first signup, never overwritten. |

**Proposed interest list**, stored as data rather than a hardcoded enum so it
can change without a migration: Pokemon, One Piece, Sports Cards, Other TCGs,
Toys and Figures, Anime and Pop Culture, Comics, Art, Cosplay.

Not final. See section P.

### A.3 Signup surfaces

`/club`, the homepage, the Expo event page, the Halloween event page, physical
event QR codes, and future giveaway flows.

On the homepage and event pages this is a compact inline block. `/club` is the
full page version with the same fields.

### A.4 Signup flow

1. Attendee enters first name and email, optionally picks interests, ticks the
   consent checkbox.
2. Submit posts to a **Next.js Server Action**. No Supabase client and no anon
   key ever runs in the browser for NF Club.
3. Server validates, applies anti-abuse checks, upserts the subscriber, merges
   interests, appends a consent event, records the source touch.
4. The form is replaced in place by the success state. No navigation, no
   reload, no redirect.

**Anti abuse**, in order of preference: a honeypot field, a minimum time to
submit, per-IP rate limiting at the edge. **No CAPTCHA in V1.** A CAPTCHA is
real friction on the primary attendee path.

**Progressive enhancement.** A real `<form>` bound to a server action, so it
works before hydration and without client JavaScript.

### A.5 Success state

Three jobs:

1. **Confirm honestly.** Name NF as the sender, say what they will receive. If
   no welcome email is being sent because no provider is wired, **do not say
   "check your inbox."**
2. **Reflect their choices back**, so the interest picker feels like it did
   something.
3. **Point at attendance.** The signup is a leading conversion, not the finish
   line. End with the next real action: the next event page, or add to
   calendar. This is the most important detail in the whole feature.

### A.6 Duplicate email handling

The visible outcome is **identical** whether or not the email already exists.
Never say "you are already subscribed": poor experience, and it leaks whether
an address is on the list to anyone who can type it.

Server side, a repeat signup:

- keeps the original `created_at` and the original subscriber row
- **merges** new interests into the existing set rather than replacing it
- appends a **new consent event** if consent was given again
- appends a **new source touch**, so a second signup at a QR code is visible
- re-subscribes a previously unsubscribed person **only on fresh express
  consent**, recorded as a new consent event

### A.7 Interest updates

No attendee login in V1, so:

1. **Re-signup merges interests.** Ships in V1.
2. **A signed preference link in future emails.** `/club/preferences?token=...`,
   resolving to one subscriber, allowing interest edits and unsubscribe, with an
   expiry. Ships with the email provider phase, because there are no emails to
   put the link in until then.
3. **An attendee account.** Out of scope. Revisit only if NF wants per-attendee
   history, never just to let someone tick a box.

Because interests merge and never replace, V1 cannot express "I am no longer
interested in Sports Cards." Accepted limitation until the preference link
exists.

### A.8 Source tracking

Every signup records a stable slug. **Proposed scheme, not locked:**

- `homepage`
- `expo-2026`
- `halloween-2026`
- `expo-entry-qr`
- `expo-giveaway`

QR destinations are ordinary URLs carrying the slug, for example
`/club?src=expo-entry-qr`. Distinct codes per placement are what make on-floor
signup measurable.

**The convention must be agreed before any signage is printed.** UTM parameters,
when present, are captured alongside the slug on the same source-touch row. The
slug is the primary dimension because it survives sharing, reprints and campaign
renaming.

### A.9 Unsubscribe and suppression

Unsubscribing sets a status; it does not delete the row. The record is needed as
a suppression list, and deleting it would let the address be re-added by a later
import.

Proposed statuses: `subscribed`, `unsubscribed`, `bounced`, `complained`.

- Only `subscribed` is ever exported to a provider.
- `complained` is terminal and is never automatically re-subscribed, even on a
  new form signup. A spam complaint is a stronger signal than a form tick.
- A deletion request under PIPEDA is a genuine erase plus a hashed suppression
  entry, not a status change. Manual in V1, and it needs a named owner.

### A.10 Consent requirements

NF Club inherits the compliance foundation already in the repo. See
`docs/site-compliance.md` section 8 for the full checklist. In short:

- **Express consent**, captured by an unticked checkbox with plain wording.
- **Consent wording stored with a version identifier**, so it is provable later
  which wording a given person agreed to. A boolean is not enough.
- **Timestamp, source, and request metadata** on every consent action.
- **Consent history is append only.** Never edited, never deleted.
- **Every commercial email must identify the sender, carry a working
  unsubscribe, and include a valid mailing address** (CASL).

### A.11 Future email provider

**No provider is selected, and none is selected in this phase.**

Rules that keep the option open:

- **Postgres is the system of record** for subscriber identity, consent,
  interests, signup source and suppression state. The provider is a delivery and
  synchronisation service, never the source of truth for consent.
- **One way push first.** Subscriber, status, interests and consent proof go
  out. Nothing is read back as authoritative except delivery signals (bounced,
  complained, unsubscribed at provider), which map onto the same status field.
- **An outbox marker, not a real time integration.** A `synced_at` column or a
  small outbox table is enough for a background job. Do not build event-driven
  syncing for a list this size.

Provider selection is deferred to section P.

---

## B. NF Vendor Network V1

A **retention portal**. It exists so a vendor can see that NF remembers them,
and so NF has somewhere to put loyalty that currently lives in nobody's head.

**Explicitly not** an invoicing system, a payment system, a booking system, a
contract system, a table map, or an ERP. No payment status, no invoices, no
balances, no transaction management in V1. No Airtable integration designed or
built.

The portal must feel useful **even though bookings still happen through NF
representatives.** That is the design constraint, not a caveat.

### B.1 Vendor accounts

Authentication is per person; the profile is the business.

- **Magic link sign in** (email link) rather than a password. Vendors sign in a
  handful of times a year, and password resets would be most of the support load
  for almost no benefit.
- Self signup is allowed, but a new profile starts at **zero stamps** and
  `pending_verification`. Historical stamps are only ever added by NF staff
  against real completed bookings. Without this, anyone could create an account
  and claim the history the Passport is supposed to prove.
- One profile may eventually have more than one person on it. V1 assumes one
  account per profile, modelled so it can grow.

### B.2 Vendor profile fields

Business name, contact name, email, Instagram handle, logo, city, product
categories.

Product categories reuse the NF Club interest vocabulary where they overlap, so
the two lists do not drift. Logo is an uploaded image in a per-vendor storage
path. Profile email is the business contact address and may differ from the sign
in address.

### B.3 Dashboard

One screen, in this order:

1. **Vendor Passport card.** Current milestone name, lifetime stamp count, and
   progress to the next milestone stated plainly: "2 more completed events to
   reach Preferred Vendor."
2. **Unlocked benefits**, worded as eligibility. Locked benefits are visible but
   clearly marked as not yet reached, because the point of a loyalty system is
   that the next tier is legible.
3. **Completed-event stamp history.** Event, date, short note. A vendor should
   see exactly which bookings produced their count. That is what makes the
   number trustworthy and prevents most support questions.
4. **NF Opportunities**, and only when an active one exists that they are
   eligible for. See section E.
5. **Profile**, editable by the vendor.

No scores, no rankings, no comparison to other vendors, no internal standing
label.

---

## C. NF Vendor Passport

### C.1 Core rule

**One fully completed NF event booking equals one Passport stamp.**

A vendor earns a stamp only after completing **100% of the booking NF agreed
to**.

- Two-day show, booked both days: must complete both days.
- Three-day Expo, booked all three days: must complete all three days.
- **NF-approved one-day booking:** if NF specifically booked the vendor for one
  day only, completing that agreed booking qualifies.

**No stamp for:**

- cancellation
- no show
- leaving before completing the booking without NF approval
- booking and not completing the event

**The stamp is awarded after the event.** Never at booking time.

### C.2 How a stamp gets awarded

There is no booking system for the platform to read, so in V1 **stamps are
awarded manually by NF staff in the admin tool** after each event. This is the
largest operational dependency in the plan, and it is a process to design, not a
button to build:

- who runs the post-event awarding pass, and by when
- what counts as evidence a booking was completed
- what a vendor is told if they disagree with a missing stamp

Automating this later means integrating the real booking record. Phase 6 at the
earliest.

**Data integrity rules:**

- **One booking stamp per vendor per event**, enforced by a uniqueness
  constraint so a second admin pass cannot double stamp. Bonus stamps (section
  F) are a different type and are exempt.
- **Stamps are corrected by voiding, not deleting.** A removed stamp keeps its
  row and gains a void timestamp, the staff member who voided it, and a reason.
  Milestone counts use active stamps only. This keeps history auditable, which
  matters the first time a vendor asks why their count changed.
- **Milestones are derived, never stored.** Current milestone is computed from
  active stamp count at read time. A stored status field would drift.

### C.3 Proposed tiers

**Proposed thresholds, not immutable.** They live in a database table, not in
code, so thresholds and benefit wording change without a deploy.

Benefit language is written the way it must appear to vendors: eligibility and
consideration, never a guarantee.

#### 0 to 2 stamps: NF Vendor

Basic Passport membership. Shows lifetime stamps, NF history, and progress to
the next milestone. No major privileges yet.

#### 3 stamps: Returning Vendor

**Placement preferences.** The vendor may submit preferences such as:

- wall
- aisle
- closer to the entrance
- away from the stage
- near another vendor
- quieter area
- accessibility requirement

These are **preferences, never guarantees. NF retains final placement control.**

Also eligible to be considered for selected NF promotional opportunities.

#### 5 stamps: Preferred Vendor

**Table selection access.** For selected NF events, eligible vendors may choose
from a **designated pool of tables released by NF**.

NF may withhold any inventory it wants, including for sponsors, entrances,
operations, electrical requirements, the stage, food, premium placements, and
layout balancing. **Do not promise access to the entire floorplan.**

Also potentially:

- NF Vendor Feature eligibility
- selected promotional and content opportunities
- possibly a small one-time loyalty credit

**No monetary amount has been approved.** Do not write `$25` or any other figure
into policy, product copy or seed data.

#### 8 stamps: Veteran Vendor

- earlier table-selection access where offered
- stronger placement consideration
- higher priority for selected NF content opportunities
- higher priority for sponsor-activation consideration
- stronger multi-show loyalty offers

#### 12 stamps: Legacy Vendor

Prestige focused.

- Legacy Vendor badge and status
- strongest normal placement consideration
- highest consideration for selective NF opportunities
- occasional loyalty benefit
- potential physical recognition item later

**No permanent discounts are promised at any tier.**

### C.4 Wording rules

For whoever writes vendor-facing copy:

- Every benefit is phrased as "may", "eligible for", "considered for", or "where
  offered".
- Every benefit that depends on NF choosing says so in the same sentence.

---

## D. What the Passport deliberately excludes

These were considered and are **out**. Do not reintroduce them.

| Excluded | Why |
| --- | --- |
| Themed vendor zones | NF intentionally mixes vendor categories across the floor. |
| Artist Alley privileges | Artists performed poorly when isolated into a dedicated Artist Alley. Segregating them again would repeat a known failure. |
| Pokemon zones, One Piece zones, Vintage Row | Same reason. Category-based zoning is not part of the retention strategy. |
| Category segregation of any kind | Same reason. |
| Standby-list privileges | Not a reward, and it creates an expectation queue NF would then have to manage. |
| Guaranteed early booking advantage based on scarcity | **NF does not consistently sell out vendor inventory quickly.** Early access to something that is not scarce is not a meaningful reward, and framing it as one would be dishonest. |

Early table **selection** (choosing from a released pool) is different from
early **booking** (getting in before others) and remains in scope at 5 and 8
stamps.

---

## E. NF Opportunities

An **NF Opportunity** is a specific, time-boxed thing NF is actively offering to
some vendors.

**The module must never be a permanently empty dashboard section.** When nothing
is active, it does not render at all. No empty state, no "check back soon", no
teaser. An empty rewards shelf makes a loyalty programme feel abandoned.

### E.1 Categories

**Vendor Feature / Spotlight.** NF may seek vendors for Instagram Reels, "Meet
the Vendor" content, booth features, interviews, product or collection
showcases, skits, and promotional content. **Eligibility never guarantees a
social post. NF selects final participants.**

**Content collaboration.** Pack opening, vendor challenge, "What can $100 buy at
NF?", interview, collection showcase, promotional skit.

**Giveaway partner.** NF may seek vendors willing to contribute a giveaway item.
Possible NF value exchange may include a tag, a stage mention, a table mention,
and giveaway promotion. **Participation is optional.**

**Sponsor activation.** NF or a sponsor may seek trusted vendors for scavenger
hunts, QR activations, sponsored challenges and promotional activities.

**Larger-space opportunity.** Where NF has a larger footprint, an extra table or
a special placement available, eligible vendors may express interest.

### E.2 Rules

- **Eligibility is not selection.** Passport level and good standing decide who
  can express interest. **NF chooses the final participants**, and the interface
  says so on the opportunity itself and again on the confirmation.
- **No standby list**, no visible ranking, no application queue.
- An opportunity carries: title, description, open and close window, minimum
  milestone, whether good standing is required, status of draft, active or
  closed.
- A submission carries: vendor, timestamp, optional short note, status of
  submitted, shortlisted, selected, not selected, or withdrawn.
- Vendors see their own submission status. They never see how many others
  applied.

---

## F. Multi-show loyalty: the Passport Challenge

Strategically important, because NF vendors often commit slowly.

**Proposed concept:**

> Complete 3 qualifying upcoming NF events and receive **+1 bonus Passport
> stamp**.

How it behaves:

- A vendor opts into a challenge naming the specific qualifying events. The
  challenge is created and confirmed by NF rather than self-declared, because
  the underlying bookings happen off platform.
- **The bonus is issued only after ALL qualifying commitments are successfully
  completed.** Booking three and cancelling one does not qualify. Two of three
  earns nothing extra; the two ordinary stamps for those two events are of
  course still awarded normally.
- A cancellation or no show on any leg voids the challenge. Whether a voided
  challenge can be restarted is undecided.
- Optional incentives that may be added later: rate lock (section G), stronger
  placement consideration, a one-time future credit.
- **No monetary values are locked.**

Bonus stamps are stored as a distinct stamp type so "events completed" and
"stamps earned" can always be told apart in reporting.

---

## G. Rate lock

A **potential future loyalty incentive**, documented so the concept is on record.

A vendor committing to several qualifying NF shows may lock the current standard
vendor table rate for **those specific bookings**.

- Vendor gets price certainty.
- NF gets earlier commitment.

**Rate lock is not always available.** It can be activated selectively by NF, for
specific challenges or specific shows. Do not present it as a standing tier
benefit.

---

## H. Good standing

**Passport loyalty and vendor behaviour are separate systems.** Lifetime stamps
represent completed NF history. Standing represents whether NF wants to keep
working with the vendor. Conflating them would mean a well-behaved new vendor and
a problem vendor with twelve stamps get treated by the same number.

Internal-only states: `good_standing`, `review_required`, `restricted`,
`do_not_book`.

Possible internal reasons include: no show, leaving early, repeated late payment,
unauthorised merchandise, unsafe setup, serious complaints, repeated rule
violations, poor conduct.

- **Passport privileges can require good standing.** Opportunities, table
  selection access and loyalty offers are gated on it in addition to milestone.
- **Never expose a vendor reliability score publicly**, and never show the
  standing label to the vendor. A vendor whose benefits are gated sees a neutral
  state directing them to their NF contact, not a label and not a reason.
- Every standing change records who changed it, when, and why. Standing is easy
  to apply informally and regret, so the history is mandatory.

---

## I. Lifetime stamps versus active privileges

**Stamps are lifetime history.** A vendor who completed 7 qualifying NF events
keeps those 7 stamps. They never expire and never disappear.

Separately, **higher-tier active privileges may later require recent NF
participation.** Example concept: at least one completed NF event in the previous
12 months to keep tier-gated privileges active.

**The 12-month rule is not locked.** It is a product decision still requiring
approval, listed in section P. If adopted, it must be modelled as a separate
"active privileges" check derived from stamp dates, never by removing or
expiring stamps.

---

## J. Admin V1

A lean internal area at `/admin`, staff only, server rendered, no public entry
point. Staff should be able to:

- search vendors
- open a vendor profile
- view the Passport
- award a stamp
- void or correct a stamp
- view stamp history, including voided rows
- adjust internal vendor standing
- create an NF Opportunity
- deactivate an NF Opportunity
- view NF Club subscriber counts
- inspect signup source
- inspect interest breakdown
- inspect marketing-consent state

Two rules that are cheap now and expensive to retrofit:

1. **Every mutating admin action writes an audit row** recording actor, action,
   target and timestamp.
2. **Avoid deleting historical records.** Use void and correction models wherever
   a record has meaning. Admin does not browse raw subscriber emails as a default
   view: aggregate counts and distributions by default, individual lookup by exact
   email when there is a reason, export as a deliberate audited action.

---

## K. Backend direction

**Supabase (managed Postgres, Auth, Row Level Security, Storage) remains the
recommended V1 foundation.** Nothing found in this pass argues for changing it.

Expected use: Supabase Auth for the Vendor Network, Postgres for everything, RLS
for isolation, Storage for vendor logos, admin authorisation, NF Club
subscribers, consent history, vendor profiles, Passport stamps, milestone data,
and opportunities.

Why it fits:

- **The data is relational.** Vendors, events, stamps, milestones, opportunities,
  subscribers, interests and consent history are joins and constraints. A
  uniqueness constraint is what actually prevents a double stamp.
- **RLS enforces "a vendor sees only their own records" in the database**, not
  only in application code. That is the single most valuable property here. Every
  alternative leaves that guarantee in route handlers, where one missed check
  leaks another vendor's history.
- **Auth is included**, with magic links, which is the proposed vendor login.
- **Storage is included** for logos, with per-path policies.
- **It is still just Postgres.** If NF outgrows or dislikes Supabase, the data
  moves with a dump and restore. Not a one-way door.

Honest trade offs: it introduces a real third-party dependency and a few npm
packages into a project with three runtime dependencies; RLS is powerful and easy
to misconfigure, so policies must default to deny and "vendor A cannot read
vendor B" must be an explicit test; free-tier projects pause when idle, which is
fine for staging and needs a paid plan for production.

`docs/architecture.md` currently advises against premature database
infrastructure. This plan supersedes that **for the platform surfaces only**, and
that file should be updated when this is approved. **The marketing pages stay
database free.**

Explicitly not decided or built in this phase: **no email provider, no Airtable
integration, no payment or booking integration.**

---

## L. Data model

Minimum entities. Supabase `auth.users` handles accounts; these reference it
rather than storing credentials.

### L.1 Identity and vendors

| Entity | Key fields | Relationships |
| --- | --- | --- |
| `vendor_profiles` | business name, contact name, contact email, instagram, logo path, city, standing, verification state, created at | one to one with an `auth.users` row in V1, modelled to become one to many |
| `vendor_categories` | vendor profile, category slug | many to many against the shared category vocabulary |
| `vendor_status_history` | vendor profile, previous status, new status, reason, actor, timestamp | many per vendor, append only |
| `admin_users` | auth user, role | separate table so admin rights are never a client-settable claim |

### L.2 Events and Passport

| Entity | Key fields | Relationships |
| --- | --- | --- |
| `events` | slug, name, start date, end date, status | mirrors `src/lib/events.ts` by slug, see note below |
| `passport_stamps` | vendor profile, event, stamp type (`booking` or `bonus`), awarded at, awarded by, note, voided at, voided by, void reason | many per vendor; unique on (vendor, event) where type is `booking` and not voided |
| `milestones` | threshold, name, benefit list, display order | no foreign key; a vendor's milestone is derived by comparing active stamp count against thresholds |
| `passport_challenges` | vendor profile, status, created by, completed at, reward stamp | one row per multi-show challenge |
| `passport_challenge_events` | challenge, event | the specific qualifying events |

**Note on `events`.** The public site keeps reading `src/lib/events.ts`. The
database table is a thin mirror so stamps and opportunities have something to
point at. **Do not move public event content into the database in this phase**:
it would put a database call on the critical path of the marketing pages for zero
attendee benefit.

### L.3 Opportunities

| Entity | Key fields | Relationships |
| --- | --- | --- |
| `opportunities` | title, description, opens at, closes at, minimum milestone threshold, requires good standing, status | optionally linked to an event |
| `opportunity_submissions` | opportunity, vendor profile, note, status, submitted at | unique on (opportunity, vendor) |

### L.4 NF Club

| Entity | Key fields | Relationships |
| --- | --- | --- |
| `club_subscribers` | first name, email (unique, lowercased), status, created at, updated at, provider sync state | one row per person |
| `interests` | slug, label, display order, active | shared vocabulary with vendor categories where they overlap |
| `subscriber_interests` | subscriber, interest | many to many |
| `consent_events` | subscriber, consent type, granted or withdrawn, consent text version, source, ip, user agent, timestamp | many per subscriber, append only, never updated |
| `signup_sources` | slug, label, active | lookup table so source slugs stay canonical |
| `subscriber_source_touches` | subscriber, source, utm fields, timestamp | many per subscriber, one per signup attempt |

`signup_sources` could collapse into a plain slug column on the touch row. Keep
it as a table only if NF wants labels and reporting groups attached to sources.

### L.5 Cross cutting

| Entity | Key fields |
| --- | --- |
| `audit_log` | actor, action, target table, target id, metadata, timestamp |

Sixteen entities, or fifteen without `signup_sources`. Nothing speculative: no
vendor messaging, no notifications table, no attachments beyond the logo, no
analytics tables, no zones, no standby lists.

---

## M. Security and privacy

**Three roles, no overlap.** Public can create an NF Club subscriber and nothing
else. Vendor can read and write only its own profile, and read only its own
stamps, submissions and challenges. Admin can read and write vendor and Passport
data and read aggregate Club data.

**Enforcement:**

- **RLS on every table, defaulting to deny.** No table ships without an explicit
  policy set.
- Vendor policies compare the session user against the profile's auth user, and
  stamp, submission and challenge policies join through that profile rather than
  trusting a client-supplied vendor id.
- Admin access is checked through a database-side function reading `admin_users`.
  **Never a role claim the client can set**, and never a check that exists only
  in a route handler.
- "Vendor A cannot read vendor B's stamps" is an explicit test, not an
  assumption.

**Secrets and the client boundary:**

- The service role key is server only. Never in a client component, never in a
  `NEXT_PUBLIC_` variable, never shipped to the browser.
- **NF Club writes happen entirely in a server action.** No Supabase client runs
  in the browser on the marketing pages, so the anon key never touches subscriber
  data and no policy has to be trusted to prevent public reads of the list.
- Vendor sessions are cookie based and server handled.

**Data handling:** consent history append only, storing the wording version
actually shown; unsubscribe is a status so the record can suppress; deletion is a
real erase plus a hashed suppression entry; vendor logos live in a per-vendor
storage path; personal data is never logged.

---

## N. Compliance dependencies

The site now has a compliance foundation. `docs/site-compliance.md` is
authoritative; this is what NF Club inherits.

**Confirmed and available:**

| Item | Value |
| --- | --- |
| Legal entity | Nostalgia Fest Inc. |
| Privacy and general contact | Chris Chan, Director, at `nostalgiafestteam@gmail.com` |
| Jurisdiction | Ontario, Canada |
| Published policies | `/privacy`, `/terms`, `/refunds` are live |

**Blocking, unresolved:**

- **No public NF business or mailing address exists.** CASL requires a valid
  mailing address in every commercial electronic message. **NF Club must not send
  a single commercial marketing email until a suitable public address is
  resolved.** This blocks sending, not building: the signup form and the list can
  ship before it. **Chris's home address must never be used.**
- **No email marketing provider is selected.** See section P.
- **No retention schedule exists.** Needed once anything is actually collected.
  Do not invent one.

**Also required before NF Club goes live:**

- The Privacy Policy currently states, accurately, that the site collects
  nothing. **It must be updated before the signup form ships**, replacing those
  statements with what is actually collected and naming the email provider once
  chosen.
- Re-evaluate the cookie banner decision. A signup form alone does not require
  one; any analytics added alongside it does.

---

## O. Implementation phases

Each phase ends with something real and verifiable. Do not start a phase before
the previous one is actually done.

### Phase 1: platform and backend foundation

Supabase project, environment variables, base schema, RLS with an explicit
cross-vendor denial test, admin role foundation, audit log, server-side client
wired into the App Router. No user-facing feature.

**Done when** policy tests pass and migrations run clean from empty.

### Phase 2: NF Club V1

`/club`, the signup form, interests, explicit marketing consent, signup source,
duplicate handling, success state, and the admin subscriber view. Then integrate
signup points into the homepage, the Expo page, the Halloween page, and QR
landing flows.

**Done when** a signup from each surface lands with the correct source and an
auditable consent row. **Privacy Policy updated before this ships.**

### Phase 3: Vendor Network V1

Vendor authentication, vendor profile, dashboard shell, Passport visualisation,
milestone progress.

**Done when** a vendor can sign in, complete a profile, see a Passport with zero
stamps rendered correctly, and provably cannot read another vendor's record.

### Phase 4: Vendor Passport administration

Manual stamp awarding, corrections and voiding, stamp history, tier derivation,
good-standing gating.

**Done when** a full post-event awarding pass can be run by staff and the vendor
sees the correct milestone.

### Phase 5: NF Opportunities

Admin creation, eligibility, vendor expression of interest, NF final selection.
The Passport Challenge mechanic lands here too.

**Done when** an opportunity can be published, gated, applied to and closed, and
disappears from the dashboard when inactive.

### Phase 6: future platform expansion

**None of this is built during V1:** vendor interest and request forms, vendor
applications, online booking, table selection, payments, Airtable integration,
attendee accounts, NF-owned ticketing.

### O.1 Remaining public-site work, separate from the platform

Not blocked behind Phase 1.

- **Real ticket URLs.** `src/lib/tickets.ts` is the single wiring point; both
  events are `null` today.
- **Analytics and CTA tracking.** Choose a privacy-respecting tool and instrument
  the conversions in `docs/conversion.md`. Introducing this triggers the cookie
  consent requirement in `docs/site-compliance.md` section 2.1.
- **SEO and social metadata.** Share image still missing; add `og:image`,
  canonical URLs, event structured data.
- **Production QA.** Cross-browser and cross-device on real hardware, including
  reduced-motion states, plus Lighthouse and an accessibility sweep.
- **Domain connection.** Point `nostalgiafest.ca` from Hostinger to Vercel.
  Separately authorised, per CLAUDE.md.

---

## P. Decision status

### P.1 Locked

Settled. Build against these.

1. NF Club is attendee facing, exists for audience ownership, and **requires no
   attendee account in V1**.
2. Vendor Network V1 is a **retention portal**, not a booking ERP, not invoicing,
   not payment collection, not an Airtable integration, and does not replace
   Instagram vendor conversations yet.
3. **The current sales workflow stays outside the portal.**
4. **One fully completed NF event booking equals one Passport stamp**, awarded
   after the event, never at booking time, with no stamp for cancellation, no
   show, or leaving early without NF approval.
5. An NF-approved one-day booking, completed, qualifies for a stamp.
6. **Stamps are lifetime history** and never expire or disappear.
7. Stamps are corrected by **voiding with a reason, never deleting**.
8. Passport loyalty and vendor behaviour are **separate systems**. No public
   vendor reliability score, ever.
9. **NF Opportunities render only when an active opportunity exists.**
   Eligibility is never selection; NF chooses final participants.
10. **Excluded permanently:** themed vendor zones, Artist Alley privileges,
    category zones of any kind, category segregation, standby lists, and
    scarcity-based early booking advantage.
11. The Passport Challenge bonus is issued **only after all qualifying
    commitments are completed**.
12. **No permanent discounts** are promised at any tier.
13. Supabase and Postgres remain the recommended architecture; marketing pages
    stay statically rendered and database free.
14. **Postgres is the system of record** for subscriber identity, consent,
    interests, source and suppression. Any email provider is a delivery service.
15. Compliance identity: Nostalgia Fest Inc., Chris Chan as contact, Ontario.

### P.2 Proposed, needs Chris's approval

None of these may be presented to a vendor or an attendee until approved.

| # | Decision | Current proposal |
| --- | --- | --- |
| 1 | **Exact final Passport milestone benefits** | As drafted in section C.3 |
| 2 | **Whether 3 / 5 / 8 / 12 remain the final thresholds** | Proposed only |
| 3 | **Whether one-time monetary credits exist at all** | Undecided |
| 4 | **Credit amounts, if used** | **No figure approved. Do not write `$25` or any other value anywhere.** |
| 5 | **Table-selection rules**: which pool is released, what NF withholds, how selection is ordered | Principles in C.3; specifics undecided |
| 6 | **Whether active privileges require recent attendance** | Concept: at least one completed event in the previous 12 months. **Not locked.** |
| 7 | **Exact multi-show incentive package** | 3 events for +1 bonus stamp; any monetary or rate-lock component undecided |
| 8 | **Whether rate lock is offered, and when** | Concept only, selectively activated by NF |
| 9 | **Exact placement-preference rules** | Preference list in C.3; how requests are submitted, prioritised and communicated is undecided |
| 10 | **Final NF Club interest list** | Nine interests proposed in A.2 |
| 11 | **Final QR and source slug convention** | Proposed in A.8. **Must be agreed before any signage is printed.** |
| 12 | **Public NF mailing address** | **None exists. Blocks all commercial email.** Home address must never be used. |
| 13 | **Email marketing provider** | **None selected. Not selected in this phase.** |
| 14 | **Retention schedule** | None exists. Needed once anything is collected. |
| 15 | **Who runs the post-event stamp awarding pass, and what counts as proof** | Undecided. Everything in the Passport depends on this happening reliably. |
| 16 | **Whether a voided Passport Challenge can be restarted** | Undecided |
| 17 | **Vendor account verification model** | Open self-signup with staff verification proposed; invite-only is the alternative |
