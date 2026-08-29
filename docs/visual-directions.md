# Visual Directions

Three distinct, strategically viable visual directions for the Nostalgia Fest website. This is a **direction exercise** — no implementation, no components, no final copy. Nothing here has been built.

Grounded in `docs/website-strategy.md`, `docs/design-principles.md`, `docs/conversion.md`, `docs/event-data.md` and the visual audit in `references/ASSET-INVENTORY.md`.

---

## Constraints that apply to all three directions

These are not per-direction choices. They hold regardless of which direction wins.

**Only publish confirmed facts.** `docs/event-data.md` is the authority. It confirms dates, venue, address, hours, FREE general admission, and "approximately 200+ tables" as current positioning. It does **not** confirm the food court, hourly giveaways, free parking, sponsors, or the "secret special guest" that appear on the Expo promotional banner. Every direction below reserves *slots* for those facts; none of them hardcodes an unconfirmed claim. If a fact is not confirmed by event-data, its slot does not render.

**FREE is structural, not decorative.** In all three directions, free general admission sits in the hero's primary fact group alongside dates and venue — never in a footnote, never inside a pricing table, never adjacent to a paid tier in a way that implies a choice is required to attend. There is currently **no confirmed VIP tier** in event-data. If one is confirmed later, it renders as a clearly subordinate secondary block *below* the free RSVP action, never as a peer card in a side-by-side pricing row. Side-by-side tiers are the single most likely way to accidentally break Product Rule 8, and all three directions forbid that pattern.

**Previous-event media is always labelled.** Every photograph from April 2026 or June 7 2026 carries a persistent, visible provenance marker — not a hover tooltip, not alt text alone. The label must survive cropping and must be legible at mobile sizes. Directions differ in *how* that label is styled, not in whether it exists. Any section built from previous-event media carries a section-level frame ("previous Nostalgia Fest events") so a scanning visitor cannot read a past activation as a current promise.

**No direction depends on video.** Per the audit, none of the ten MP4s has been visually verified. Every hero below is specified as fully resolved with static photography. Video is an *upgrade path* in each direction, not a load-bearing element.

**Shared foundations.** All three use the same spacing scale (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96), a small named type scale, logical CSS properties for direction-dependent spacing, `text-wrap: balance` on headings and `pretty` on descriptions, `1px` low-opacity image outlines, `scale(0.96)` on press, and `prefers-reduced-motion` honoured on every animation. Directions differ in expression, not in whether they have discipline.

**Colour is specified by role, not by count.** Each direction below lists base, brand, accent, CTA and text roles. Exact values are set at implementation against measured contrast on the surface each pair actually renders on — including text over photography, which is the highest-risk pair in all three directions. No contrast ratio is asserted here because none has been measured.

---

# Direction 1 — "Doors Open"

**Photography-led editorial.** The strongest proven assets carry the page.

## Core idea

The audit's clearest finding is that Nostalgia Fest already looks better in real photographs than in any layout we could invent. The April and June rooms are genuinely striking — a grand white ballroom with chandeliers and gold trim, filled wall to wall with people leaning over glass cases of cards. That environment is unusual for a collectibles show, and it is the single most persuasive thing we own. Most card shows happen in beige convention halls. Ours does not, and the photography proves it without a claim.

So this direction gets out of the way. The site behaves like a well-art-directed event magazine: full-bleed photography establishes place and scale, type is set with confidence and restraint, and the NF brand colour appears in small, deliberate places — the wordmark, the primary action, a sparkle accent at a section transition. Colour is earned, not applied.

Strategically this is the most direct route to attendance intent. The conversion problem for a free event is not price, it is *belief that it is worth the trip*. A photograph of a packed room answers that faster than any headline. The editorial framing also handles the breadth problem: one spread can hold a handshake over a binder, a kid at a plush table, and a host on a mic, and the visitor reads "big event" rather than "card show plus some other stuff."

The risk this accepts deliberately: restraint can drift toward anonymity. This direction leans on the wordmark, the sparkle accent, and the specific warmth of our photography to stay recognisably NF. If those three are removed, it becomes a generic event site — which is exactly why the hybrid recommendation at the end pulls identity elements back in.

## First impression

Within three seconds: *this is a real, large, busy event in an unexpectedly beautiful room, and it is happening on a specific date near me.* The feeling is anticipation and slight FOMO, not a sales pitch. Second beat: it is free.

## Hero treatment

- **Image treatment.** One full-bleed crowd photograph, warm and slightly contrast-lifted, no filter that fights the original colour. `Crowd april 2026.jpg` or `crowd april 2026.jpeg` — both have ceiling negative space that a headline can sit in without an overlay panel.
- **Background treatment.** The photograph *is* the background. A single vertical gradient scrim from transparent at the top to a dark ink at the bottom, dark enough to guarantee text contrast without greying out the room. No blur, no glass panel, no colour wash over the image.
- **Headline placement.** Lower-left, sitting on the scrim. Left-aligned, capped near a 680px measure so lines break where the thought breaks.
- **Fact group.** Directly under the headline, one horizontal row on desktop and a stacked pair on mobile: dates · venue · **free entry**. Free entry is set at the same visual weight as the date, not smaller, not a badge floating elsewhere.
- **CTA placement.** One primary action immediately below the fact group. Filled, brand-coloured, single. No secondary CTA competes above the fold; the secondary path (directions, add to calendar) lives lower in the Plan Your Visit section.
- **Logo.** Restrained. The wordmark sits in the header at modest size. It is a signature on the photograph, not the subject of the hero. This is the direction where the logo works *least* hard.
- **Mobile.** The photograph crops to a tall portrait frame centred on the densest part of the crowd. Headline and facts occupy the lower 45% over the scrim. The CTA is inset within the layout margins with a visible radius — never edge-to-edge. Hero height is capped so the next section peeks above the fold, signalling scroll.
- **Desktop.** Full-width, height capped around 78vh so the section beneath is visible. On very wide viewports the image holds its focal crop rather than stretching.

## Layout language

- **Section rhythm.** Alternating full-bleed photographic sections and contained text sections. The alternation is the rhythm — no two full-bleed moments run back to back.
- **Full-bleed vs contained.** Media bleeds to the viewport edges; text and controls stay inside the layout margins. This is the direction's defining spatial rule.
- **Card usage.** Minimal and late. Cards appear only where content is genuinely enumerable — the plan-your-visit facts, the FAQ. The "what's here" section uses full-bleed image bands with captions rather than a grid of cards, because a card grid is exactly what makes an event look like a generic listing.
- **Image proportions.** Editorial variety on purpose: one wide 21:9 establishing band, then a 4:5 portrait paired with a 3:2 landscape, then a full-bleed. Uniform aspect ratios would flatten the energy.
- **Whitespace density.** Generous around text, tight around images. Text sections breathe at 80–96px section padding; image bands sit near-flush.
- **Grids.** A 12-column desktop grid, but text blocks deliberately occupy asymmetric spans (7 of 12, offset) rather than centring everything. Mobile is a single column with 16px margins.
- **Overlaps.** One only: the section heading following a full-bleed band may pull up slightly to overlap the image edge, tying the caption to its photograph. Used once or twice per page, never as a motif.
- **Separators.** Space and image edges do the separating. Hairline rules appear only inside the FAQ and footer where space alone cannot carry the structure.
- **Event information priority.** Dates, venue and free entry appear three times: hero, a sticky compact bar that appears after the hero scrolls away, and the Plan Your Visit block. Repetition of the core facts is the conversion mechanism.

## Colour system

- **Base / background.** Warm off-white paper for text sections; deep warm ink (near-black, not blue-black) for photographic sections and the footer. Two surfaces, not five.
- **Primary brand colour.** NF pink-to-lavender, used as a *solid* not a gradient in UI contexts. It appears in the wordmark, the primary CTA, and active states.
- **Secondary / accent.** Gold sparkle for small accents and the "free" emphasis; cyan reserved exclusively for focus rings and interactive affordances so the hue keeps one meaning.
- **CTA treatment.** Filled brand pink with ink or white label, whichever measures correctly. Exactly one filled action per view; every peer action is neutral outline or text.
- **Neutral / text.** A warm neutral ramp — primary text, secondary text, and a separator token, each with its own role. Text over photography always uses the scrim, never a raw overlay opacity guess.

## Typography direction

- **Display personality.** A confident grotesque with real width contrast — `Archivo` in its expanded and standard widths. Large, tight-tracked, semibold. Editorial authority without novelty.
- **Body personality.** The same family at regular weight. One typeface across the site keeps this direction disciplined; the width axis provides the contrast that a second family would otherwise supply.
- **Logo interaction.** The bubble-script wordmark is a fixed image asset and never sits inline with headline type. It occupies the header and the footer. The contrast between the playful script and the sober grotesque is the point — they are kept apart so the script reads as a mark rather than as a font choice.
- **Expressive type.** Only in the hero headline scale and in section openers. Nowhere else.
- **Utility dominates.** Hours, address, FAQ, and all plan-your-visit content are set at comfortable reading sizes with tabular numerals for times. Nothing decorative touches practical information.

## Photography treatment

- **Cropping.** Art-directed per breakpoint. Every hero and band image gets an explicit mobile crop rather than relying on `object-fit` — the audit's best crowd shots have their subject in the lower third and would be decapitated by a naive centre crop.
- **Overlays.** A single directional scrim only where text sits. No colour tint over photographs; the pink would fight the warm ballroom light and read as a filter.
- **Borders.** `1px` low-opacity outline on contained images for edge definition. Full-bleed images get none.
- **Masks.** None. Shaped photo masks are the fastest way to make this look like a template.
- **Captions.** Every editorial photograph carries a real caption in small neutral text: what is happening and which event it came from. Captions do double duty as the provenance label.
- **Previous-event labelling.** The caption carries it inline ("April 2026"), and the social-proof section carries a section-level heading that frames the whole block as previous events. Two levels, so a visitor who reads only headings still cannot be misled.
- **Integration.** Images are argument, not gallery. Each one sits beside the specific claim it supports — the handshake photo next to the marketplace section, the family-at-the-plush-table photo next to the who-it-is-for section. There is no undifferentiated photo grid anywhere.

## Event-page behaviour

The master identity is the *system*: the grotesque, the spatial rules, the scrim, the caption style, the single-filled-CTA rule. Event pages inherit all of it.

- **Expo 2026** differentiates through photograph selection and one accent shift — the busiest, largest-scale crowd images, and gold used slightly more prominently to carry the flagship feeling.
- **Halloween 2026** differentiates through a darker base surface, cooler photograph grading, and a seasonal accent replacing gold. Same grid, same type, same rules. The event feels different without becoming a different website.
- **Future events** get a defined slot: one accent colour, one photograph set, optional key art in the designated key-art module (see below). Nothing else may change.
- **Key art placement.** Event key art appears in exactly one place: a contained, aspect-ratio-locked module near the top of the event page, framed as the event poster. It is presented *as an artefact* with its own border, never enlarged into a page background. This is the structural answer to "do not turn the website into a giant flyer."

## Motion principles

- **Scroll reveal on image bands** — a short fade and 12–16px rise as each band enters. *Purpose:* establishes that the page is a sequence of moments rather than one scroll of content, and gives each photograph a beat of its own. IntersectionObserver, never a scroll listener.
- **Sticky fact bar transition** — the compact date/venue/free bar slides down once the hero passes. *Purpose:* keeps the primary conversion facts and CTA reachable at any scroll depth. This is a conversion mechanism, not decoration.
- **Press feedback** — `scale(0.96)` on the primary CTA. *Purpose:* physical confirmation on touch.
- **Nothing else.** No parallax on the hero photograph (it fights the art-directed crop and costs mobile performance), no counters, no auto-playing carousels.

## Conversion strengths

- **Discovery.** Highly shareable — an editorial hero image with the wordmark makes a strong `og:image`, which matters for a brand driving traffic from social.
- **RSVP clicks.** One unmistakable action above the fold with zero competition, repeated in the sticky bar.
- **Mobile comprehension.** The tall crop plus stacked fact group means date, venue and "free" are legible in one glance without pinch-zoom.
- **Attendance intent.** This is its strongest suit. Belief that an event is worth attending is built by seeing it full of people, and that is the entire hero.

## Risks

- **Brand dilution — highest risk here.** Strip the wordmark and this could be any well-made event site. Distinctiveness rests almost entirely on photograph selection and two small accents. If a future event has weak photography, the direction has nothing to fall back on.
- **Too corporate.** The grotesque plus restraint can read as cold. Nostalgia Fest is warm and funny in its photographs; if the layout is too austere, there is a tonal mismatch between the design and the people in the pictures.
- **Not a card-show risk, but a "generic festival" risk.** It avoids looking like a card show by looking like an event brand — which many event brands also do.
- **Performance.** Full-bleed photography is the whole design, so this direction is the most sensitive to image weight. Requires art-directed `<picture>` sources, AVIF/WebP, priority hints on the hero, and disciplined budgets. Done carelessly it will be the slowest of the three on mobile.
- **Mobile adaptation.** Genuinely good if crops are art-directed; genuinely bad if not. There is no middle outcome. The audit already flags that the best crowd images have subjects low in frame.
- **Key art confusion.** Low. The poster module explicitly frames key art as an artefact.

## Implementation complexity

**Moderate.** The layout system is straightforward and mostly static. The real cost is the responsive image pipeline: per-breakpoint art direction, format negotiation, and the HEIC conversion the audit flagged as outstanding. No unusual JavaScript. The sticky bar and IntersectionObserver reveals are routine.

---

# Direction 2 — "Sticker Book"

**Nostalgia Fest's playful collectible identity, dialled up and disciplined.**

## Core idea

The bubble-script wordmark, the sparkles, the pink-to-lavender palette and the cyan glow are not arbitrary decoration — the audit confirmed they exist as a *physically produced* embroidered banner and as balloons on the show floor. That is a real identity with real-world presence, and this direction treats it as the primary design material rather than as an accent applied to a neutral layout.

The organising metaphor is a sticker sheet or a well-kept collection: things you peel, arrange, keep. That is emotionally exact for this audience. Collecting is the shared behaviour underneath TCG, toys, comics, plush and nostalgia — the site's structure can echo the pleasure of arranging a collection rather than the mechanics of buying a ticket. Content sits on tactile surfaces with soft radii and a slight physical lift, arranged with a little intentional irregularity, the way a sticker sheet is arranged.

Strategically this is the strongest answer to Product Rule 5. Nothing about this reads as a generic card show and nothing reads as a generic AI site — the palette alone rules out the SaaS default, and the tactile, hand-arranged quality rules out template-flavoured minimalism. It is also the most flexible for event identity, because a sticker system absorbs a Halloween variant naturally.

The discipline this direction absolutely requires: playful surfaces, serious information. The moment practical content — hours, address, RSVP — picks up the decorative treatment, the site becomes hard to use and starts to read as a children's site. Playfulness lives in the container; the contents stay plain.

## First impression

Within three seconds: *this is a specific brand with a personality, it is fun, and it is about collecting things I like.* Warmth and recognition before information. The date and the word "free" land immediately after.

## Hero treatment

- **Image treatment.** A contained hero photograph rather than full-bleed — a crowd or marketplace image sitting inside a rounded, slightly lifted "sticker" frame with a thin light border, set on a coloured page surface. The photograph reads as the top card in a collection.
- **Background treatment.** A flat brand-tinted surface — a pale pink-cream — with a very low-contrast repeating motif (small sparkles, widely spaced, near-invisible). Flat colour with restrained texture. No gradient mesh, no blobs, no glass.
- **Headline placement.** Above the photograph, not on it. This matters: keeping headline off the image removes the contrast risk entirely and lets the photograph stay unobscured.
- **Fact group.** A row of three small "sticker" chips directly under the headline: date · venue · **free entry**. The free chip is the one that carries the gold accent, making it the most visually prominent chip in the row. This is the direction where "free" is hardest to miss.
- **CTA placement.** Immediately below the chips. A single filled pill with a soft lift, sized generously for thumbs.
- **Logo.** Prominent. The bubble-script wordmark is a hero element, sitting above or overlapping the headline. This is the direction where the logo works hardest and where NF is most instantly recognisable.
- **Mobile.** Wordmark, headline, sticker-framed photograph, three stacked chips, CTA. The chips wrap to a 2+1 arrangement rather than shrinking. Because the hero is compositional rather than photographic, mobile is the *easier* case here — no crop art direction needed for the hero.
- **Desktop.** Two-column: wordmark, headline, chips and CTA on the leading side; the sticker-framed photograph on the trailing side, slightly rotated by a degree or two and overlapping the column boundary.

## Layout language

- **Section rhythm.** Regular and predictable — this direction gets its energy from surface treatment, so the underlying rhythm stays calm. Even section spacing throughout.
- **Card usage.** Heavy and intentional. The card *is* the design language: rounded, lightly bordered, softly lifted. Nested radii follow the concentric formula (outer = inner + padding) or the whole thing looks amateur.
- **Full-bleed vs contained.** Predominantly contained. One full-bleed moment per page maximum — the social-proof band — so it registers as a deliberate change of pace.
- **Image proportions.** Mostly consistent 4:5 and 1:1 within cards, which suits a collection grid and simplifies the responsive image work considerably compared to Direction 1.
- **Whitespace density.** Medium. Cards need air around them to read as separate objects; gaps between groups run at least twice the gaps within them.
- **Overlaps.** Yes, and they are a signature: cards overlap slightly, small sparkle marks sit across card edges, the hero photograph crosses its column. Strictly limited to two or three per page and never over text.
- **Rotation.** A one-to-two-degree tilt on a small number of elements. This is the detail that makes it feel hand-arranged rather than generated — and the detail most likely to be overdone. Cap it at three elements per page and never rotate anything containing an address, a time, or a CTA.
- **Separators.** Almost none. Card edges and space do the work.
- **Event information priority.** The chip row is the mechanism. Chips repeat at the top of every major section boundary in compressed form, so the core facts travel down the page as a persistent motif rather than as a repeated block.

## Colour system

- **Base / background.** Pale pink-cream as the dominant page surface, with white card surfaces sitting on it. The tinted base is what makes this direction unmistakably NF at a glance.
- **Primary brand colour.** Lavender-purple as the structural brand colour — headings, active states, the wordmark's dominant tone.
- **Secondary / accent.** Gold for "free" and for sparkle marks. Cyan strictly for focus and interactive affordance, as in every direction.
- **CTA treatment.** Filled purple-to-pink pill. This is the one place a two-stop gradient is permitted, because it is the logo's own treatment — interpolated in `oklab` so the midpoint does not go muddy. Everywhere else, flat.
- **Neutral / text.** A warm neutral ramp with sufficient darkness to hold contrast on the tinted base. Body text is never set in the brand purple.

## Typography direction

- **Display personality.** A rounded display face that rhymes with the bubble script without imitating it — `Baloo 2` at semibold. Friendly, geometric, warm.
- **Body personality.** A clean neutral grotesque — `Manrope`. The contrast between rounded display and neutral body is deliberate and is what keeps the direction readable.
- **Logo interaction.** The wordmark sits directly above display type. Because the display face is rounded and the wordmark is a rounded script, they are visually related but clearly different in weight and role. They must never be set at similar sizes adjacent to one another or they compete.
- **Expressive type.** Hero headline, section openers, chip labels. That is the full list.
- **Utility dominates.** All practical content — hours, address, directions, FAQ, form labels, error states — is set in the neutral body face at standard weights. No rounded display, no decorative treatment, ever. Times use tabular numerals.
- **Explicitly excluded.** Pixel and 8-bit typography, per the audit's finding that it belongs to flyer art only.

## Photography treatment

- **Cropping.** Consistent ratios inside cards, which makes cropping mechanical rather than art-directed. The largest practical advantage of this direction.
- **Overlays.** None. Text never sits on photographs, so no scrim is needed anywhere.
- **Borders.** Every photograph gets the sticker frame: a small consistent inset border with a soft lift. This is the direction's most recognisable photographic signature.
- **Masks.** Rounded rectangles only, matched to the card radius via the concentric formula. No circles, no shaped cutouts.
- **Captions.** Set below the frame in small neutral text, like a caption written under a photo in an album.
- **Previous-event labelling.** A small pill badge pinned to the frame's corner carrying the event and month. Because it is part of the frame furniture, it cannot be cropped off or visually lost — arguably the most robust provenance treatment of the three.
- **Integration.** Photographs read as collected objects arranged on a page, which is thematically coherent and avoids the "dumped gallery" feeling even when several appear together.

## Event-page behaviour

- **Master identity** is the sticker system: frames, chips, radii, the tinted base, the type pairing.
- **Expo 2026** uses the core pink-lavender-gold palette — it is the flagship, so it looks like the brand at full strength.
- **Halloween 2026** swaps the tinted base to a deep dark surface and the accent from gold to orange, keeping purple as the brand constant. The sticker frames become light-on-dark. Same components, same spacing, entirely different mood. This direction handles seasonal variance more gracefully than the other two.
- **Future events** get a defined token set: base tint, one accent, one photograph set. Nothing structural changes.
- **Key art placement.** Key art appears inside the largest sticker frame at the top of the event page, presented as a poster object with its provenance and event name attached. The frame is the containment mechanism that prevents flyer-as-webpage.

## Motion principles

- **Card hover and press lift** — a small translate and shadow change on interactive cards, `scale(0.96)` on press. *Purpose:* reinforces the physical-object metaphor and confirms which surfaces are interactive. Transition on named properties only, under 150ms for hover.
- **Staggered card entrance** — cards in a group fade and rise with ~100ms stagger on first view. *Purpose:* communicates that the group is a set of peer items and gives the collection metaphor a moment to land. Once per section, never re-triggered.
- **Sparkle accent** — two or three sparkle marks near the wordmark animate opacity and scale gently, once, on load. *Purpose:* brings the logo's own visual language to life at the single highest-attention moment. Strictly capped; a page of twinkling sparkles is clutter.
- **Nothing else.** No rotation animation, no card flipping, no carousel autoplay.

## Conversion strengths

- **Discovery.** The most memorable of the three. Someone who saw this once will recognise it again, which compounds across an ad-driven funnel with repeat impressions.
- **RSVP clicks.** The gold "free" chip adjacent to a single high-contrast pill is the clearest free-admission signal of any direction. Very little chance a visitor thinks payment is required.
- **Mobile comprehension.** Strong. A stacked sequence of self-contained cards is inherently mobile-native, and no text sits over imagery.
- **Attendance intent.** Good but not best. It builds affection for the brand efficiently; it conveys *scale* less forcefully than Direction 1, because contained photographs communicate less room-size than full-bleed ones.

## Risks

- **Too childish — the primary risk.** A rounded display face, pastel base, sparkles, tilts and stickers is a short distance from a children's party site. The audience includes adults spending real money on graded cards. Mitigation is strict: rotation capped, decorative type confined to headings, all practical content plain. Without that discipline this direction fails.
- **Visual clutter.** Overlaps, tilts, sparkles and lifted cards each cost attention. Any two are charming; all four on one screen is noise.
- **Brand dilution — lowest risk of the three.** This is the most identifiably NF direction.
- **Card-show risk — very low.** Nothing about it resembles a trade show listing.
- **Corporate risk — none.** The opposite problem applies.
- **Performance.** Better than Direction 1 on images (consistent ratios, contained sizes) but worse on effects: many soft shadows and lifted surfaces are compositing cost, and staggered entrances on long pages need care. Net: moderate.
- **Key art confusion — highest risk here.** The website's own visual language (sparkles, bubble script, pink and purple) overlaps heavily with the event key art's language. A visitor could reasonably fail to distinguish the master brand from an event campaign. Requires a hard rule that key art always sits framed and labelled, and that campaign-specific motifs never leak into site chrome.
- **Longevity.** Tactile-sticker aesthetics carry more trend exposure than editorial restraint. Likely to need a refresh sooner.

## Implementation complexity

**Moderate to high.** The components themselves are simple, but the details that make it work — concentric radii on every nested surface, consistent shadow elevation, capped rotation, staggered entrances, a dark seasonal variant of the entire token set — are numerous and easy to get subtly wrong. The design has a low tolerance for sloppiness: an off-by-a-few-pixels radius or an inconsistent lift is immediately visible in a way it is not in Direction 1.

---

# Direction 3 — "Floor Plan"

**The site as the show's program guide.** Utility as the brand.

## Core idea

`docs/website-strategy.md` is unusually direct: physical attendance is the north star, and a large RSVP list that does not show up is a failure. `docs/conversion.md` lists the friction to remove — venue, dates, hours, parking, transit, entrance, ticket requirements. That is a specific and underserved brief. Most event sites are excellent at generating excitement and poor at answering "so what is my actual plan on Saturday."

This direction inverts the usual priority. The site is built as a **show guide**: a clear, confident, signage-inflected information surface that tells you what is on, when, where, and how to get in. It borrows the visual logic of transit wayfinding and printed program guides — strong type, a clear grid, generous use of tabular data, section numbering, and a restrained palette used *functionally* rather than decoratively.

It is not cold. NF's colour carries the system — purple as the structural colour of the guide itself, gold marking free and open, cyan for interactive wayfinding. Photography appears throughout as evidence, sized and captioned like documentary illustration rather than as mood. The personality comes from confidence and clarity, which is a legitimate and distinctive brand voice for an event that is genuinely large and genuinely free.

The strategic bet: for a *free* event, the conversion barrier is not desire, it is logistics. Someone who is already interested drops out because they cannot tell whether parking is a problem, whether they need a ticket, or whether it is worth the drive to Mississauga on a Sunday. This direction attacks that barrier directly, and does it on the same page as the excitement rather than burying it in a FAQ.

## First impression

Within three seconds: *this is a real, well-organised, large event, here are the exact dates and hours, and entry is free.* Confidence and clarity. The emotional register is trust rather than hype — which for a first-time attendee deciding whether to spend a Saturday is arguably the more useful feeling.

## Hero treatment

- **Image treatment.** A wide, letterboxed establishing photograph — a room-scale crowd shot — sitting *beneath* the primary information block rather than behind it. The photograph proves the claim; it does not host the text.
- **Background treatment.** A flat light neutral surface, effectively a paper. No image behind text anywhere in the hero.
- **Headline placement.** Top of the page in the information block, set large but not enormous. Left-aligned.
- **Fact group — the centrepiece.** This is the only direction where the fact group outranks the headline visually. A structured block: the three event days each on their own row with their own hours, set in tabular numerals; venue and address beneath; **free general admission** set as a marked, gold-accented row. It reads like a timetable, because a timetable is the most useful thing we can show someone deciding whether to come.
- **CTA placement.** Directly beneath the fact block, paired with a clearly subordinate secondary action for directions. One filled, one outline — a deliberate exception to the single-CTA convention, justified because "get directions" serves the same north-star outcome as RSVP rather than competing with it.
- **Logo.** Restrained but structural. The wordmark anchors the header and is the primary colour moment in an otherwise typographic hero.
- **Mobile.** The information block occupies the full first screen; the establishing photograph sits immediately below it. Day rows stack cleanly with times right-aligned. This is the strongest mobile hero of the three for pure comprehension — everything a visitor needs to decide is legible without scrolling and without text over an image.
- **Desktop.** Two-column: information block on the leading side, establishing photograph filling the trailing side at a fixed ratio. Both share a top edge.

## Layout language

- **Section rhythm.** Modular and even. Sections are numbered or clearly labelled, like a guide's chapters. Predictability is a feature here, not a shortcoming.
- **Card usage.** Structured and information-dense, closer to a table or a schedule row than a marketing card. Cards carry facts, not moods.
- **Full-bleed vs contained.** Predominantly contained within a strong grid. One or two full-bleed photographic bands mark major transitions and provide relief from the density.
- **Image proportions.** Consistent and mostly wide (16:9, 21:9) so photographs read as documentary illustration within the grid rather than as hero moments.
- **Whitespace density.** The tightest of the three, deliberately. Density signals substance — a show guide with vast empty space looks like it has nothing to list.
- **Grids.** The most visible grid of the three. Column alignment is a design feature; shared edges are strictly maintained.
- **Overlaps.** None. Overlap undermines the guide metaphor.
- **Separators.** Hairline rules used properly and consistently — between schedule rows, between guide sections. This is the one direction where rules are part of the language rather than a fallback.
- **Event information priority.** Highest of the three by a wide margin. Practical information is the primary content, not a section near the bottom. Plan Your Visit is promoted well above its usual position in the persuasion sequence — roughly after social proof rather than near the FAQ.

## Colour system

- **Base / background.** Light neutral paper, with one slightly recessed surface for schedule and data blocks. A dark footer anchors the page.
- **Primary brand colour.** NF purple, used structurally — section markers, active navigation, the wordmark, table headers.
- **Secondary / accent.** Gold marks status: free, open now, confirmed. Cyan is the interactive colour for links, focus and wayfinding controls. Each hue carries exactly one meaning across the whole site, which matters more in an information-dense design than in either other direction.
- **CTA treatment.** One filled purple action per view. Because the design is otherwise low-colour, a single filled button carries enormous weight — the most efficient CTA of the three.
- **Neutral / text.** A full neutral ramp with distinct tokens for primary text, secondary text, separators and disabled states. This direction needs the most neutral steps because it renders the most structured content.

## Typography direction

- **Display personality.** A clean grotesque with signage authority — `Manrope` at semibold and bold. Set at moderate rather than dramatic scale; the hierarchy comes from structure and weight, not from size contrast.
- **Body personality.** The same family at regular weight, generously line-spaced for scanning.
- **Data personality.** A monospace — `Geist Mono` — for times, dates, table numbers and any figure that appears in a column. This is functional rather than stylistic: aligned numerals are what makes a schedule readable. Tabular numerals throughout.
- **Logo interaction.** The wordmark is the single expressive element in a rigorously plain type system. That contrast is the design: a playful mark presiding over a serious guide. It appears at consistent size in the header and footer and is never mixed into running type.
- **Expressive type.** Almost nowhere. The wordmark and, at most, the top-level page heading.
- **Utility dominates.** By definition — this is a direction where utility *is* the aesthetic.

## Photography treatment

- **Cropping.** Wide and consistent, cropped to the grid. Least art-direction burden of the three.
- **Overlays.** None. Text never sits on photographs, which removes the entire contrast-over-image risk class.
- **Borders.** `1px` low-opacity outline on every image, consistent with the structural, bordered language of the rest of the page.
- **Masks.** None.
- **Captions.** Substantial and genuinely informative — what the photograph shows, which event, which date. Captions are treated as content, not as metadata, and are set in the same body face as everything else.
- **Previous-event labelling.** Handled most rigorously here. Previous-event photography is confined to explicitly labelled sections, each with a standing header, and every caption names the event and date. The guide framing makes the distinction between "what happened" and "what is scheduled" natural rather than awkward — a program guide already distinguishes archive from schedule.
- **Integration.** Photographs function as evidence supporting specific factual claims. The handshake photograph illustrates the marketplace section; the crowd photograph illustrates the scale claim. Nothing is decorative, so nothing feels dumped.

## Event-page behaviour

- **Master identity** is the guide system: the grid, the type stack, the schedule block, the status colours, the caption discipline. This is the most transferable system of the three because it is built from rules rather than from imagery.
- **Expo 2026** is the fullest expression — three days, three sets of hours, the largest floor. The schedule block is genuinely useful here.
- **Halloween 2026** inherits the identical structure with a dark base surface and orange status accent. Because the system is structural, the seasonal shift is a token swap with no layout risk.
- **Future events** slot in trivially. A new event is a new set of rows.
- **Key art placement.** Key art gets a dedicated, clearly bounded module in the guide — presented as "the poster for this event," captioned, contained, with a fixed ratio. The guide framing makes containment natural: a program guide reproduces a poster as an item, it does not become the poster.

## Motion principles

- **Sticky schedule summary** — a compact day/hours/free bar that persists after the hero. *Purpose:* the practical facts are the conversion content in this direction, so they must never be more than a glance away.
- **Section-enter fade** — a minimal opacity-only reveal on major sections. *Purpose:* soften density without implying interactivity. Kept smaller than the other directions because motion in a dense information layout is fatiguing.
- **Press feedback** — `scale(0.96)` on primary actions.
- **Explicitly rejected.** Staggered entrances (they slow down access to information), parallax, and any animation on schedule or hours content.

## Conversion strengths

- **Discovery.** Weakest of the three for social sharing — a timetable is not a compelling `og:image`. Would need a dedicated share image that does not reflect the page design.
- **RSVP clicks.** Strong. A single filled action in a low-colour environment is highly visible, and the surrounding clarity reduces hesitation.
- **Mobile comprehension.** Best of the three. Everything a visitor needs is text, structured, at readable sizes, with no image-contrast dependency and no crop risk.
- **Attendance intent.** Best of the three at converting *intent into a plan*, which per the strategy document is precisely where free events leak. Weakest at generating the initial desire that creates intent in the first place.

## Risks

- **Too corporate — the primary risk.** This can read as municipal, institutional, or like a convention centre's own website. Nostalgia Fest is a warm, funny, personality-driven brand; a guide-shaped site could feel like it belongs to a different organisation than the one in the photographs.
- **Too much like a generic card show — real risk.** Rigorous information design is what a well-run trade show looks like. The identity has to work hard, through the wordmark, the colour semantics and the photography, to prevent that reading. This directly threatens Product Rule 5.
- **Brand dilution.** High. The design system carries very little NF character on its own; remove the wordmark and colour and it is a template.
- **Childishness.** No risk.
- **Visual clutter.** Moderate — density is deliberate, but dense information design goes wrong quickly without disciplined grouping and separator use.
- **Performance.** Best of the three. Text-dominant, fewer and smaller images, minimal effects, least motion.
- **Mobile adaptation.** Strongest of the three, with one caveat: dense tables need genuine responsive design, not horizontal scroll, or the best feature becomes the worst.
- **Key art confusion.** Lowest risk of the three. The site's language and key art's language are so different that no one would confuse them.
- **Longevity.** Highest. Information design ages far more slowly than decorative treatment.

## Implementation complexity

**Low to moderate.** Mostly static, text-dominant layout with a strong grid and a small component set. Minimal image pipeline pressure, minimal motion, no unusual effects. The main work is genuinely responsive schedule tables and a properly structured token system. This is the fastest of the three to build well and the cheapest to maintain.

---

# Comparison

Scores are considered judgement against this project's stated goals, not measurement. Someone weighting brand distinctiveness over logistics could reasonably reorder these.

| Criterion | Doors Open | Sticker Book | Floor Plan | Reasoning |
|---|---|---|---|---|
| **Brand distinctiveness** | 6 | 9 | 4 | Sticker Book is unmistakably NF from its own visual language. Doors Open depends on photograph selection and the wordmark. Floor Plan carries almost no identity structurally. |
| **Conversion clarity** | 8 | 7 | 9 | Floor Plan removes logistical friction directly and puts one filled action in a low-colour field. Doors Open has an unmistakable single CTA. Sticker Book's card language slightly dilutes action hierarchy. |
| **Photography compatibility** | 10 | 7 | 6 | Doors Open is built entirely around our strongest proven asset. Sticker Book frames photographs well but shrinks them. Floor Plan uses them as supporting evidence. |
| **Mobile strength** | 7 | 8 | 9 | Floor Plan is text-first with no crop or contrast risk. Sticker Book stacks natively. Doors Open is excellent *if* crops are art-directed and poor if not. |
| **Event flexibility** | 7 | 9 | 9 | Sticker Book and Floor Plan both reduce a new event to a token swap. Doors Open additionally depends on each event having strong photography, which is not guaranteed. |
| **Implementation complexity** | 6 | 5 | 8 | Higher is simpler. Floor Plan is the cheapest to build and maintain. Doors Open carries an image-pipeline burden. Sticker Book has many small details that must all be right. |
| **Risk of looking generic** | 5 | 9 | 3 | Higher is safer. Sticker Book essentially cannot look generic. Doors Open could pass for any good event brand. Floor Plan is closest to looking like a standard trade-show site — the specific failure Product Rule 5 forbids. |
| **Longevity** | 8 | 5 | 9 | Information design ages slowest, editorial photography next, tactile-decorative treatments fastest. |
| **Suitability for Nostalgia Fest** | 8 | 8 | 6 | Doors Open and Sticker Book each capture half the brand — the real energy and the playful identity. Floor Plan serves the strategy well but the brand poorly. |

---

# Recommendation

## Strongest overall: Doors Open

It is built on the asset we actually have and have verified — the photography — and it converts on the mechanism that matters most for a free event, which is belief that the trip is worth taking. It carries the lowest risk of the failure modes that would be hardest to recover from: it will not look childish, it will not look like a card show, and it will not look AI-generated. Its weakness, under-expressed brand identity, is the one weakness that can be fixed by *adding* rather than by rebuilding.

## Strongest runner-up: Sticker Book

It is the most distinctively Nostalgia Fest and the strongest answer to Product Rule 5, and it makes free admission impossible to miss. It is the runner-up rather than the winner because it communicates *scale* least effectively, and scale — a packed room, 200+ tables — is our most persuasive attendance argument. It also carries the highest key-art confusion risk, since its visual language and the event campaigns' visual language are nearly the same.

## Yes, a hybrid is genuinely better

Not as a compromise, but because the three directions have non-overlapping strengths: Doors Open owns persuasion, Sticker Book owns identity, Floor Plan owns logistics. The conversion funnel needs all three in sequence — desire, recognition, plan — and forcing one direction to do all three work is what makes each of them weaker than it needs to be.

**Take from Doors Open (this is the master system — everything not listed below comes from here):**
- The full-bleed hero photograph with directional scrim, art-directed crops per breakpoint
- The alternating full-bleed / contained section rhythm
- The asymmetric grid and editorial image-proportion variety
- The `Archivo` display and body type system, and the rule that the wordmark never sits inline with headline type
- The warm off-white / deep warm ink two-surface base
- The scroll-reveal on image bands and the sticky fact bar
- The caption-as-provenance treatment for editorial photography
- The "key art as framed artefact" module

**Take from Sticker Book (identity layer only, applied on top of the above):**
- The **fact chip row** in the hero — date, venue, free — with gold on the free chip. Adopt this instead of Doors Open's plain inline fact row. It is the single best free-admission signal produced by this exercise.
- The **corner provenance badge** on non-editorial photographs, as a second provenance mechanism where a full caption does not fit
- The **gold sparkle accent** as a section-transition mark and around the wordmark, with the single one-time load animation near the logo
- The **filled purple-to-pink CTA pill** with `oklab` interpolation, as the one permitted gradient
- **Not taken:** the tinted pink-cream page base, the rounded `Baloo 2` display face, card tilt and rotation, the sticker frame on editorial photography, staggered card entrances. These are what create the childishness and clutter risk, and they conflict with the editorial base.

**Take from Floor Plan (logistics layer, event pages below the fold):**
- The **structured day/hours schedule block** with monospace tabular numerals — used in the Plan Your Visit section on event pages and inside the sticky fact bar in compressed form
- **`Geist Mono` for times, dates and table numbers only**, added as a third family strictly for tabular data
- The **promotion of Plan Your Visit** up the persuasion sequence, to immediately after social proof rather than near the FAQ
- The **status colour semantics** — gold means free/open/confirmed, cyan means interactive, each hue carrying exactly one meaning site-wide
- The **secondary outline "directions" action** paired with the primary RSVP, justified because both serve physical attendance
- **Not taken:** the text-first hero, the visible structural grid, the high whitespace density, hairline rules as a general language.

**Resulting hierarchy in one line:** an editorial, photography-led site that opens with proof of scale, carries NF's identity through the wordmark, chips, sparkle accents and gradient CTA, and resolves into a genuinely useful show guide before asking for the RSVP.

**Open dependency:** the hybrid's hero is a full-bleed photograph, which means the HEIC conversion and the art-directed crop set flagged in `references/ASSET-INVENTORY.md` are on the critical path. The unverified video remains an optional future upgrade to the hero and blocks nothing.

---

# Final Direction Decision

_Decided 2026-08-28, after a first-principles critique of the hybrid proposal above. Nothing has been built; every runtime claim below is unverified until there are pixels to measure._

## Decision: B — proceed with the hybrid, with specific changes

The hybrid's underlying logic holds: the three directions do have non-overlapping strengths, and photography-led persuasion plus scoped identity plus legible logistics is the right sequence for a free event whose north star is physical attendance. But the proposal as written has four real defects, two of which would have produced a site that breaks project rules rather than merely underperforming. Those are corrected below before any design work starts.

### What the critique changed

**1. The hero photograph does not communicate the category.** This is the most important correction. The proposal claimed the photography "proves it without a claim." It proves *scale and busyness*, not *subject*. Our best crowd images show an ornate white ballroom full of adults standing at tables — at mobile hero scale, with cards a few pixels wide, that reads as a conference, a wedding expo, or an antique fair before it reads as TCG, toys and collectibles. A first-time visitor arriving from a paid-social ad has three seconds and would spend them working out what kind of event this is.

Correction, now a hard selection rule: **the hero photograph must have collectible product legible in the foreground at the mobile crop** — card cases, binders, plush, boxed toys. Room scale is the background of the shot, not the subject of it. `crowd april 2026.jpeg` (card display cases foreground, packed room behind) and `front of show artist alley april 2026 crowd.jpeg` (plush and merch table foreground, grand staircase behind) satisfy this. `Crowd april 2026.jpg`, previously the lead candidate, does not — it becomes a mid-page scale image instead.

**2. The premium venue actively fights the free-admission message.** The chandeliers and gold trim that make our photography distinctive also read as expensive. For families and casual attendees — an audience the brand explicitly includes — "beautiful formal ballroom" is a price signal. The proposal placed the free marker *below* the hero image's visual field, so the two signals arrive one after the other rather than together.

Correction: **the free-admission marker sits inside the hero photograph's visual field**, in the same glance as the room, not in a fact row beneath it.

**3. "Restrained accents" was too thin to carry identity.** The critique question was whether restrained becomes forgettable. Honestly assessed: after removing the elements below, the identity layer was reduced to a wordmark, a gold marker, small sparkles and corner badges. Sparkles were doing most of the work, and restrained sparkles are close to invisible.

Correction: **promote brand colour from accent scale to architectural scale.** The dark surface becomes a deep purple-tinted ink rather than a neutral warm ink, and one full-bleed solid brand-colour section is permitted per page as a structural moment. This carries NF at the scale of the page's architecture, where it costs nothing in legibility because it is background rather than foreground — instead of relying on small decorations, which is where the childishness and clutter risk lived.

**4. The asset library cannot sustain an alternating full-bleed photographic rhythm.** The audit yields roughly eleven genuinely usable photographs, heavily concentrated: about five crowd/room shots that all show the same white ballroom, two or three deal shots, two stage shots, one or two family moments. Alternating full-bleed bands would repeat the same room four or five times on one page. Worse, both upcoming events have *no photography of their own* — an Expo 2026 page is a page about something that has not happened yet, and Halloween 2026 will have none until after it runs.

Correction: **cap full-bleed photographic bands at two per page**, and make typography, brand-colour blocks and the schedule module carry structural relief rather than treating them as optional. The master system must read well on a page with only two photographs on it.

## Kill Before Design

Removed now, so they never reach a mockup.

| Killed | Why |
|---|---|
| **The gradient CTA pill** | It is the primary conversion element, so its label sits on a *changing* background and contrast must hold at both ends of the ramp — the least safe place in the entire design to put a gradient. `docs/design-principles.md` names "generic SaaS gradients" and "generic purple neon" as things to avoid, and a purple-to-pink pill is precisely that signature. The justification that "the logo does it" does not transfer: the logo's gradient runs across large display lettering with a heavy outline, not a small UI control. It also breaks the one-meaning-per-hue discipline borrowed from Floor Plan. **Replace with a flat brand fill.** |
| **Displaying Expo key art at legible size** | The banner carries claims not in `docs/event-data.md`: food court, hourly giveaways, free parking, and a "secret special guest". Displaying the image *publishes those claims* whether or not we typeset them, which breaks Product Rule 3 regardless of how the module is framed. The original proposal treated containment as sufficient; it is not. Either those facts are confirmed and added to event-data, or the key art does not appear at readable size. **Blocked pending event-data reconciliation.** |
| **The uniform three-chip fact row** | "Square One Event Hall, 199 Rathburn Rd W, Mississauga" does not fit in a chip at mobile width. The outcomes are truncation of the venue — content hidden with no way to reach it — or an awkward wrap. The chips were also decorative packaging around the three facts that most need to be plainly readable. **Keep one gold FREE marker; date and venue become plain typographic facts.** |
| **A third font family (monospace) for times** | The functional requirement is aligned numerals in the schedule, and `font-variant-numeric: tabular-nums` on the existing body family delivers that. A separate family for static times is an extra font download and a third typeface for an aesthetic gain only. The cheaper fix is available, so the expensive one is itself the defect. |
| **Alternating full-bleed bands as the default section rhythm** | The asset library cannot sustain it (see correction 4). Retained as a capped device, killed as a governing rhythm. |
| **Tilted / rotated elements, sticker frames on editorial photography, the rounded display face as core type, and the tinted pink-cream page base** | Already rejected in the original hybrid. Restated here so they are not quietly reintroduced as "just one" during mockups. |

## Preserve At All Costs

These survive even if the visual expression changes substantially.

1. **Free admission stated inside the hero's visual field**, at fact weight, never in a pricing row and never adjacent to a paid tier as a peer. Product Rule 8 is easiest to break by accident and hardest to recover from.
2. **Photography as proof of scale, with collectible product legible in the foreground.** The core insight — that a packed room converts better than a claim — is correct. Only the selection rule needed fixing.
3. **Two-level provenance on all previous-event media**: an inline caption naming the event and month, plus a section-level frame. Product Rule 4, non-negotiable.
4. **Exactly one filled primary action per view.** Every peer action is outline or text. The paired "directions" action is the single sanctioned exception, because it serves the same attendance outcome rather than competing.
5. **Logistics promoted above the FAQ.** Plan Your Visit sits immediately after social proof. For a free event the barrier is logistics, not price.
6. **One meaning per hue, each paired with a non-colour cue.** Gold means free/open/confirmed; cyan means interactive. Neither ever carries meaning alone — a word or icon always accompanies it.
7. **Key art contained as a captioned artefact, never enlarged into a page background.** The rule stands; only its current *use* is blocked pending fact reconciliation.
8. **The wordmark never set inline with headline type.** The script reads as a mark, not as a font choice.

## Locked design principles

Settled. Not reopened during mockups without an explicit decision.

- Master system is **Doors Open**, corrected as above.
- **Dark surface is a deep purple-tinted ink**, not a neutral. One full-bleed solid brand-colour section permitted per page.
- **Maximum two full-bleed photographic bands per page.** The page must work with two photographs total.
- **Hero photograph requires legible foreground product** at the mobile crop.
- **Flat fills only on interactive controls.** No gradient on any control, in any state.
- **Type system:** `Archivo` display and body. Tabular numerals via `font-variant-numeric`, no additional family.
- **One sticky element only.** Bottom-anchored on mobile for thumb reach, top-anchored on desktop, with `env(safe-area-inset-*)` respected. A sticky top bar and a sticky bottom CTA must never coexist.
- **No text over photography without a solid contrast floor.** The scrim is a guaranteed opaque floor beneath the text, not an opacity guess, and the pair is measured on the rendered result.
- **Fact chips are non-interactive.** Nothing that looks like a chip is ever a control, so hit-area and focus obligations do not attach to decoration.
- **Motion is opt-in** behind `prefers-reduced-motion: no-preference`, and no state change is carried by motion alone.
- **One term per concept in all copy.** Pick one of "free entry" / "free general admission" / "free admission" and one of "RSVP" / "register" / "get your free ticket", then use it everywhere including buttons, headings and the confirmation state. Mixed vocabulary reads as two different offers.
- **Internal direction names never appear in user-facing copy.**

## Deferred until implementation

Real open questions, not oversights. Each needs pixels, data, or a decision that is not a visual one.

- **All contrast measurement.** Every pair — hero text on scrim, gold marker on dark ink, cyan focus ring against adjacent surfaces, flat brand fill with its label — is unmeasured. Measured on rendered output, not computed from intent.
- **Hero crop set.** Per-breakpoint art direction for the two candidate hero photographs, plus the HEIC conversion the audit flagged. On the critical path.
- **Event-data reconciliation for key art.** Whether food court, giveaways, parking and the special guest can be confirmed determines whether the key-art module ships at all for Expo 2026.
- **Post-RSVP commitment state.** `docs/conversion.md` is explicit that the RSVP is the start of the funnel, not the end, and neither the three directions nor the hybrid addressed what happens after the click. A confirmation state carrying add-to-calendar, directions and visit planning is required. Its design is deferred; its existence is not optional.
- **Halloween 2026 with no photography of its own.** The master system must degrade to a near-photograph-free page. Needs a defined typographic and brand-colour fallback composition before that page is designed.
- **Schedule block responsive behaviour.** Three days with distinct hours must reflow at 320px and 200% zoom without horizontal scroll. Layout to be resolved against real strings.
- **Sponsor treatment.** No sponsor brand assets exist yet per the audit, and previous-event sponsor presence must not imply Expo 2026 sponsorship. Deferred until assets and confirmations exist.
