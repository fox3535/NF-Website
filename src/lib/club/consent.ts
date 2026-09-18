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
export const CLUB_CONSENT_VERSION = "v1";

export const CLUB_CONSENT_TEXT =
  "I want to receive occasional emails from Nostalgia Fest about upcoming " +
  "events, exclusive drops and community news. I can unsubscribe at any time.";
