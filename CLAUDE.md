# Nostalgia Fest Website

## Project
Nostalgia Fest is a mobile-first event website for a Canadian GTA event brand focused on TCGs, collectibles, nostalgia, pop culture and entertainment.

The website's primary business objective is turning online interest into physical attendance at Nostalgia Fest events. Registration is not the final conversion. Actual physical attendance is the north-star outcome.

## Stack
Next.js 16.3.3 (App Router) · React 19.2.8 · TypeScript 5.9.3 · Tailwind CSS 4.3.3 · ESLint · GitHub · Vercel

Do not add significant dependencies without a clear reason. Prefer the existing stack when it can reasonably accomplish the task.

## Commands
```
npm run dev
npm run lint
npm run build
```
Before declaring a meaningful implementation task complete, run lint and production build unless the task clearly does not affect application code.

## Product Rules
These are non-negotiable:
1. Attendance conversion takes priority over visual novelty.
2. Design mobile-first.
3. Never invent guests, attractions, giveaways, sponsors, event details, statistics or public claims.
4. Clearly distinguish current-event information from media showing previous Nostalgia Fest events.
5. Nostalgia Fest must not feel like a generic card show or generic AI-generated website.
6. TCG is commercially important, but the brand also includes collectibles, toys, artists, pop culture, nostalgia, entertainment and community.
7. Prefer authentic Nostalgia Fest photography and video over generic stock media.
8. Free general admission must never visually appear to require a paid VIP ticket.
9. Performance and comprehension take priority over decorative effects.
10. Do not introduce animation unless it improves feedback, hierarchy, spatial understanding or experience.
11. Do not modify unrelated functionality while completing a task.
12. Do not add pages, components, libraries or features simply because websites commonly have them.

## Design Workflow
For substantial visual work:
1. Understand the page objective.
2. Read only the relevant project documentation.
3. Inspect approved references when available.
4. Establish hierarchy before decoration.
5. Explore substantially different directions when the visual direction is unresolved.
6. Implement only after the direction is understood.
7. Review responsive behavior and conversion clarity.
8. Add motion only after the static layout works.

Do not start major visual design from generic model defaults when approved reference material exists. References are inspiration, not templates to clone.

## Ambiguity
Do not ask unnecessary questions for small, reversible decisions. Ask before proceeding when unresolved ambiguity could materially change: architecture, business logic, public event information, conversion strategy, brand direction, data collection, third-party services or significant dependencies.

## Documentation
Use progressive disclosure. Read only what is relevant to the task — do not read every documentation file automatically.
- overall NF strategy or audience → `docs/website-strategy.md`
- visual design or branding → `docs/design-principles.md`
- CTA hierarchy, RSVP or attendance funnel → `docs/conversion.md`
- event dates, hours, venue, attractions, guests, sponsors or public claims → `docs/event-data.md`
- project structure or technical decisions → `docs/architecture.md`
- recurring agent mistakes → `docs/agent-lessons.md`

## Git and Deployment
GitHub repository: `https://github.com/fox3535/NF-Website.git`
`main` is the production branch. Vercel is connected to GitHub and automatically deploys the repository.
Domain: `nostalgiafest.ca` — owned through Hostinger, not yet connected to Vercel.

Do not force push, rewrite Git history, modify DNS, connect the production domain or make destructive deployment changes without explicit authorization.

## Definition of Done
For meaningful frontend changes:
- intended requirement is satisfied
- mobile behavior has been considered
- no obvious accessibility regression
- no unnecessary dependency was introduced
- no unrelated files were changed
- lint passes
- production build passes

Do not declare something complete merely because code was written.
