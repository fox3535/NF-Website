// Nostalgia Fest Halloween confirmed content. Same shape and discipline as
// src/lib/expo-content.ts: only what docs/event-data.md documents goes
// here, and each list is a plain data array so a newly confirmed detail is
// a data change, not a component change.

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
 * see CosplayCompetition.tsx), nothing else is confirmed yet for Halloween
 * 2026. This stays a single honest "more coming" slot rather than being
 * padded out, and is easy to extend the moment something else is confirmed.
 */
export const HALLOWEEN_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "more-programming",
    kind: "Announcement",
    title: "More Halloween programming",
    description:
      "Giveaways, activations and entertainment details are announced closer to the show.",
    pending: true,
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
    answer: "October 31 and November 1, 2026, at Square One Event Hall.",
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
