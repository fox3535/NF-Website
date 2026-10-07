# Architecture

This document should evolve only as architectural decisions are actually made.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Application code lives under `src/`

## Source of Truth and Deployment
- GitHub is the source of truth.
- Vercel automatically deploys from GitHub.
- `nostalgiafest.ca` is owned through Hostinger but is not yet connected to Vercel.

## Event Content
Event information should eventually be structured rather than duplicated across independent pages.

## Routing
- Likely canonical event routes such as `/events/expo-2026`.
- Short campaign routes such as `/expo` may redirect to canonical event pages.

## Platform Backend
A Supabase/Postgres foundation exists for the NF platform surfaces (NF Club,
Vendor Network, Vendor Passport, admin). See `docs/platform-architecture.md`
for the schema, RLS strategy, auth and environment variables.

The public marketing site is deliberately unaffected: the homepage, both event
pages and the three legal pages are statically prerendered, query nothing, and
build and render with no Supabase configuration at all. `src/lib/events.ts`
remains the source of truth for public event content.

## Deliberately Deferred
Avoid a premature CMS or custom ticketing infrastructure.

The earlier blanket "avoid a database" position is superseded for the platform
surfaces only, and only because the retention and consent requirements in
`docs/platform-v1-plan.md` genuinely need relational integrity and Row Level
Security. It still holds for the marketing site, which must stay database free.

## Instagram Reels
The homepage "Catch up with NF" section plays hand-picked local MP4s from
`public/videos` and ends in a card linking to Instagram. It is not connected
to Instagram, so there is no automatic "latest" feed.

Options for an automatic feed with dashboard-selected Reels, none adopted yet:
- **Hosted widget (Elfsight, EmbedSocial, Behold):** quickest. Needs an
  account, a paid plan for real traffic (free tiers cap views), and a
  connected Instagram professional account. The widget ID or embed snippet
  would go in a small client component in `ReelsCarousel.tsx`, loaded only
  when the section nears the viewport, since it adds a third-party script and
  shares visitor data with that vendor (the Privacy Policy would need to name
  it).
- **Official Instagram API:** free, but requires a Business or Creator
  account linked to a Facebook Page, a Meta app with review, and token
  refresh. The old Basic Display API no longer exists. Most work, most
  upkeep.

Until one is chosen and tested, keep the local clips.
