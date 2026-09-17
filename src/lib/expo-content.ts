// Expo 2026 programming, sponsors and FAQ — confirmed facts only, sourced
// from docs/event-data.md. Each list is a plain data array specifically so
// a new confirmed item is a data change, not a component change.

export interface Announcement {
  id: string;
  kind: string;
  title: string;
  description: string;
  /** True when the category is confirmed but the specific reveal is not —
   *  renders a "coming soon" treatment rather than inventing the detail. */
  pending?: boolean;
  /** Dedicated artwork, once it exists — the tile renders this instead of
   *  the branded placeholder panel the moment it's set. */
  art?: { src: string; alt: string };
}

/**
 * Only confirmed programming goes here. Guests, sponsor activation content
 * and anything else in docs/event-data.md's "Unconfirmed" list stays out
 * until it's added there — this array is deliberately short right now.
 */
export const EXPO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "giveaways",
    kind: "Giveaways",
    title: "Hourly giveaways",
    description: "Giveaways run throughout the show, all three days.",
  },
  {
    id: "food",
    kind: "Food",
    title: "Food court on site",
    description: "Grab something to eat without leaving the hall.",
  },
  {
    id: "guest",
    kind: "Special guest",
    title: "A special guest is confirmed",
    description: "Who it is hasn't been announced yet. Check back soon.",
    pending: true,
  },
];

export interface Sponsor {
  id: string;
  name: string;
  /** What they're doing on-site — left undefined until confirmed beyond the
   *  sponsorship itself; no logo assets exist yet either (see
   *  references/ASSET-INVENTORY.md), so cards are wordmark-style. */
  activation?: string;
  /** Sponsor logo, once assets exist. */
  logo?: { src: string; alt: string };
  /** Campaign graphic for a full activation tile. */
  art?: { src: string; alt: string };
  /** Only rendered when the sponsor actually has somewhere to send people. */
  href?: string;
  ctaLabel?: string;
}

/**
 * A sponsor is "featured" once it has something to show beyond its name.
 * Until then the section stays a compact plaque strip rather than inflating
 * three names into three large identical cards — which is what it looked
 * like, and read as unfinished. Add a logo, activation or link and that
 * sponsor is promoted to a full tile automatically.
 */
export function isFeaturedSponsor(sponsor: Sponsor): boolean {
  return Boolean(sponsor.art || sponsor.activation || sponsor.logo);
}

export const EXPO_SPONSORS: Sponsor[] = [
  { id: "slab-sharks", name: "Slab Sharks" },
  { id: "collectr", name: "Collectr" },
  { id: "card-catcher", name: "Card Catcher" },
];

/**
 * Collectr's activation gets its own dedicated section rather than a card in
 * ExpoSponsors: unlike the other two sponsors, its activation (the Wall of
 * Nostalgia, with confirmed cash prizes) has enough real, confirmed detail to
 * stand on its own rather than being compressed into a shared grid.
 */
export interface CollectrPrize {
  day: string;
  amount: string;
  time: string;
}

export const COLLECTR_ACTIVATION = {
  sponsorName: "Collectr",
  title: "Wall of Nostalgia",
  tagline: "The things that made a generation.",
  totalPrize: "$1,000",
  prizes: [
    { day: "Friday, Oct 9", amount: "$200", time: "7 PM" },
    { day: "Saturday, Oct 10", amount: "$300", time: "5 PM" },
    { day: "Sunday, Oct 11", amount: "$500", time: "4 PM" },
  ] satisfies CollectrPrize[],
  banners: [
    {
      src: "/images/campaigns/collectrbanner.png",
      alt: "Collectr Wall of Nostalgia: $1000 cash prizes",
    },
    {
      src: "/images/campaigns/collectrbanner2.png",
      alt: "Collectr x Nostalgia Fest Wall of Nostalgia poster, powered by Slab Sharks, Collectr and Card Catcher",
    },
  ],
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const EXPO_FAQ: FaqItem[] = [
  {
    question: "Is admission free?",
    answer: "Yes. General Admission to Nostalgia Fest Expo is free for everyone.",
  },
  {
    question: "What are the hours?",
    answer: "Friday 4 to 8 PM, Saturday 11 AM to 8 PM, Sunday 11 AM to 6 PM.",
  },
  {
    question: "Where is the event?",
    answer: "Square One Event Hall, 199 Rathburn Rd W, Mississauga, Ontario.",
  },
  {
    question: "Can I attend multiple days?",
    answer:
      "General Admission is free, and the show runs all three days (Friday, Saturday and Sunday), so you're welcome any day it's open.",
  },
];
