// Ticket-provider-agnostic destination config, keyed by event slug.
//
// This is the ONE place a real ticketing URL (Eventbrite or otherwise) gets
// wired in, per event. Every "Get your tickets" action across every event
// page reads from here via TicketButton rather than hard-coding a provider
// URL anywhere else, so wiring a real link later (or switching providers)
// is a one-line change here, never a hunt through page components.
//
// No real ticketing URL is documented for any event yet, so every entry
// stays null. Consumers (see TicketButton.tsx) fall back to an honest
// in-page destination instead of inventing one.
export const TICKET_URLS: Record<string, string | null> = {
  "expo-2026": null,
  "halloween-2026": null,
};

export interface TicketTier {
  id: "general" | "vip";
  name: string;
  priceLabel: string;
  description: string;
}

// Expo-specific: Expo is the only confirmed event with a paid VIP tier
// (docs/event-data.md). Halloween has no VIP data, so it has no tier list.
export const EXPO_TICKET_TIERS: TicketTier[] = [
  {
    id: "general",
    name: "General Admission",
    priceLabel: "Free",
    description:
      "The standard way to attend Nostalgia Fest Expo, no cost, no catch.",
  },
  {
    id: "vip",
    name: "VIP Experience",
    priceLabel: "Pricing coming soon",
    description:
      "An optional paid upgrade on top of free General Admission. Never required to attend.",
  },
];
