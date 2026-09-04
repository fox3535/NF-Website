import { TICKET_CTA } from "./nav";

// Authoritative event data for the homepage.
// Source of truth for facts: docs/event-data.md. Never add a field here that
// is not confirmed there — the UI is built to gracefully omit missing data
// (see Halloween 2026 below) rather than invent it.

export interface EventDayHours {
  day: string;
  hours: string;
}

export interface EventPhoto {
  src: string;
  alt: string;
}

/**
 * Per-event visual personality. Each show gets its own surface and accent so
 * the events carousel does not read as a row of identical purple cards, while
 * the frame, type and spacing stay shared and recognisably NF.
 */
export interface EventTheme {
  /** Card surface class. */
  surface: string;
  /** Accent used for the date and admission line. */
  accent: string;
  /** Hard offset colour behind the card. */
  shadow: string;
}

export interface NFEvent {
  theme: EventTheme;
  slug: string;
  name: string;
  /** Short label used in eyebrows / hero. */
  shortName: string;
  dateRange: string;
  hours?: EventDayHours[];
  venue: string;
  /** Full street address, when it should be spelled out. */
  address?: string;
  admissionLabel: "Free admission";
  vendorNote?: string;
  photo?: EventPhoto;
  /** Placeholder event-page route — not yet built in V1, see src/app/events/[slug]. */
  href: string;
  ctaLabel: string;
  isNext?: boolean;
}

export const expo2026: NFEvent = {
  // The flagship: canonical purple at full strength.
  theme: {
    surface: "bg-brand",
    accent: "text-gold-bright",
    shadow: "shadow-[8px_8px_0_var(--color-brand-deep)]",
  },
  slug: "expo-2026",
  name: "Nostalgia Fest Expo",
  shortName: "Expo 2026",
  dateRange: "October 9 to 11, 2026",
  hours: [
    { day: "Friday", hours: "4 to 8 PM" },
    { day: "Saturday", hours: "11 AM to 8 PM" },
    { day: "Sunday", hours: "11 AM to 6 PM" },
  ],
  venue: "Square One Event Hall",
  address: "199 Rathburn Rd W, Mississauga, Ontario",
  admissionLabel: "Free admission",
  vendorNote: "200+ vendor tables at Expo 2026",
  photo: {
    src: "/images/photos/hero-crowd.jpg",
    alt: "Attendees browsing glass display cases of trading cards at a previous Nostalgia Fest, with a packed ballroom and chandeliers behind them.",
  },
  href: "/events/expo-2026",
  ctaLabel: TICKET_CTA,
  isNext: true,
};

export const halloween2026: NFEvent = {
  // Seasonal: near-black surface with an orange accent. Same frame, same
  // type, different mood — a token swap, not a different component.
  theme: {
    surface: "bg-ink",
    accent: "text-halloween",
    shadow: "shadow-[8px_8px_0_var(--color-halloween-deep)]",
  },
  slug: "halloween-2026",
  name: "Nostalgia Fest Halloween",
  shortName: "Halloween 2026",
  dateRange: "October 31 to November 1, 2026",
  // No hours confirmed yet in docs/event-data.md — omitted, not invented.
  venue: "Square One Event Hall",
  admissionLabel: "Free admission",
  // No photography exists yet for this event — the card renders typographically.
  href: "/events/halloween-2026",
  ctaLabel: "See the Halloween details",
};

export const upcomingEvents: NFEvent[] = [expo2026, halloween2026];

/**
 * The ticket / RSVP destination for the featured event.
 *
 * No ticketing platform is connected yet (out of scope for V1, and explicitly
 * not to be faked). Every ticket action on the homepage points at
 * the event's own placeholder page rather than a dead link or an invented
 * external URL, per docs/homepage-concept.md section 5's "clear path toward
 * the future Expo landing page / RSVP flow."
 */
export function getTicketHref(event: NFEvent): string {
  return event.href;
}
