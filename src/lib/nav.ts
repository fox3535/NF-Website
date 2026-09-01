// Shared navigation and the global ticket wording.
//
// "Get your tickets" rather than "Get free tickets" wherever the CTA stands
// for the whole ticket flow: Nostalgia Fest has free general admission and
// paid VIP, so a blanket "free" on the flow itself would misdescribe VIP.
// "Free admission" stays wherever it specifically describes general
// admission, which is confirmed in docs/event-data.md.

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
