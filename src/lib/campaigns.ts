// Campaign creative for the homepage hero carousel.
//
// A campaign is a piece of marketing tied to a specific NF show. It is NOT
// the event record — src/lib/events.ts stays the source of truth for dates,
// venue and admission. A campaign only adds the creative and the message.
//
// SWAPPING IN A REAL BANNER
// Final website banners are authored at 1600x900. To replace a placeholder:
//   1. drop the file into public/images/campaigns/
//   2. add `art: { src, alt, width: 1600, height: 900 }` to that entry
//   3. delete its `placeholder` block
// The carousel needs no changes — it renders `art` when present and the
// branded placeholder when it is absent.

export type CampaignKind =
  | "Show info"
  | "Special announcement"
  | "Special guest"
  | "Sponsor activation"
  | "Giveaway";

export interface CampaignArt {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Branded stand-in shown until real artwork exists. */
export interface CampaignPlaceholder {
  /** Large line — the show or the campaign subject. */
  title: string;
  /** Colourway, so the three placeholders read as distinct campaigns. */
  tone: "expo" | "halloween" | "announcement";
}

/**
 * PRODUCT RULE — campaign wall size cap.
 *
 * The homepage campaign wall shows at most 1 primary + this many secondary
 * campaigns (CampaignWall.tsx reads `campaigns[0]` as primary and the rest
 * as secondary, so this constant IS the cap, not just documentation of one).
 *
 * Do not raise this to fit more campaigns, and do not let the wall shrink
 * banners to squeeze more in — a banner nobody can read is a banner nobody
 * sees. Once a real campaign would push the list past this length, it
 * belongs in a separate "Latest Announcements" / "More Campaigns" area
 * further down the homepage, not in this wall. That section does not exist
 * yet and is out of scope until it's actually needed.
 */
export const MAX_SECONDARY_CAMPAIGNS = 2;

export interface Campaign {
  id: string;
  /** Which show this belongs to. Rendered as the mini tag on every card so a
   *  guest or sponsor campaign always names its show. */
  showTag: string;
  kind: CampaignKind;
  headline: string;
  art?: CampaignArt;
  placeholder?: CampaignPlaceholder;
  href: string;
  ctaLabel: string;
}

/**
 * The frame is 16:9, the format final banners target. Artwork already at that
 * ratio fills it; anything narrower is pillarboxed rather than cropped.
 */
export const CAMPAIGN_ASPECT = 16 / 9;

export function fillsFrame(art: CampaignArt): boolean {
  return art.width / art.height >= CAMPAIGN_ASPECT - 0.02;
}

/**
 * The approved Expo social creative (1080x1350) is preserved untouched at
 * public/images/campaigns/expo-2026-banner.png and in references/nf-brand/.
 * It is deliberately not the desktop hero: its portrait ratio was distorting
 * the layout decisions this carousel exists to let us judge.
 */
export const campaigns: Campaign[] = [
  {
    id: "expo-2026",
    showTag: "Oct Expo",
    kind: "Show info",
    headline: "Nostalgia Fest Expo",
    placeholder: { title: "Nostalgia Fest Expo", tone: "expo" },
    href: "/events/expo-2026",
    ctaLabel: "View event",
  },
  {
    id: "halloween-2026",
    showTag: "Halloween",
    kind: "Show info",
    headline: "Nostalgia Fest Halloween",
    placeholder: { title: "Nostalgia Fest Halloween", tone: "halloween" },
    href: "/events/halloween-2026",
    ctaLabel: "View event",
  },
  {
    id: "expo-announcement",
    showTag: "Oct Expo",
    kind: "Special announcement",
    headline: "Campaign announcement",
    // Demonstrates a second campaign hanging off the same show. Announces
    // nothing — no guest, sponsor, giveaway or activation.
    placeholder: { title: "Campaign announcement", tone: "announcement" },
    href: "/events/expo-2026",
    ctaLabel: "See details",
  },
];
