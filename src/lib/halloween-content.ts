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
 * Cosplay competition. Only the entry rules Chris has stated as confirmed
 * live here (docs/event-data.md). Divisions, a children's category, a build
 * book, prizes, judging, judges, an organizer name and a start time were
 * discussed but are NOT confirmed for publication, so they are not here.
 *
 * `registrationUrl` stays null until Chris supplies the real form link; the
 * section renders an entry button only when it is set.
 */
export interface CosplayRule {
  label: string;
  value: string;
}

export interface CosplayInfo {
  confirmed: true;
  /** One line shown under the title. */
  summary: string;
  rules: CosplayRule[];
  registrationUrl: string | null;
}

export const HALLOWEEN_COSPLAY: CosplayInfo = {
  confirmed: true,
  summary:
    "A major cosplay competition is part of Nostalgia Fest Halloween, on Saturday, October 31.",
  rules: [
    { label: "When", value: "Saturday, October 31" },
    {
      label: "To compete",
      value: "A costume needs to be at least 70% handmade",
    },
    {
      label: "Made by someone else?",
      value: "The maker needs to be there with you",
    },
  ],
  registrationUrl: "https://forms.gle/6s96cL5XibG75uHQ9",
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
      "Yes. The cosplay competition is on Saturday, October 31. To compete, a costume needs to be at least 70% handmade, and if someone else made it, the maker needs to be there with you. Registration is through the cosplay competition form.",
  },
  {
    question: "Can I compete in the cosplay competition?",
    answer:
      "Competitive entries need to be at least 70% handmade, and the maker needs to be present if someone else made the costume. Watching and wearing a costume without competing is always welcome.",
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
