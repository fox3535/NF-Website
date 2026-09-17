# Site Compliance

A practical Canadian and Ontario compliance baseline for the Nostalgia Fest
website. **This is not legal advice.** It records what the website actually
does, so the published policies can be written against reality instead of
against assumptions, and so the gaps are visible.

Audited against commit `5899aa1` on September 17, 2026. Code is the source of
truth throughout: where documentation and code disagreed, the code won.

**Update, September 17, 2026: confirmed business decisions implemented.**
Chris has now confirmed the business identity, the paid-ticket refund and
cancellation framework, the photography/video position, and reconciled the
Halloween claims. Section 3 below has been updated in place to show what is
now resolved and what is genuinely still open. See "Confirmed business
identity" and the resolved items throughout section 3.

### Confirmed business identity

| Item | Value |
| --- | --- |
| Legal entity name | Nostalgia Fest Inc. |
| Privacy/contact person | Chris Chan, Director |
| Privacy/contact email | `nostalgiafestteam@gmail.com` (a personal Gmail address, approved by Chris for use on the site for now) |
| Jurisdiction | Ontario, Canada |
| Public business/mailing address | **None yet.** Chris's home address must never be published. See "Still unresolved" below. |

**Business requirement, not yet met:** Nostalgia Fest needs a public
business/mailing address before NF Club begins sending commercial marketing
email. CASL requires every commercial electronic message to include a valid
mailing address (or another way to be reached) for the sender. This is
tracked as open in section 3.1 and section 8, and must be resolved before
any NF Club send, not just before NF Club launches its signup.

Also resolved: Expo 2026 sells no VIP tier and is Free General Admission
only (a business decision, not a technical constraint). Every Expo VIP
reference has been removed from the site and from `docs/event-data.md`. See
section 5 for the Expo and Halloween claims audit.

---

## 1. What the site actually does today

### 1.1 Public routes

| Route | Type | Notes |
| --- | --- | --- |
| `/` | Static | Homepage |
| `/events/expo-2026` | Static | Event page |
| `/events/halloween-2026` | Static | Event page |
| `/privacy` | Static | Added by this pass |
| `/terms` | Static | Added by this pass |
| `/refunds` | Static | Added by this pass |

There are no API routes, no server actions and no dynamic routes.

### 1.2 Personal information collected: none

Verified by searching the whole of `src/`:

- **No forms.** No `<form>`, no `<input>`, no `<textarea>` anywhere.
- **No email capture.** Nothing on the site accepts an email address.
- **No accounts, no login, no session.**
- **No outbound data.** No `fetch`, no `XMLHttpRequest`, no `sendBeacon`, no
  API route. The site never transmits anything anywhere.

A visitor cannot give Nostalgia Fest personal information through this website
today, by any route.

### 1.3 Tracking: none

- No analytics of any kind. No `gtag`, no `dataLayer`, no Google Analytics, no
  Plausible, no Vercel Analytics.
- No Meta Pixel, no `fbq`, no advertising or conversion tracking.
- No behavioural tracking, no session recording, no heatmaps.
- No third-party script tags anywhere in the app.

### 1.4 Cookies: none

There is no `document.cookie` anywhere in the codebase. The site sets zero
cookies, first-party or third-party.

### 1.5 Browser storage: one functional key

`src/lib/commitment.ts` writes a single `localStorage` key:

| Key | Value | Purpose | Transmitted? | Expiry |
| --- | --- | --- | --- | --- |
| `nf-going-expo-2026` | `"true"` | Remembers that this browser used a ticket action, so the page can offer calendar and directions instead of asking again | **No, never leaves the device** | Ignored and removed after 2026-10-12 |

Every read and write is wrapped in `try/catch`, so the site works normally when
storage is blocked. No `sessionStorage` and no IndexedDB anywhere.

This is functional storage under the visitor's own control, holds no identifier
and no personal information, and is never sent anywhere. It does not require
consent.

### 1.6 Third parties receiving data

| Third party | When | What it receives |
| --- | --- | --- |
| **Vercel** (hosting) | Every page request | The request itself, inherently including IP and user agent, in order to serve the page |
| **Google Maps** | Only if a visitor clicks "Get directions" | Nothing until clicked. The click is an ordinary outbound link that leaves the site |

That is the complete list. **Verified in the browser: every network request on
every page is first-party (`localhost:3000` in dev, the site's own domain in
production). Zero third-party domains are contacted on page load.**

Specifically worth noting:

- **Fonts are self-hosted.** Archivo is loaded through `next/font/google`,
  which downloads the font files at build time and serves them from the site's
  own origin (`/_next/static/media/*.woff2`). Viewing a page sends **no**
  request to Google Fonts and leaks no IP address to Google.
- **Video is self-hosted.** The three reels are local MP4 files in
  `public/videos/`. No YouTube, Vimeo or Instagram embed.
- **Images are self-hosted**, served through Next's own image optimizer.
- **No social embeds, no comment system, no chat widget, no ad network.**

### 1.7 Ticketing

`src/lib/tickets.ts` has `TICKET_URLS` with every entry `null`. **No ticketing
provider is connected.** Ticket actions currently link to an in-page anchor, so
no visitor data reaches any ticketing company today.

`hasAnyTicketProvider()` was added so the legal pages describe the real state
and switch automatically when a provider is wired in.

---

## 2. What needs consent

**Nothing, today.** There is no non-essential tracking, no cookie, no analytics
and no marketing collection to consent to.

### 2.1 Cookie banner decision: deliberately not added

A consent banner was **not** implemented, because there is nothing for it to
govern. A cookie popup that controls nothing is a dark pattern in its own
right: it trains people to dismiss consent UI, and it implies tracking that
does not exist.

No "Cookie Settings" link was added to the footer for the same reason.

**Introduce consent UI at the same time as the first piece of optional
tracking, not before.** When that happens it must:

- block optional scripts until a choice is made, rather than firing first
- offer Necessary (locked), Analytics and Marketing as independent controls
- give Reject Optional exactly the same prominence as Accept All
- remember the choice and let it be changed later from a footer link
- be keyboard operable with visible focus, and usable at 375px

---

## 3. Business decisions needed before these pages are final

The legal pages are live and honest, but **they are not production-final.**
Each item below is a decision only Chris can make. None was guessed. Each has a
`TODO(Chris)` in `src/lib/legal.ts`.

### 3.1 Identity and contact (blocked all three pages, now resolved except the address)

| # | Decision | Status |
| --- | --- | --- |
| 1 | **Legal entity name.** | **Resolved.** Nostalgia Fest Inc. All three pages now identify this entity via `LEGAL_ENTITY_NAME` in `src/lib/legal.ts`. |
| 2 | **Privacy contact address.** Required so people can make an access, correction or consent request. | **Resolved.** Chris Chan, Director, at `nostalgiafestteam@gmail.com`. A personal Gmail address, confirmed by Chris as approved for the site for now. |
| 3 | **General contact address** for terms and refund questions. | **Resolved.** Same address, `nostalgiafestteam@gmail.com`, used for both today. Kept as a separate constant (`GENERAL_CONTACT_EMAIL`) so a dedicated address can be swapped in later without touching the privacy contact. |
| 4 | **Registered business / public mailing address.** The venue address in `docs/event-data.md` is the **event venue** and must never be used as the business address. | **Still unresolved.** There is currently no public NF business/mailing address, and none has been invented. `BUSINESS_ADDRESS` in `src/lib/legal.ts` stays `null`. Chris's home address must never be published here. **Required before NF Club sends any commercial marketing email (CASL).** |
| 5 | **Governing province.** | **Resolved.** Ontario, Canada. Confirmed by Chris as where Nostalgia Fest Inc. is based and incorporated, not merely inferred from event locations. |

### 3.2 Refund and cancellation (blocked the Refunds page; framework now resolved)

A confirmed refund, cancellation, transfer and rescheduling framework now
exists for **future** paid tickets, approved by Chris. It is written to
apply automatically to any paid ticket Nostalgia Fest offers later, without
naming a specific product (there is no current paid VIP or other paid ticket
anywhere in `docs/event-data.md` to name). See `/refunds`.

| # | Decision | Status |
| --- | --- | --- |
| 6 | Is a future paid ticket refundable at all? | **Resolved.** Yes, until 7 calendar days before the event start date. |
| 7 | If so, by what deadline before the event? | **Resolved.** 7 calendar days before the event start date. After that, non-refundable unless NF cancels the event or a third-party ticketing provider requires otherwise. |
| 8 | Can a paid ticket be transferred to another person? | **Resolved.** No, non-transferable, unless NF explicitly states otherwise for a particular event. |
| 9 | How is a ticketing provider's service or processing fee treated on a refund? | **Resolved as a principle, not a guarantee.** Fee treatment depends on the applicable ticketing provider's own policy. The page explicitly does not promise these fees are always refundable. |
| 10 | If an event is **cancelled**, what happens to a paid ticket, and over what timeframe? | **Resolved.** Full refund, following the process of the applicable payment/ticketing provider. |
| 11 | If an event is **rescheduled**, do tickets carry over automatically, and can a refund be requested instead? | **Resolved.** The ticket remains valid for the rescheduled date. Whether a refund can be requested instead is not separately addressed and should be treated as not yet decided if it comes up. |
| 12 | What is the vendor and sponsor booking refund position? | **Still out of scope of the page**, as before: stated as handled separately and directly with NF, under whatever was agreed for that booking. |

**Still true:** no paid ticket exists today for any event (Expo 2026 is Free
General Admission only; Halloween 2026 has no VIP or other paid tier). The
page states this plainly and explains that the framework above applies
automatically once and if a paid ticket is introduced. **The Refunds page's
"Future paid tickets" section should be reviewed against the actual product
once a specific paid ticket is designed**, since the framework was approved
in the abstract, not against a concrete price or perk.

### 3.3 Privacy specifics

| # | Decision | Status |
| --- | --- | --- |
| 13 | **Retention schedule.** No retention period is stated, because none exists. | **Still unresolved.** Needed once anything is actually collected. Do not invent a schedule to fill this gap. |
| 14 | **Hosting region.** The policy says information may be processed outside Canada, which is the conservative and safe statement. | **Still unresolved.** Confirm the actual Vercel region configuration if a stronger statement is ever wanted. Do not claim Canada-only without verifying. |
| 15 | **Event photography.** How attendees are notified that photos and video are taken at events, and the position on featured content and minors. | **Resolved.** General event photography/video is confirmed for documentation and promotional use, implemented conservatively. See section 4 below for the full policy and the suggested venue notice. Published on `/terms`, cross-referenced from `/privacy`. |

### 3.4 Photography and video policy (resolved)

Approved position, implemented conservatively:

- **General event photography/video.** Nostalgia Fest events may be
  photographed or recorded for event documentation and promotional use.
  Published on `/terms` under "Photography at our events", cross-referenced
  from `/privacy`.
- **Notice.** For future events, NF should provide clear photography/video
  notice on event information where appropriate, and/or through visible
  venue signage. Neither is built as a live feature; both are a process
  commitment for event planning, not a website component.
- **Featured content requires direct permission.** Close-up interviews,
  testimonials, skits, posed promotional content, and individual
  vendor/attendee features require that person's direct permission before
  use. This is a materially higher bar than incidental event photography,
  and the Terms page states it as a separate rule rather than folding it
  into the general notice.
- **Minors.** Extra caution applies to identifiable minors. An identifiable
  minor is not used in the featured-content categories above without a
  parent or guardian's permission.
- **No overreach clause.** The policy does not claim that attending an event
  grants unlimited or perpetual rights to a person's likeness. It states the
  opposite explicitly, and gives a path to contact NF about a specific image.

**Suggested venue notice (reusable, not a live page).** For use on
day-of signage, a registration desk placard, or a printed program, once an
event is being planned in enough detail to place it:

> Photography and video notice: Nostalgia Fest events may be photographed
> or filmed for event documentation and promotional use. By attending, you
> may appear in resulting photos or video. If you are asked to take part in
> a close-up interview, testimonial, skit, or featured photo, we will ask
> your permission first. Questions or concerns about a specific photo or
> video can be sent to nostalgiafestteam@gmail.com.

Keep this notice's contact address in sync with `GENERAL_CONTACT_EMAIL` in
`src/lib/legal.ts` if that address ever changes.

---

## 4. Media and copyright review

Repository-level review only. Nothing was deleted, and nothing was searched for
on the web.

### 4.1 Published on the live site

| Asset | Location | Status |
| --- | --- | --- |
| `logo.png`, `logo-wide.png` | `public/images/brand/` | NF brand asset, project-provided |
| 6 event photos | `public/images/photos/` | Previous-event photography, project-provided. Labelled as previous-event on the site (Product Rule 4) |
| 3 reels | `public/videos/` | Previous-event video, project-provided |
| Expo and Halloween campaign posters, Collectr banners | `public/images/campaigns/` | Approved campaign creative |

### 4.2 Needs manual review

1. **Photograph and video subject consent.** The photos and reels show
   identifiable attendees, vendors and artists. Nothing in the repository
   records whether attendees were notified that photography would be used for
   marketing. This is the single largest unresolved media question, and it
   connects to decision 15 above.
2. **Sponsor marks inside campaign artwork.** Slab Sharks, Collectr and Card
   Catcher wordmarks are burned into the Expo and Halloween posters and the
   Collectr banners. Presumably supplied or approved by those sponsors, but no
   permission record exists in the repository. Worth confirming a written
   approval exists for each.
3. **Third-party trademarks visible in artwork and photography.** The posters
   carry "POKEMON", "ONE PIECE" and "POKEMON TCG TOURNAMENT" as text, and the
   photography shows branded product, graded slabs and comic covers. Using a
   trademark to describe what is genuinely sold and played at the show is
   normal for this industry, but the posters should not imply an official
   licence or endorsement from those rights holders.
4. **`references/` is not published.** Nothing under `references/` is served by
   the website. It is working material only.
5. **Unused campaign files.** `collectr-wall-final.png`,
   `expo-2026-hero-final.png`, `expo-2026-hero-v2.png` and
   `halloween-2026-banner.png` are untracked and unreferenced by any component.
   They ship nothing today but should be tidied or committed deliberately.

---

## 5. Marketing claims audit

Every visible claim was cross-checked against `docs/event-data.md`.

### 5.1 Supported

Expo: dates, venue, full address, all three days' hours, **Free General
Admission only (business decision: no VIP tier is sold for Expo 2026)**,
200+ vendor tables, food court, hourly giveaways, an unnamed confirmed
special guest, the three sponsors, and Collectr's Wall of Nostalgia with its
$1,000 prize breakdown by day.

Halloween: dates, venue, address, free general admission, the cosplay
competition, 150+ vendor tables, free parking, hourly giveaways, a Pokemon
TCG tournament (organizer not confirmed, not published), the three
sponsors, and the explicit absence of hours and VIP.

No fabricated pricing, perks, guest identity, sponsor activation or
tournament organizer appears anywhere. The pending states ("Announced soon",
"Coming soon") correctly publish nothing.

### 5.2 Resolved: `docs/event-data.md` reconciled with the approved Halloween poster

Previously flagged in this audit as documentation drift: the approved
Halloween poster (`halloween-landing-banner.png`) publishes 150+ tables,
free parking, hourly giveaways, a Pokemon TCG tournament, and the three
sponsors, none of which were in `docs/event-data.md` at the time.

**Resolved.** Chris confirmed all of these claims. `docs/event-data.md` and
`src/lib/halloween-content.ts` now state them, and the confirmed facts are
also present as real page text (not only inside the poster image) in
`HalloweenAnnouncements.tsx` and `HalloweenExploreFloor.tsx`, so screen
reader users receive the same information sighted visitors get from the
poster.

**Explicitly still not confirmed, and not published anywhere:** who runs the
Pokemon TCG tournament. "Upper Hand" has been raised internally as a
possible organizer but is not confirmed. Do not publish that name, or any
organizer attribution for the tournament, until `docs/event-data.md` is
updated with an explicit confirmation.

### 5.3 Minor

`docs/event-data.md` describes vendor tables as "approximately 200+ is the
current positioning", while the Expo page states "200+ vendor tables at Expo
2026" as a heading. The "+" already carries the approximation, so this reads as
supported, but confirm it is safe to state flatly.

---

## 6. Accessibility audit

All six public routes were audited in the browser at 1440px, 768px and 375px.

### 6.1 Fixed in this pass

- **Duplicate `banner` landmark on the legal pages.** The page-title block used
  a `<header>` inside `<main>`. Per ARIA-in-HTML that should be generic, but the
  browser exposed it as a second `banner` alongside the site header, which
  breaks landmark navigation for screen reader users. Changed to a `<div>`;
  verified one `banner` remains.

### 6.2 Verified passing

| Check | Result |
| --- | --- |
| Exactly one `<h1>` per route | Pass, all six |
| Heading hierarchy descends without skips | Pass |
| Landmarks (`banner`, `main`, `contentinfo`, `navigation`) | Pass, one each after the fix |
| Skip link to `#main-content` | Present in the root layout, visible on focus |
| Images with `alt` | Pass, 0 missing across all routes |
| Links and buttons with accessible names | Pass, 0 nameless |
| Horizontal overflow at 1440 / 768 / 375 | None on any route |
| Contrast, body prose | 6.17:1 minimum measured, exceeds AA |
| Contrast, headings and inline links | 5.13:1 minimum (inline link), all pass AA |
| Focus indicator | Global dual-tone `:focus-visible` ring in `globals.css`, visible on light, dark and brand surfaces |
| Reduced motion | All animation declared inside `prefers-reduced-motion: no-preference`, with a global `reduce` override |
| Colour as sole information carrier | None found |
| Reading measure on legal pages | 623px, roughly 68 characters, inside the 60 to 75 range |
| Mobile nav button | Correct: `sr-only` label, `aria-hidden` icon, `aria-expanded`, `aria-controls`, focus returned to trigger on close |

### 6.3 Noted, not changed

- Footer links, including the new legal links, are 24px tall. That meets WCAG
  2.2 AA target size (2.5.8, 24 by 24 minimum) and matches the existing footer
  navigation exactly. Raising only the new links would make the footer
  inconsistent. Worth revisiting as a set if a more generous touch target is
  wanted.

---

## 7. Long-dash rule

Site-wide rule: no em dash or en dash in user-facing copy.

**Verified clean.** Rendered `document.body.innerText` was scanned on all six
routes: **zero occurrences.** The only em dashes in `src/` are inside developer
comments, which do not render.

---

## 8. What must be revisited when NF Club launches

NF Club is **not built**, and the live Privacy Policy deliberately does not
describe it as existing. It currently says only that if an email signup is
added, consent will be asked for separately and this policy updated first.

Before any NF Club signup goes live, all of the following must exist. CASL
governs the email side and PIPEDA the personal information side.

| # | Requirement |
| --- | --- |
| 1 | **Express opt-in consent.** An unticked checkbox, never pre-ticked, never bundled into the submit button. Browsing is not consent. |
| 2 | **Consent wording plus a version identifier**, so it is provable later which wording a given person agreed to. |
| 3 | **Timestamp** on every consent action. |
| 4 | **Signup source** recorded (homepage, event page, QR code placement). |
| 5 | **Subscriber interests**, stored so they can be updated and never silently replaced. |
| 6 | **Unsubscribe and suppression.** Unsubscribe is a status, never a deletion, so the record can suppress future sends. Only subscribed records are ever exported. |
| 7 | **Consent history retained** as an append-only record, never edited. |
| 8 | **Duplicate email handling** that never reveals whether an address is already on the list. |
| 9 | **Privacy Policy updated before launch**, replacing the "we do not collect" statements with what is actually collected, and naming the email provider once chosen. |
| 10 | **Email provider disclosed** in the policy as a third party, once selected. None is chosen yet. |
| 11 | **Every email identifies the sender and carries a working unsubscribe link** (CASL). |
| 12 | **A valid public mailing address (or other CASL-compliant contact method) in every commercial electronic message.** Still unresolved: there is currently no public NF business/mailing address, and Chris's home address must not be used. This blocks NF Club from sending any commercial marketing email, not just from launching its signup. See "Confirmed business identity" at the top of this document. |
| 13 | **Re-evaluate the cookie banner decision.** A signup form alone does not require one, but any analytics added alongside it does. |
| 14 | **Email provider's own hosting/data-region details**, once a provider is chosen. Not yet known, and not to be guessed. |

See `docs/platform-v1-plan.md` for the full NF Club product plan. This section
covers only the compliance obligations.

---

## 9. Still open before production

Genuinely unresolved. None of these are guessed or invented anywhere in the
site, the legal pages, or this document.

1. **Public business/mailing address** (section 3.1, decision 4). Blocks NF
   Club from sending any commercial marketing email.
2. **Data retention schedule** (section 3.3, decision 13). Needed once
   anything is actually collected.
3. **Hosting region confirmation** (section 3.3, decision 14). The policy's
   conservative "may be processed outside Canada" statement stands until
   verified.
4. **Future NF Club email provider.** Not chosen. The Privacy Policy will
   need updating to disclose it once it is (section 8, items 9 to 10).
5. **Future paid-ticket provider details**, for whenever a paid ticket is
   actually introduced: which provider, its own fee and refund mechanics,
   and reviewing the Refunds page's "Future paid tickets" framework against
   the real product (section 3.2).
6. **Written sponsor approval on record** for the Slab Sharks, Collectr and
   Card Catcher marks in the campaign artwork (section 4.2, item 2).
7. **Legal review of all three published pages.** They are written
   conservatively and against verified behaviour and confirmed business
   decisions, but they have not been reviewed by anyone qualified.

### Resolved since the last audit

- Legal entity, privacy contact, contact email, and Ontario jurisdiction
  (section 3.1).
- Paid-ticket refund, transfer, cancellation and rescheduling framework
  (section 3.2).
- Photography/video position, including featured content and minors
  (section 3.3, section 3.4).
- `docs/event-data.md` reconciled with the approved Halloween poster,
  including confirmed sponsors (section 5.2).
- Expo 2026 VIP removed entirely: no VIP tier, section, or messaging
  anywhere on the site or in source-of-truth data (section 5.1).
