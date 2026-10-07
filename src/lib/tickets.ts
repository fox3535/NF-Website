// Ticket-provider-agnostic destination config, keyed by event slug.
//
// This is the ONE place a real ticketing URL (Eventbrite or otherwise) gets
// wired in, per event. Every "Get your tickets" action across every event
// page reads from here via TicketButton rather than hard-coding a provider
// URL anywhere else, so wiring a real link later (or switching providers)
// is a one-line change here, never a hunt through page components.
//
// Expo 2026 registration is free General Admission through Eventbrite.
// Halloween has no confirmed registration URL yet, so its entry stays null
// and consumers (see TicketButton.tsx) fall back to an honest in-page
// destination instead of inventing one.
export const TICKET_URLS: Record<string, string | null> = {
  "expo-2026":
    "https://www.eventbrite.com/e/nostalgia-fest-expo-at-square-one-free-3-day-gta-tcg-collectibles-show-tickets-1998432851455?aff=oddtdtcreator",
  "halloween-2026": null,
};

export interface TicketTier {
  id: "general";
  name: string;
  priceLabel: string;
  description: string;
}

// Business decision (docs/event-data.md): Expo 2026 does not sell VIP
// tickets. Free General Admission is the only tier. Do not re-add a VIP
// entry here without a corresponding confirmed update to
// docs/event-data.md and Chris's sign-off, per the same discipline as
// TICKET_URLS below.
export const EXPO_TICKET_TIERS: TicketTier[] = [
  {
    id: "general",
    name: "General Admission",
    priceLabel: "Free",
    description:
      "The standard way to attend Nostalgia Fest Expo, no cost, no catch.",
  },
];

/**
 * True once any event actually points at an external ticketing provider.
 *
 * The legal pages read this (via src/lib/legal.ts) so they can never
 * describe a ticket-provider relationship that does not exist yet: today
 * every entry above is null, so no third party receives anything when
 * someone uses a ticket action.
 */
export function hasAnyTicketProvider(): boolean {
  return Object.values(TICKET_URLS).some((url) => Boolean(url));
}
