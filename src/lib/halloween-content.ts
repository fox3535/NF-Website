// Nostalgia Fest Halloween confirmed content. Same shape and discipline as
// src/lib/expo-content.ts: only what docs/event-data.md documents goes
// here, and each list is a plain data array so a newly confirmed detail is
// a data change, not a component change.

import type { Sponsor } from "./expo-content";

/**
 * Confirmed sponsors of Halloween 2026, matching the approved campaign
 * poster (halloween-landing-banner.png) and docs/event-data.md. Same
 * sponsors as Expo 2026, confirmed separately for this event.
 */
export const HALLOWEEN_SPONSORS: Sponsor[] = [
  { id: "slab-sharks", name: "Slab Sharks" },
  { id: "collectr", name: "Collectr" },
  { id: "card-catcher", name: "Card Catcher" },
];

export interface Announcement {
  id: string;
  kind: string;
  title: string;
  description: string;
  /** True when the category is confirmed but the specific reveal is not. */
  pending?: boolean;
  art?: { src: string; alt: string };
}

/**
 * Beyond the cosplay competition (which gets its own dedicated section,
 * see CosplayCompetition.tsx), these are confirmed for Halloween 2026,
 * matching the approved campaign poster (halloween-landing-banner.png) and
 * docs/event-data.md. Reconciled from a documentation-drift audit: the
 * poster already made these claims publicly, this data now matches it.
 *
 * The Pokemon TCG tournament's organizer is explicitly NOT confirmed
 * (docs/event-data.md). Do not add an organizer name to this description
 * without updating that file first.
 */
export const HALLOWEEN_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "giveaways",
    kind: "Giveaways",
    title: "Hourly giveaways",
    description: "Giveaways run throughout the show, both days.",
  },
  {
    id: "parking",
    kind: "Parking",
    title: "Free parking",
    description: "Free parking is confirmed at the venue.",
  },
  {
    id: "pokemon-tcg",
    kind: "Tournament",
    title: "Pokemon TCG tournament",
    description:
      "A Pokemon TCG tournament is part of the show. Who's running it hasn't been announced yet.",
  },
];

/**
 * Cosplay competition specifics. The competition itself is confirmed; the
 * fields below stay undefined until docs/event-data.md documents them, and
 * the section (CosplayCompetition.tsx) renders around whatever is present.
 */
export interface CosplayInfo {
  confirmed: true;
  categories?: string[];
  prizes?: string[];
  judging?: string;
  schedule?: string;
  registration?: { open: boolean; details?: string };
}

export const HALLOWEEN_COSPLAY: CosplayInfo = {
  confirmed: true,
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const HALLOWEEN_FAQ: FaqItem[] = [
  {
    question: "Is admission free?",
    answer: "Yes. General Admission to Nostalgia Fest Halloween is free.",
  },
  {
    question: "When is the event?",
    answer:
      "October 31 and November 1, 2026, at Square One Event Hall, 199 Rathburn Rd W, Mississauga, Ontario.",
  },
  {
    question: "Is there a cosplay competition?",
    answer:
      "Yes, a major cosplay competition is confirmed. Categories, judging and prizes are still being finalized and will be announced closer to the show.",
  },
  {
    question: "Do I need to be in costume to attend?",
    answer:
      "No. Costumes are welcome and encouraged, but General Admission doesn't require one.",
  },
  {
    question: "Is this a full Nostalgia Fest show?",
    answer:
      "Yes. Alongside the Halloween theme and cosplay competition, it's still a Nostalgia Fest floor: trading cards, toys, collectibles, art and pop culture.",
  },
];
