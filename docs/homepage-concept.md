# Homepage Concept

First complete UX and visual specification for the Nostalgia Fest homepage. Bridges `docs/visual-directions.md` (locked direction) to implementation.

Nothing here is built. Every contrast, crop and reflow claim is **unverified** until there are pixels to measure. Copy marked _(draft)_ establishes hierarchy only and is not approved marketing copy.

**Authority order:** `docs/event-data.md` for facts → `docs/visual-directions.md` locked decision for visual rules → this document for homepage structure. Where an installed skill conflicts with any of those, they win. Notably, `landing-page-design`'s mandated glass island nav, gradient headings and word-by-word tagline reveal are **not used** — they contradict `docs/design-principles.md` and the locked decision.

---

## 1. Homepage Role

### What it must accomplish

1. Explain what Nostalgia Fest **is** — a TCG, collectibles, toys, artists and pop-culture event — within one viewport.
2. Establish credibility and scale through real previous-event photography.
3. Surface the **next event** with its date, venue and free admission, and hand off to its event page.
4. Convert brand-level interest into a free ticket.
5. Reduce the logistical friction that stops a free-event RSVP becoming an actual visit.

### What it must NOT accomplish

- **It is not the Expo 2026 landing page.** Full programming, full FAQ, vendor detail, message-matched ad copy and any future VIP tier live on the event page.
- It does not carry a vendor directory, a sponsor wall, a blog, a newsletter unit, or a photo gallery.
- It does not answer every question. It answers enough to make someone click through or register.
- It does not become a flyer. Event key art never becomes page background.

### Relationship to event pages

The homepage is **brand-first with a swappable featured-event slot**. Expo 2026 currently occupies that slot; Halloween 2026 replaces it after October 11, 2026, with no structural change.

**Traffic correction worth stating explicitly:** `docs/website-strategy.md` requires event landing pages to have strong message match with the ads driving traffic to them. That means **paid social for a specific event should land on the event page, not the homepage.** The homepage serves organic, direct, brand and returning-attendee traffic. This changes what it optimises for: brand comprehension over message match. The brief's journey map has paid social arriving at the homepage; that should be the exception, not the default.

| Concern | Homepage | Event page |
|---|---|---|
| What NF is (category comprehension) | **Owns** | Assumes |
| Message match to a specific ad | No | **Owns** |
| Social proof | Summary (3 images) | Fuller treatment |
| Full three-day hours | Summary | **Owns** |
| Parking, transit, entrance, FAQ | No | **Owns** (when confirmed) |
| Vendor / programming detail | No | **Owns** |
| Free ticket CTA | Yes | Yes |
| Multiple events | **Owns** | Single event only |

---

## 2. Visitor Journey

| Stage | Surface | Homepage contribution |
|---|---|---|
| Discovery (organic, brand, direct, returning) | Homepage | **Primary.** Explains category, scale, next event. |
| Discovery (paid social, event-specific) | Event page | Minimal — bypassed by design. |
| Event interest | Homepage → event page | Featured-event module and upcoming-events module hand off. |
| Free ticket | Ticketing platform | Homepage CTA initiates; the platform completes. |
| **Commitment** | Homepage post-ticket state + event page | **Shared.** Homepage offers calendar, directions, share. |
| Directions / planning | Event page primarily | Homepage carries address, map link, calendar. |
| Physical attendance | — | Homepage contributes only via commitment actions. |

**Handoff point:** the homepage owns everything up to and including the ticket click, plus the commitment actions immediately after it. The event page owns depth — hours detail, FAQ, parking, entrance, programming.

**Known leak:** we cannot reliably observe whether someone completed registration on the external platform. Section 11 handles this honestly rather than asserting a state we do not know.

---

## 3. Above-the-Fold Concept

### Structure

The hero is a **two-zone block**: a photographic zone and a solid brand-ink content zone that overlaps its lower edge. This resolves the locked requirement that free admission sit "inside the hero's visual field" without gambling text contrast on a busy photograph — the ink panel *is* the guaranteed contrast floor the locked principles demand.

### Media treatment

- **One photograph.** Warm, minimal grading, no colour wash, no blur, no glass panel.
- **Required characteristics (hard gate):**
  1. Collectible product legible in the foreground at the **375px** crop — card cases, binders, plush, boxed toys. Not "present in frame"; **legible**.
  2. Crowd density visible behind the foreground, carrying scale.
  3. Room architecture readable enough to signal a real venue.
  4. No individual's face dominant enough to read as a portrait or imply a named guest.
- **Lead candidate:** `crowd april 2026.jpeg` — glass card cases across the foreground, dense crowd and chandeliers behind, a parent holding a child mid-frame. It carries subject, scale and family in one frame.
- **Second candidate:** `front of show artist alley april 2026 crowd.jpeg` — plush and merchandise table foreground, grand staircase behind. Stronger toys/family read, weaker TCG read.
- **Contingency if neither passes the 375px legibility test:** add a single small inset image inside the hero block — a tight crop of a card case — rather than swapping to a hero that fails the subject requirement. Scale is recoverable later in the page; category comprehension is not.

### Hierarchy inside the hero, in reading order

1. **Eyebrow** — featured event name, small, uppercase-styled via CSS. _(draft: "Nostalgia Fest Expo")_
2. **Headline** — display, capped ~680px measure, `text-wrap: balance`. Must name the category, because the photograph proves scale but not subject. _(draft: "Trading cards, toys and collectibles under one roof")_
3. **Fact line** — plain typographic facts, tabular numerals. _(draft: "October 9–11, 2026 · Square One Event Hall, Mississauga")_ Not chips. Not truncated.
4. **Free marker** — gold, with the **word** "Free admission" plus a non-colour cue (a short rule or icon). Never colour alone.
5. **Primary CTA** — one filled flat brand-purple button. _(draft label: "Get free tickets")_

### Logo

**Restrained.** The bubble-script wordmark sits in the header at modest size and never inline with headline type. It is the signature, not the subject. Sole exception: it may appear once more in the footer.

### Secondary CTA

**None above the fold.** The paired directions action is sanctioned by the locked principles but belongs in Plan Your Visit, where it serves planning rather than competing with the ticket. One filled action per view.

### Must appear before scrolling

Wordmark · hero photograph with legible product · headline naming the category · event name · dates · venue · free marker · primary CTA · a visible cue that content continues.

### Must NOT appear before scrolling

Expanded navigation · secondary CTA · social proof · sponsor logos · event key art · any unconfirmed claim (food court, giveaways, parking, special guest) · newsletter signup · category grid · cookie wall covering the hero.

### Mobile hero (375px baseline, verify at 320px)

| Zone | Approx. viewport | Contents |
|---|---|---|
| Header | 56px fixed | Wordmark, menu trigger |
| Photograph | ~38vh | Art-directed portrait crop, focal point on the foreground cases |
| Ink panel | ~42vh | Eyebrow, headline, fact line, free marker, CTA |
| Peek | remainder | Top edge of the next section, signalling scroll |

- **Crop strategy:** explicit art direction per breakpoint via `<picture>` / `next/image` sources. Never a naive centre crop — the audit notes the best crowd shots place their subject low in frame and would be decapitated.
- **Free placement:** directly above the CTA, inside the ink panel, in the same viewport as the photograph.
- **CTA:** full-width **inset within the 16px layout margins** with a visible radius. Never edge-to-edge.
- **Survives at 375px:** everything in the table above.
- **Simplified at 375px:** headline drops to its shortest approved variant; venue renders as "Square One Event Hall, Mississauga" without the street address (the full address appears in Plan Your Visit).
- **Sticky relationship:** the sticky bar does **not** appear while the hero CTA is on screen. See section 13.

### Desktop hero

- **Composition:** full-bleed photograph, content block anchored lower-leading, occupying roughly 7 of 12 columns. Not a centred stack, and not the mobile layout scaled up.
- **Media treatment:** full-bleed with a **directional scrim** running from the leading edge, resolving to a solid enough floor beneath the text block. Where measurement fails, the block gains a solid panel rather than a heavier tint across the whole image.
- **Max content width:** 1280px container, text measure capped ~680px.
- **Negative space:** the trailing 40% of the frame stays clear of type so the room reads as a room. The photograph's own depth is the composition.
- **Height:** capped ~78vh so the next section is visible.
- **Photography/typography interaction:** type sits *within* the image, aligned to the grid, never centred over the focal point. On viewports beyond 1600px the image holds its focal crop rather than stretching.

---

## 4. Immediate Reasons to Attend — the category band

Directly after the hero. This is the **one permitted full-bleed solid brand-colour section**, and it is the primary carrier of NF identity at architectural scale.

### Treatment: typography-led on brand purple, not an icon grid, not photo tiles

Chosen deliberately over an editorial photo-tile grid because the asset audit found **no isolated product close-ups**. Tiles would be built from crops of wide environmental shots, and at tile size the subject would be illegible — reproducing the exact failure the locked decision corrected in the hero. A typographic band:

- costs no photography we do not have,
- delivers the required brand colour at architectural scale,
- is the fastest section on the page,
- avoids the generic icon grid the brief rules out.

**Anatomy:** deep brand-purple full-bleed surface · short section heading · a large-type category list · two supporting photographic insets where a crop genuinely works (`front of show artist alley...` for toys/plush, `carlos browsing art marvin...` for artists) · no CTA.

### Category language

Generic categories only: **trading cards · sports cards · toys and figures · comics · original art and artists · collectibles · pop culture and nostalgia**.

**Risk flag — do not typeset specific IP names.** "Pokémon", "One Piece" and similar appear on the promotional banner and in the photography, but typeset as homepage category labels they read as official partnership or licensed programming. The photography already shows them incidentally, which communicates the same thing without making a claim. Named IPs stay out of homepage copy unless a licensing position is confirmed.

---

## 5. Current Featured Event — Expo 2026

Positioned after social proof and marketplace, so the visitor understands *what NF is* before being asked to commit to a specific date.

### Contents (all from `docs/event-data.md`)

- Event name: Nostalgia Fest Expo
- Dates: October 9–11, 2026
- **Three-day hours block**, tabular numerals, one row per day: Fri 4–8 PM · Sat 11 AM–8 PM · Sun 11 AM–6 PM
- Venue: Square One Event Hall, 199 Rathburn Rd W, Mississauga, Ontario
- Free admission marker (gold + word)
- Positioning fact: approximately 200+ vendor tables

### CTA relationship

- **Primary:** "Get free tickets" — filled, brand purple. Same label as the hero. One vocabulary.
- **Secondary:** "See the Expo details" — outline, links to the event page.

Two actions here is justified: they are sequential steps toward the same outcome, not competitors, and this is not the hero.

### Event-specific visual treatment

Flavour comes from **one accent shift and photograph selection only** — never from a different layout, type system or component set. Expo uses the core purple/gold palette at full strength.

### Unconfirmed key-art handling

**Expo key art does not appear on the homepage in V1.** Per the locked kill list, displaying the banner publishes its unconfirmed claims (food court, hourly giveaways, free parking, secret special guest) regardless of framing. Blocked until those facts are either confirmed into `event-data.md` or removed from the artwork. The module is typographic and photographic instead — which it should arguably remain even after reconciliation.

### Swapping the featured event

The module is data-driven from a single event record: name, date range, per-day hours (optional), venue, admission status, event-page URL, optional photograph. Halloween 2026 populates it with **no hours row** (none is documented) and **no photograph** (none exists), degrading to a typographic composition on brand colour. That fallback is a design requirement, not an edge case.

---

## 6. Social Proof — "Scenes from previous Nostalgia Fest events"

### Treatment

**Editorial, fixed, three images. No carousel.** A carousel would hide two-thirds of our strongest evidence behind an interaction, add JS, and create an accessibility surface for no gain. Three is what we can show without repeating the same room.

### Selection, chosen for visual and narrative distinctness

| Image | Job | Why it is not redundant |
|---|---|---|
| `Crowd april 2026.jpg` | Scale | Wide packed ballroom — the scale proof the hero deliberately traded away for subject legibility |
| `carlos and kalvin doing deal april 2026.jpeg` | Marketplace trust | Handshake over a binder of graded cards — a transaction, not a room |
| `front of show artist alley april 2026 crowd.jpeg` | Family and breadth | Plush table, children, staircase — different subject, different palette, different framing |

Reserve pool if one is replaced: `Poncho chris jovi on stage april 2026.jpeg` (stage energy, and the only shot containing the physical NF banner), `carlos browsing art marvin april 2026.jpeg` (artists), `cassy doing deal april 2026.jpeg` (second transaction).

**Avoiding ballroom monotony:** only one of the three is a wide room shot. The other two are close and mid-range with different dominant colours. Combined with the hero, the page shows the ballroom at full width exactly **twice** — the locked cap on full-bleed photographic bands.

### Provenance — two levels, non-negotiable

1. **Section-level:** heading reads _(draft)_ "Scenes from previous Nostalgia Fest events".
2. **Per-image caption:** visible text naming what it shows and when — _(draft)_ "Artist alley — April 2026". Not a tooltip, not alt text alone, not croppable.

Alt text is informative and separate from the caption, describing the scene for someone who cannot see it.

### Layout

- **Desktop:** one large leading image (3:2) with two stacked supporting images (4:5 and 3:2) trailing. Asymmetric, editorial, all three visible at once.
- **Mobile:** vertical stack of three, 3:2 crops, captions beneath each. No horizontal scroll, no swipe, no peek. Long enough to feel substantial, short enough not to dominate the scroll.

---

## 7. What's at Nostalgia Fest — the marketplace module

Placed **after** social proof and separated from the category band by two sections, so the two do not read as redundant. The category band answers *what kind of event is this*; this module answers *what will I actually do there*.

### Contents

- Confirmed positioning: **approximately 200+ vendor tables**. This is the only quantitative claim on the page and it is the strongest one we have.
- Activity language grounded in what the audited photography actually shows: browse, buy, sell and trade with vendors; meet artists; find toys, figures and collectibles.
- Two supporting photographs from the deal/transaction set.

### Accounting for the missing product close-ups

The audit is explicit that no isolated product photography exists. This module therefore **leads with a number and activity language, not with product imagery**. Environmental transaction shots do the visual work — they show cards clearly enough at mid-size and carry human energy that a product shot would not.

**When close-ups arrive**, this module is where they belong: a small strip of three tight product crops beneath the activity copy. Designed as an additive slot, so acquiring the photography is an enhancement and not a blocker.

### Hierarchy

Section heading → the 200+ tables fact at display scale with tabular numerals → activity copy → two photographs → no CTA (the next section carries it).

---

## 8. Upcoming Events

### Card anatomy

A single reusable component, ordered: **event name → date range (tabular) → venue → admission status → CTA**. Optional hours line renders only when hours exist. Optional photograph renders only when one exists.

| Field | Expo 2026 | Halloween 2026 |
|---|---|---|
| Name | Nostalgia Fest Expo | Nostalgia Fest Halloween |
| Dates | October 9–11, 2026 | October 31 – November 1, 2026 |
| Hours | Three-day block available | **Not documented — omitted** |
| Venue | Square One Event Hall, Mississauga | Square One Event Hall |
| Admission | Free admission (gold + word) | Free admission (gold + word) |
| CTA | "See the Expo details" | "See the Halloween details" |
| Media | Photograph permitted | **None exists — typographic on brand colour** |

### Avoiding the wall-of-flyers effect

- **No key art in cards.** Cards are typographic and structural. This is the single most effective guard against the site becoming a flyer board, and it also sidesteps the unconfirmed-claims problem entirely.
- Maximum two cards visible without interaction; beyond two, the module links to an Events index rather than growing.
- The next event is marked with a small non-interactive status marker _(draft: "Next event")_ — a word plus colour, never colour alone.

### Free/paid status

Status renders from the event record. Free is gold plus the word. If a paid event ever exists, its status renders in neutral, never in a side-by-side tier comparison with a free event.

---

## 9. Plan Your Visit

Promoted well above its conventional position, per the locked principle that logistics are conversion content for a free event.

### Contents — confirmed data only

- **Venue:** Square One Event Hall
- **Address:** 199 Rathburn Rd W, Mississauga, Ontario
- **Hours:** the three-day block, tabular numerals, one row per day
- **Get directions:** outline action opening a map for the confirmed address — the sanctioned paired secondary action
- **Add to calendar:** downloads a hand-written `.ics` built from confirmed data. No library.

### Deliberately absent

**Parking and transit are not documented anywhere in `docs/event-data.md`.** The promotional banner claims free parking; that is unconfirmed and does not ship. Both are omitted entirely rather than hedged. Flagged in section 16 as a content gap — these are exactly the friction points `docs/conversion.md` names, and their absence is a real conversion cost worth resolving before launch.

### Mobile behaviour

Day rows stack with times right-aligned and tabular, reflowing at 320px and 200% zoom **without horizontal scroll**. Directions and calendar actions are full-width, inset, stacked, each meeting the 44×44px minimum.

### Numerals

`font-variant-numeric: tabular-nums` on the existing Archivo family. **No monospace family** — killed in the locked decision as an unnecessary third font download for an aesthetic gain.

---

## 10. Final Conversion Section

- **RSVP repeats:** yes. One filled "Get free tickets" — identical label and vocabulary to the hero.
- **Free reinforced:** yes, gold marker plus the word, adjacent to the CTA.
- **Event page promoted:** yes, as a subordinate outline action.
- **Support:** the date and venue restated in one plain line. Nothing else.
- **Urgency:** **none.** No countdown, no "spots filling", no fabricated scarcity. General admission is free and uncapped as far as we know; manufacturing scarcity would be a false claim and would undermine the free message.
- **Surface:** deep purple-tinted ink, tying back to the hero's ink panel and closing the page on brand colour.

---

## 11. Post-Ticket Commitment State

Required by `docs/conversion.md`: the ticket is the start of the funnel, not the end.

### The honesty constraint

We **cannot verify** that someone completed registration on an external platform. Nothing about the ticketing platform's redirect, webhook or API support has been confirmed. V1 must therefore never assert "You're registered."

### V1 — implementable now, no dependencies, no platform assumptions

A **soft commitment state** triggered by the ticket-CTA click, persisted in `localStorage` (wrapped in `try/catch`; read client-side after hydration to avoid an SSR mismatch; the page must render correctly when the value is absent or storage throws).

When set, the hero CTA cluster and the sticky bar swap to a commitment cluster:

- **Add to calendar** — generated `.ics`, confirmed data only
- **Get directions** — map link, confirmed address
- **Share with a friend** — Web Share API where available, copy-link fallback

Copy _(draft)_ is phrased as intent, not fact: **"Going to the Expo?"** — never "You're registered." A visible path back to tickets always remains, because the click may not have completed.

**Dismissible**, and the flag clears after the event date passes.

### Later

Verified registration state via a confirmed redirect parameter or platform API · email or push reminders · a personalised plan (what to bring, when to arrive) · a "who else is going" signal. **All blocked on platform verification.** None delays launch.

---

## 12. Header / Navigation

Small by design.

- **Desktop:** wordmark (leading) · Events · About · **Get free tickets** (filled, trailing). Four items total. Current page indicated.
- **Mobile:** wordmark · menu trigger. The trigger opens a simple full-screen panel — **not** a glass island pill (rejected: `landing-page-design`'s prescription conflicts with `docs/design-principles.md` on glassmorphism). Panel sets `inert` on background content, moves focus in on open, restores focus to the trigger on close, closes on Escape.
- **Events prominence:** Events is the first and most prominent link — it is the path to the conversion surface.
- **Header CTA:** desktop only. On mobile the bottom sticky bar carries it, because a header CTA plus a sticky bottom bar would violate the one-sticky-element rule.
- **Sticky behaviour:** header is **static on mobile** and sticky on desktop. Exactly one sticky element per viewport class.
- **Featured event emphasis:** none in the header. The hero carries it. A "Expo 2026" nav item would need editing every time the featured event changes.

---

## 13. Mobile Sticky CTA

| Property | Specification |
|---|---|
| Appears | After the hero's primary CTA scrolls fully out of view |
| Label | "Get free tickets" — identical to every other primary CTA |
| Free reinforcement | A short gold "Free admission" line above or beside the label, with the word present |
| Hides | While the featured-event CTA or the final CTA is in the viewport, so two identical actions are never adjacent |
| State change | Swaps to the commitment cluster when the post-ticket flag is set (section 11) |
| Height | ~64px content, plus `env(safe-area-inset-bottom)` |
| Content blocking | The page reserves bottom padding equal to the bar height, so nothing is ever obscured — including at 200% zoom |
| Motion | Slides in on a short transform/opacity transition; under `prefers-reduced-motion: reduce` it appears without translation |
| Scope | Mobile only. Desktop uses the sticky header. Never both. |

---

## 14. Visual System Applied

### Surfaces

| Surface | Use |
|---|---|
| **Paper** — warm off-white | Default page background: social proof, marketplace, featured event, plan your visit, upcoming events |
| **Brand ink** — deep purple-tinted near-black | Hero ink panel, final conversion section, footer |
| **Brand colour** — full-strength purple | The category band only. One full-bleed brand-colour section per page. |
| **Card** — white on paper, `1px` low-opacity border | Event cards, plan-your-visit block |
| **Photography** — `1px` low-opacity outline when contained; none when full-bleed | Per locked spec: pure black at 10% in light contexts, pure white at 10% in dark. Never a tinted neutral. |

### Colour roles

| Role | Value direction | Rule |
|---|---|---|
| Base | Warm off-white | Two page surfaces only, not five |
| Brand | NF purple / lavender | Structural: band, ink tint, CTA fill, active states |
| Status accent | Gold | **Only** free / confirmed / next. Always with a word. |
| Interactive | Cyan | **Only** focus rings and interactive affordance |
| Text | Warm neutral ramp | Distinct tokens for primary, secondary, separator |

**CTA:** flat brand-purple fill, light label. No gradient in any state. Gold is never a CTA fill — it means status, and one hue carries one meaning.

Primitives are named by hue; components reference **semantic role tokens only** (`--color-accent-solid`, `--color-bg-surface`), never `--purple-500` directly.

### Typography

`Archivo` variable, display and body. One family. No monospace. No italics.

| Role | Treatment |
|---|---|
| Display (hero headline) | Large, semibold, tight tracking, `text-wrap: balance`, ~680px measure |
| Section heading | Descending scale steps; a child heading never outweighs its parent |
| Body | 16px floor, 1.5–1.6 line-height, `text-wrap: pretty`, 60–75 character measure |
| Utility / logistics | Same family, regular weight, `tabular-nums` |
| Event dates and times | `tabular-nums` always, so day rows align |

The bubble-script wordmark is an **image asset**, never inline with headline type, never a font.

### Shape language

- **Radii:** buttons 8px, cards 12px, contained images 8px. Nested radii follow outer = inner + padding.
- **Borders:** all-round only. Never single-sided.
- **Pills/chips:** metadata only, **non-interactive**, so no hit-area or focus obligation attaches to decoration.
- **Sparkles:** maximum two per page — one near the wordmark, one at a section transition. `aria-hidden`, `pointer-events: none`. Decorative only.
- **Badges:** provenance badges on social-proof imagery, plus the "Next event" marker.
- **Image framing:** the sticker frame is killed. Contained images get the outline only.

### Spacing

Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96. Section padding 48px mobile, 96px desktop. Layout margin 16px mobile, 24px tablet. Inter-group gaps at least 2× intra-group gaps. Density is medium — generous around text, tighter around media.

---

## 15. Motion

### Allowed

| Pattern | Purpose |
|---|---|
| Section fade + 12–16px rise on first entry | Establishes the page as a sequence of moments and gives each section a beat. `IntersectionObserver`, never a scroll listener. Once per section. |
| Sticky CTA slide-in | Keeps the conversion action reachable at any scroll depth. A conversion mechanism, not decoration. |
| Press `scale(0.96)` on primary actions | Physical confirmation on touch. |
| Hover/focus state transitions ≤150ms on colour and opacity | High-frequency feedback that must feel instant. |

All motion sits behind `@media (prefers-reduced-motion: no-preference)`. Under reduced motion, translation is replaced with opacity and the sticky bar simply appears. **No state change is ever carried by motion alone** — every animated change leaves behind colour, an icon, or a label.

### Motion We Will Not Use

Hero parallax (fights the art-directed crop, costs mobile performance) · Ken Burns on the hero · carousels and autoplay · scroll-jacking · word-by-word or per-character text reveals (`landing-page-design`'s mandated tagline reveal is explicitly rejected) · number counters · looping sparkle twinkle · card tilt or rotation · page transitions · theme-switch crossfade · `transition: all` anywhere.

---

## 16. Media Requirements

| Need | Asset | Status |
|---|---|---|
| Hero — lead | `crowd april 2026.jpeg` | **Available** (verified visually) |
| Hero — alternate | `front of show artist alley april 2026 crowd.jpeg` | **Available** |
| Social proof — scale | `Crowd april 2026.jpg` | **Available** |
| Social proof — marketplace | `carlos and kalvin doing deal april 2026.jpeg` | **Available** |
| Social proof — family | `front of show artist alley april 2026 crowd.jpeg` | **Available** |
| Category band insets | artist-alley + art-table crops | **Available** |
| Marketplace | `cassy doing deal april 2026.jpeg`, `carlos browsing art marvin april 2026.jpeg` | **Available** |
| Wordmark | `Logo Final.png`, `Smaller Version Logo.png` | **Available** |
| Reserve — stage energy | `Poncho chris jovi on stage april 2026.jpeg` | **Available** |
| All HEIC photography (7 files) | crowd, giveaways ×3, other, sponsor, carpet | **Needs inspection** — not viewable in the audit environment; conversion required before any use |
| All video (10 files) | incl. the Expo announcement video | **Needs inspection** — not used in V1 |
| Product close-ups (cards, slabs, boxed toys) | — | **Missing** — additive slot in section 7, not a blocker |
| Halloween 2026 photography | — | **Missing** — typographic card fallback designed for it |
| Halloween 2026 key art | — | **Missing** |
| Sponsor logos | — | **Missing** — no sponsor treatment in V1 |
| `og:image` share asset | — | **Missing** — a hero crop with the wordmark; small production task |

**Does anything block implementation?** No. Every V1 section is satisfiable with already-verified JPEG/PNG assets. The two real gaps are **content, not media**: parking/transit facts for Plan Your Visit, and reconciliation of the key-art claims. Neither blocks a first build.

---

## 17. Performance Guardrails

- **Images:** `next/image`, AVIF with WebP fallback, explicit dimensions on every image so nothing shifts. Art-directed sources per breakpoint for the hero — not a single asset with `object-fit`.
- **Hero:** `priority` / preloaded, decoded eagerly, target ≤200KB at mobile widths. It is the LCP element and should be treated as such.
- **Everything below the fold:** lazy-loaded, no exceptions.
- **Video:** **none in V1.** When added: never autoplay on mobile, never a video-only hero, always a static poster that is itself a complete hero, `preload="none"`, and a visible pause control if it ever autoplays.
- **Fonts:** one variable family, `woff2`, self-hosted via `next/font`, Latin subset, roman only (no italic file — the design uses none), `font-display: swap`. Two files maximum.
- **Animation:** `transform` and `opacity` only. `IntersectionObserver`, never `scroll` listeners. `will-change` only where first-frame stutter is observed, never pre-emptively. Named transition properties, never `transition: all`.
- **JavaScript:** the page must render and convert with JS disabled — hero, facts, CTA link and all content are server-rendered. Sticky bar, commitment state and share are progressive enhancements.
- **No new dependencies** for V1. `.ics` is hand-written; share uses the Web Share API with a copy fallback.

---

## 18. Accessibility Guardrails

Design requirements to **verify after implementation**. None is verified now.

| Area | Requirement |
|---|---|
| Contrast | Every pair measured on its **rendered** background — hero text on the ink panel, gold on ink, CTA label on brand fill, captions on paper, cyan focus ring against each adjacent surface. Measured, not estimated. |
| Text over imagery | Only on a solid panel or a scrim verified as an opaque floor. Never an opacity guess over a busy photograph. |
| CTA states | Hover, active, `:focus-visible`, and loading — all present. Focus ring ≥2px, verified against every adjacent colour and in forced-colors mode. |
| Reduced motion | All motion behind `prefers-reduced-motion: no-preference`; the sticky bar appears without translation. |
| Tap targets | 44×44px minimum on touch. Extended hit areas must never overlap. Decorative layers get `pointer-events: none`. |
| Colour-only meaning | Forbidden. Gold free status always carries the word "Free admission"; "Next event" is a word, not a colour. |
| Free admission messaging | Present as text in the hero, the featured-event module, both event cards and the final CTA. Never conveyed by a colour or icon alone, never adjacent to a paid tier as a peer. |
| Images | Informative alt describing the scene for social proof; `alt=""` on decorative sparkles; captions are visible text, not a substitute for alt. |
| Structure | One `<h1>`, no skipped levels, one `<main>`, skip-to-content as the first focusable element. |
| Reflow | No horizontal scroll at 320px or 200% zoom. Day-hours rows are the highest-risk element. |
| Mobile panel | Focus moved in, background `inert`, Escape closes, focus restored to the trigger. |

---

## 19. Homepage Section Order (V1)

| # | Section | Conversion job |
|---|---|---|
| 1 | Header | Gives a way to the events surface and, on desktop, a persistent ticket action. |
| 2 | **Hero** | Answers all seven first-seconds questions in one viewport and offers the single primary action. |
| 3 | **What Nostalgia Fest is** (category band) | Proves the event is broader than a card show, and carries NF identity at architectural scale. |
| 4 | **Scenes from previous events** (social proof) | Converts "sounds fine" into "this is real and busy" using evidence, clearly labelled as past events. |
| 5 | **What you'll find** (marketplace) | Answers "what will I actually do there" with the 200+ tables fact and real transaction imagery. |
| 6 | **Next event: Expo 2026** | Commits the visitor to a specific date with full hours, and hands off to the event page. |
| 7 | **Plan your visit** | Removes the logistical friction that stops a free RSVP becoming an actual visit. |
| 8 | **More Nostalgia Fest events** | Catches anyone who cannot make the Expo, so interest is not lost. |
| 9 | **Final CTA** | Last conversion opportunity, restating free admission without manufactured urgency. |
| 10 | Footer | Legal, contact, secondary navigation, wordmark. |
| — | Mobile sticky CTA (overlay) | Keeps the primary action reachable at any scroll depth. |
| — | Post-ticket commitment state (conditional) | Shifts the goal from registering to actually attending. |

---

## 20. Desktop vs Mobile Differences

| Concern | Mobile | Desktop | Why it differs |
|---|---|---|---|
| Hero composition | Photograph zone above a solid ink panel | Full-bleed photograph with text inside it on a directional scrim | At 375px a busy photograph cannot host five stacked elements safely; a solid panel guarantees the contrast floor |
| Hero crop | Art-directed portrait, focal point on foreground cases | Landscape, focal crop held beyond 1600px | A centre crop decapitates subjects that sit low in frame |
| Primary CTA | Full-width, inset within layout margins | Inline, auto-width | Thumb reach vs. pointer precision |
| Sticky element | Bottom bar with the CTA | Sticky header with the CTA | One sticky element per viewport class; thumb reach on mobile |
| Header CTA | Absent (sticky bar carries it) | Present | Avoids two competing persistent actions |
| Navigation | Full-screen panel behind a trigger | Four inline links | Small viewport cannot carry inline nav plus wordmark |
| Social proof | Vertical stack of three, 3:2 | One large plus two stacked, asymmetric | Asymmetry needs width; stacking preserves caption legibility |
| Category band | Category list stacked, one inset image | Category list at display scale, two insets | Large-type lists need width to avoid excessive wrapping |
| Hours block | Rows stacked, times right-aligned | Rows in a contained block beside the address | Reflow requirement at 320px |
| Venue string | "Square One Event Hall, Mississauga" in hero | Full string available | Prevents truncation of a critical fact |

---

## 21. V1 vs Later

### V1 — build this

Sections 1–10 as ordered above · art-directed hero with the two verified candidates · category band on brand colour · three fixed social-proof images with two-level provenance · marketplace module with the 200+ tables fact · featured-event module with the three-day hours block · plan-your-visit with address, hours, directions link and `.ics` · upcoming-events cards for Expo and Halloween (Halloween typographic) · mobile sticky CTA · soft post-ticket commitment state · full accessibility and performance guardrails.

### Later — must not delay launch

Video of any kind · verified registration state and reminders · product close-up strip · Expo key-art module (blocked on fact reconciliation) · parking and transit content (blocked on confirmation) · sponsor treatment · vendor directory · homepage FAQ · photo galleries beyond three images · newsletter · countdown or live "open now" status · Halloween photography and key art · internationalisation · a second brand-colour section.

**Cut deliberately from V1:** any carousel, any icon grid, the three-chip fact row, monospace numerals, the gradient CTA, key art anywhere on the page, urgency mechanics, and any claim not present in `docs/event-data.md`.

---

## Final Design Test

| Test | Verdict |
|---|---|
| Looks like TCG/collectibles rather than a conference? | **Conditional pass.** Depends entirely on the hero passing the 375px foreground-legibility gate. The contingency inset is specified. This is the single highest-risk assumption in the document and the first thing to verify. |
| Communicates FREE immediately? | **Pass.** Gold marker plus the word, inside the hero visual field, repeated in four further places. |
| Recognisably Nostalgia Fest? | **Pass, with a caveat.** The wordmark plus a full-bleed brand-purple band carries identity at architectural scale. Weaker than the "Sticker Book" direction would have been; that was a deliberate, documented trade. |
| Works without video? | **Pass.** No video in V1. Video is an additive slot only. |
| Works on narrow mobile? | **Pass by design, unverified in fact.** Every section has a specified 375px behaviour; 320px and 200% zoom are stated verification gates. |
| Avoids becoming a flyer? | **Pass.** No key art anywhere on the homepage. Event cards are typographic. |
| Expo swappable for a future event? | **Pass.** The featured-event module is data-driven, with documented degradation when hours or photography are absent — the exact Halloween case. |
| Pushes toward showing up, not browsing? | **Pass.** Plan Your Visit is promoted above its usual position, and the post-ticket commitment state exists specifically to convert registration into attendance. |
| Unconfirmed claims excluded? | **Pass.** No food court, giveaways, parking, transit, sponsors, guests, or named IPs. Only dates, venue, address, hours, free admission and ~200+ tables. |
| Every visual device earning its place? | **Pass after revision.** Photo tiles in the category band, the featured-event key-art module, the social-proof carousel and a separate monospace family were each considered and cut for a stated reason rather than kept as decoration. |
