/**
 * NF Club option lists the signup form renders, mirrored from
 * supabase/seed.sql so /club and every future signup surface stay static
 * pages with no database call on the render path (see
 * docs/platform-architecture.md section 1.1).
 *
 * The database stays authoritative: handleClubSignup in ./signup-core.ts
 * rejects any interest or source slug that is not present and active in
 * public.interests / public.signup_sources. Keep these lists in step with
 * the seed. A slug here that the database lacks fails loudly at submit
 * rather than being silently accepted.
 *
 * Client-safe: no server imports.
 */

export interface ClubInterestOption {
  slug: string;
  label: string;
}

/** public.interests, in display_order. */
export const CLUB_INTERESTS: readonly ClubInterestOption[] = [
  { slug: "pokemon", label: "Pokemon" },
  { slug: "one-piece", label: "One Piece" },
  { slug: "sports-cards", label: "Sports Cards" },
  { slug: "other-tcgs", label: "Other TCGs" },
  { slug: "toys-figures", label: "Toys and Figures" },
  { slug: "anime-pop-culture", label: "Anime and Pop Culture" },
  { slug: "comics", label: "Comics" },
  { slug: "art", label: "Art" },
  { slug: "cosplay", label: "Cosplay" },
];

/**
 * public.signup_sources. A signup surface picks one of these at build time
 * and passes it to ClubSignupForm; the visitor never types or edits it.
 * `club-page` is the canonical slug for the /club page itself.
 */
export const CLUB_SIGNUP_SOURCES = [
  "homepage",
  "club-page",
  "expo-2026",
  "halloween-2026",
  "expo-entry-qr",
  "expo-giveaway",
] as const;

export type ClubSignupSource = (typeof CLUB_SIGNUP_SOURCES)[number];
