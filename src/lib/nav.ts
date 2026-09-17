// Shared navigation and the global ticket wording.
//
// "Get your tickets" rather than "Get free tickets" for the shared CTA
// label, since it is used for every event and event-specific admission
// terms (paid or free) belong in docs/event-data.md, not baked into a
// site-wide string. "Free admission" / "Free General Admission" is used
// explicitly wherever a page describes a specific event's admission, which
// is confirmed in docs/event-data.md.

export const TICKET_CTA = "Get your tickets";

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/#upcoming-events", label: "Events" },
  { href: "/#what-is-nf", label: "What is NF?" },
  { href: "/#blast-from-the-past", label: "Blast From the Past" },
];
