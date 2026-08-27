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

## Deliberately Deferred
Avoid premature CMS, database or custom ticketing infrastructure.
