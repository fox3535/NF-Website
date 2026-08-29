# Nostalgia Fest Asset Inventory

_Last audited: 2026-08-28. Visual audit of `references/nf-brand/` and `references/nf-media/`. All non-HEIC images were opened and visually inspected. **HEIC photos and all MP4 videos could not be visually inspected in this environment** (no HEIC decoder or ffmpeg/frame-extraction tool available, and none was installed per instruction) — those files are catalogued by filename, folder placement, and size only. Anything below marked "not visually confirmed" should be spot-checked manually (e.g. opened on a Mac/iPhone) before being relied on for a specific claim._

## Brand Direction Observations (from actual inspection)

**Color palette** — confirmed consistent across print art AND real event decor (not just design mockups):
- Primary brand color: soft pink → lavender/purple gradient bubble lettering (the "Nostalgia Fest" wordmark), outlined in blue with a cyan glow
- Accent: gold/yellow sparkle-star accents used around the wordmark
- Secondary accents seen at the physical event: purple + pink balloons, a black felt/embroidered "Nostalgia Fest" banner in the same pink/purple/cyan palette — this is a real, physically-produced banner, not just digital art, which makes pink/purple/cyan/gold a safe, validated core palette for the website
- The Expo banner adds orange (sponsor badge, CTA bar) and dark navy/black backgrounds
- **Caution:** the flyer background art (arcade cabinets, CRT TVs) is a stylized illustrated environment. The real event venue (see photography) is an ornate white ballroom with chandeliers and gold trim — visually the opposite of the flyer's neon-arcade backdrop. Do not imply the website's environment (e.g. hero background textures) shows literal current venue decor from the flyer art.

**Typography personality** — the wordmark is a puffy, rounded, nostalgic bubble-script logotype (90s cartoon-sticker feel), highly distinctive and worth using as a brand mark/accent. The flyer's info callouts use a bold pixel/8-bit outlined font — fitting for a flyer, but per `docs/design-principles.md` this is decorative-only and unsuitable for body copy or long-form UI text (legibility risk).

**Shapes / iconography / motifs** — sparkle/star bursts, rounded bubble shapes, product collage (card boxes, binders, comics, Pokémon cards) framing the logo, a teal/orange triangular sponsor badge. These read as promotional-flyer conventions specific to key art.

**Energy** — genuinely high: packed crowds, hosts working a mic, raffle/giveaway hype, balloons, laughter. This is real and should carry into hero/social-proof selection rather than being invented.

### What could inform the WEBSITE design system
- The pink/lavender/purple + cyan + gold accent palette (validated by both print and physical banner)
- The bubble-script wordmark itself, used as a logo/accent — not as a body font
- Sparkle/star accent motif, used sparingly (e.g. near CTAs or section markers), not covering the page
- Warm, energetic photography of real crowds/vendors as the dominant visual material (not illustrated key art)

### What should stay inside event promotional artwork only
- The pixel/8-bit callout typography
- The CRT/arcade illustrated background scene
- The dense collage-of-product-photos treatment
- The teal/orange sponsor triangle badge (sponsor-specific, not a brand element)

## Official Brand Assets

### Logos
- `Logo Final.png`, `Smaller Version Logo.png` — `nf-brand/logos/`. Same artwork (bubble-script "Nostalgia Fest" wordmark, transparent background) at two export sizes; visually identical. Clean, usable directly as a logo asset.

### Expo 2026
- `NF Oct Expo Banner.png` — `nf-brand/expo-2026/`. Full promotional flyer: confirms dates (Oct 9 4–8pm, Oct 10 11am–8pm, Oct 11 11am–6pm), venue (Square One Event Hall, 199 Rathburn Rd West, Mississauga), free entry, 200+ tables, food court, hourly giveaways, free parking, a "secret special guest" (unnamed — do not invent who), and sponsor names Slab Sharks / Collectr / Card Catcher. Useful as a **factual source for event details**, not as a literal design template (see caution above).

### Halloween 2026
- No key art present (`nf-brand/halloween-2026/` is empty).

### Sponsors
- No dedicated sponsor logo assets. One previous-event sponsor **photo** exists (`nf-media/photos/sponsors/POG booth.HEIC`, not visually confirmed).

### Misc Brand
- `NF Carpet Picture from April 2026.HEIC` — event signage/carpet photo, not visually confirmed (HEIC).

## Previous Event Media — Ranked

**Reminder for every asset below:** this is all previous-event (April 2026 / June 7 2026 Markham) material. It is social proof, not footage of Expo 2026 or Halloween 2026, and must be labeled/treated accordingly anywhere it's used.

### Top Hero Candidates (ranked)
1. **`nf-media/video/hero-candidates/NF Expo Oct 9 10 11 2026 Announcement Video.mp4`** — the only asset actually tied to the upcoming Expo (filename references the real Oct 9–11 dates). Strong candidate by placement/intent, but **content not visually confirmed** — must be watched before committing to it as the literal homepage hero; confirm it doesn't contain unconfirmed claims.
2. **`Crowd april 2026.jpg`** (`photos/crowd/`) — wide ballroom shot, chandeliers, dense engaged crowd, card binders visible in foreground. Mobile: crop tight to the central aisle. Desktop: full frame works. Text-overlay: plenty of negative space at top (ceiling) for a headline. Caution: label as previous-event photo, not current-event footage.
3. **`crowd april 2026.jpeg`** (crowd, chandelier + "ALWAYS BUYING" banner) — great authentic energy, includes a parent holding a baby (also doubles as a family cue). Text-overlay viable in the upper-ceiling area. Desktop-strong; mobile needs a tall crop centered on the foreground group.
4. **`front of show artist alley april 2026 crowd.jpeg`** — vaulted ceiling, family with kids at a plush/collectibles table. Strong "there's something for the whole family" cue. Good desktop wide shot; mobile crop should center the plushie table + kids.
5. **`carlos and kalvin doing deal april 2026.jpeg`** — a genuine handshake over a binder of graded cards, "North Vault Collectibles" signage visible. Best single image for "this is a real trading marketplace." Works as a secondary hero or top-of-marketplace-section image; less ideal as the primary hero (two people, not a crowd) but excellent for text-overlay in the upper third.

### Top Social Proof Assets (8–12)
1. `Crowd april 2026.jpg` — packed aisle, top overall crowd shot.
2. `crowd april 2026.jpeg` — crowd + parent/baby + vendor banners.
3. `front of show artist alley april 2026 crowd.jpeg` — family + collectibles table under a grand ceiling.
4. `carlos and kalvin doing deal april 2026.jpeg` — TCG marketplace handshake.
5. `cassy doing deal april 2026.jpeg` — another vendor handshake over card binders, plush Gengar hat adds personality/authenticity.
6. `Poncho chris jovi on stage april 2026.jpeg` — hosts on stage in front of the actual embroidered "Nostalgia Fest" banner; confirms brand palette is physically produced, not just digital.
7. `poncho stage laughing giveaway april 2026.jpeg` — genuine candid energy, balloons, banner, mystery snack bags visible; good "hype/community" cue.
8. `Carlos announcing winner April 2026.JPG` — host on mic in front of sponsor table backdrop; good supporting giveaway/energy shot.
9. `carlos browsing art marvin april 2026.jpeg` — artist alley original-art table; broadens the story beyond TCG into artists/collectibles, which the brand explicitly wants represented.
10. `cassie holding card catcher sign april 2026.jpeg` — a kid at the show holding a small promo sign; useful family-at-a-card-show proof shot, but crop or caption carefully since the sign itself is a sponsor app promo, not an NF claim.
11. `april 2026.jpeg` (crowd) — dense aisle shot, good supporting/secondary crowd proof, slightly less distinctive than #1–3.

### Top Marketplace / Collectibles Assets
1. `carlos and kalvin doing deal april 2026.jpeg` — clearest "browse, buy, trade" moment; graded-card binder in sharp focus.
2. `cassy doing deal april 2026.jpeg` — second strong deal/handshake moment, different table.
3. `Carlos POG guy april 2026.jpeg` — family browsing a dealer's binder table, good multi-generational marketplace shot.
4. `carlos pog guy 2 april 2026.jpeg` — close card-table/POG tournament detail; usable as a smaller supporting/detail image (faces are secondary subjects, so crop toward the table).
5. `carlos browsing art marvin april 2026.jpeg` — original-art/artist-alley table, representing the "artists" side of the brand, not just cards.

No dedicated `photos/marketplace/`, `photos/tcg/`, or `photos/collectibles/` files exist yet — the assets above are currently miscategorized under `photos/other/` by filename only. Recommend re-filing them during implementation (not done in this audit per scope).

### Top Family / Community Assets
1. `front of show artist alley april 2026 crowd.jpeg` — kids and a parent at a plush/collectibles table under a grand ceiling; the strongest genuine family moment available.
2. `crowd april 2026.jpeg` — parent holding a baby, mid-crowd; supports "families attend too" without being staged.
3. `cassie holding card catcher sign april 2026.jpeg` — a child engaged at the show; usable but weaker/more promotional than the two above.

### Avoid / Low Priority
- `Carlos funny face April 2026.JPG`, `carlos being funny poncho glasses april 2026.jpeg` — casual personality selfies/portraits with no event context visible; not useful for the website.
- `Poncho + Roi posing June 7 Markham Show.jpg` — appears to be shot **off the show floor** (plain drop-ceiling interior, no event signage), not representative of the event experience; avoid using as event proof.
- `Carlos speaking to Chris + Poncho + Nate April 2026.JPG` — internal team/staff photo; low value for public-facing pages.
- `Shamz speaking with Carlos...` (x2), `Carlos eating April 2026.JPG` — personality/organizer content around food, not food-court or crowd proof; low priority, at most a supporting social-media asset, not a hero-tier "food" image.
- `poncho giving out prizes April 2026.PNG` — a cropped screenshot-style image with black letterboxing bars; visibly lower production quality than the JPEG/JPG stage photos. Skip in favor of the two stage `.jpeg` files.
- All 7 `.HEIC` files — cannot be placed with confidence until visually confirmed (see Gaps). Do not select any of them for the live site until someone opens and reviews them directly.
- `photos/sponsors/POG booth.HEIC` — even once viewable, treat carefully: it documents a previous sponsor activation, not a confirmed Expo 2026 sponsor presence.

## Video — Not Visually Inspected

This environment has no HEIC decoder and no ffmpeg/frame-extraction tool, and none was installed per instruction, so **no MP4 frames were actually viewed**. The notes below are inferred only from filename, folder placement, and file size — they are not a quality judgment and must not be treated as one.

| File | Folder / signal | Size |
|---|---|---|
| `NF Expo Oct 9 10 11 2026 Announcement Video.mp4` | `hero-candidates/` — only file tied to the real upcoming dates | 8.1 MB |
| `carlos giveaway vid 1/2/3 april 2026.mp4` | `giveaways/` | 5.4 / 6.6 / 17.0 MB |
| `Montage april 2026 playing everystepyoutake.mp4` | `other/` — April event montage | 5.4 MB |
| `Montage June 7.mp4` | `other/` — June 7 Markham montage | 4.5 MB |
| `Vendor Montage June 7.mp4` | `other/` — vendor-focused montage, largest file, possibly longest/highest-res | 27.8 MB |
| `shamz the snack guy post show montage April Show.mp4` / `...June 7.mp4` | `other/` — organizer/personality content, same pattern as the "food" photos above | 10.6 / 7.2 MB |
| `NF Jingle Remake.mp4` | `other/` — audio/jingle content, unlikely to be a visual hero/background asset | 7.2 MB |

None of these can be responsibly assigned to homepage hero, event-page hero, background loop, or any other slot until someone actually watches them. Treat "hero-candidates" folder placement as a hint from whoever organized the files, not a finished recommendation.

## Missing / Needed — Gaps

**Critical**
- Nobody has visually confirmed the 7 HEIC photos or any of the 10 MP4 videos. This includes the one asset explicitly folder-flagged as the hero candidate. Before finalizing a hero direction, someone needs to open `NF Expo Oct 9 10 11 2026 Announcement Video.mp4` (and ideally the montage videos) on a device that can play them, or convert them, and confirm they're usable and don't contain anything that would misrepresent Expo 2026.

**Helpful**
- Dedicated TCG/collectibles **close-up** photography (cards, boxes, graded slabs in isolation) — everything currently useful is a wide environmental shot with people in it; there's no clean close-up product-style shot for a "what you'll find" section.
- Confirmed sponsor brand assets (logos) distinct from the flyer's sponsor badges — needed if the website will credit sponsors directly.
- Halloween 2026 key art, if/when that event is further along.

**Optional**
- Approved external website references under `references/websites/` — still empty; not urgent since real NF media is now the stronger design input.
- Additional food-court photography that actually shows the food/court setup clearly (the one usable shot, `food vendors april 2026.jpeg`, is decent but not distinctive).

## HEIC Note
7 of the photos are `.HEIC`: 1 in `nf-brand/misc-brand/`, 6 across `nf-media/photos/` (crowd, giveaways ×3, other, sponsors). None were viewable in this environment. No conversion has been performed, per instruction — this is a visibility gap, not a placement decision.
