/**
 * NF Club marketing-consent copy, versioned.
 *
 * consent_events.consent_text stores exactly what a person saw, and
 * consent_version identifies which wording that was. Change the wording only
 * by bumping the version: editing CLUB_CONSENT_TEXT in place would silently
 * rewrite what past signups are recorded as having agreed to. See
 * docs/platform-v1-plan.md section A.10 and
 * supabase/migrations/0005_nf_club.sql.
 */
export const CLUB_CONSENT_VERSION = "v2";

export const CLUB_CONSENT_TEXT =
  "I agree to receive marketing emails from Nostalgia Fest Inc. about " +
  "upcoming events, event announcements, giveaways, special activations, " +
  "guest announcements, and other Nostalgia Fest news. I can unsubscribe at " +
  "any time.";

// Version history. Past consent_events rows keep the exact text they were
// recorded with; these are listed only so the versions stay legible here.
//
// v1 (retired September 18, 2026: promised "exclusive drops", which is not an
// approved NF Club benefit):
//   "I want to receive occasional emails from Nostalgia Fest about upcoming
//   events, exclusive drops and community news. I can unsubscribe at any
//   time."
