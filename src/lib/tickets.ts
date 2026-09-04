// Ticket-provider-agnostic destination config for the Expo 2026 page.
//
// This is the ONE place a real ticketing URL (Eventbrite or otherwise) gets
// wired in. Every "Get your tickets" action on the Expo page reads from
// here rather than hard-coding a provider URL — swapping providers later is
// a one-line change, not a hunt through components.
//
// No real ticketing URL is documented yet, so this stays null. Consumers
// (see TicketButton.tsx) fall back to the in-page ticket-choice section
// instead of inventing an external destination.
export const EXPO_TICKET_URL: string | null = null;

export interface TicketTier {
  id: "general" | "vip";
  name: string;
  priceLabel: string;
  description: string;
  /** Per-tier override — falls back to EXPO_TICKET_URL when unset, which
   *  covers the common case of one checkout page selling both tiers. */
  url?: string | null;
}

export const EXPO_TICKET_TIERS: TicketTier[] = [
  {
    id: "general",
    name: "General Admission",
    priceLabel: "Free",
    description:
      "The standard way to attend Nostalgia Fest Expo — no cost, no catch.",
  },
  {
    id: "vip",
    name: "VIP Experience",
    priceLabel: "Pricing coming soon",
    description:
      "An optional paid upgrade on top of free General Admission. Never required to attend.",
  },
];
