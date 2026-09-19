// Centralized legal-page configuration.
//
// Same discipline as src/lib/tickets.ts and src/lib/social.ts: anything not
// yet confirmed stays `null` and the UI renders an honest state instead of
// inventing a value. Never fill one of these in with a plausible guess. A
// wrong privacy contact address or a wrong legal entity name on a published
// policy is worse than an acknowledged gap.
//
// Confirmed identity items below were approved by Chris directly (see
// docs/site-compliance.md, "Confirmed business identity"). What remains
// `null` genuinely has no confirmed value yet — it is not an oversight.

/**
 * Shown on every legal page. Bump this whenever the substance of any policy
 * changes, not on a copy-edit. One value so the three pages cannot drift.
 */
export const LEGAL_LAST_UPDATED = "September 18, 2026";

/**
 * The registered legal entity the policies are written in, confirmed by
 * Chris. Use this everywhere a policy identifies who operates the site and
 * events, in place of the brand name "Nostalgia Fest" alone.
 */
export const LEGAL_ENTITY_NAME = "Nostalgia Fest Inc.";

/**
 * Named individual responsible for privacy matters, confirmed by Chris.
 * Shown alongside the privacy contact email so a request has a named
 * recipient, not just an inbox.
 */
export const PRIVACY_CONTACT_NAME = "Chris Chan, Director";

/**
 * Where privacy requests (access, correction, withdrawal of consent) go.
 * Confirmed by Chris as the current approved contact address. This is a
 * personal Gmail address rather than a domain mailbox; it is still a valid,
 * monitored contact route and is approved for use on the site for now.
 */
export const PRIVACY_CONTACT_EMAIL: string | null =
  "nostalgiafestteam@gmail.com";

/**
 * General business contact, if different from the privacy contact. Same
 * confirmed address is used for both today; kept as a separate constant so
 * a dedicated general-contact address can be swapped in later without
 * touching the privacy contact.
 */
export const GENERAL_CONTACT_EMAIL: string | null =
  "nostalgiafestteam@gmail.com";

/**
 * Registered business / mailing address, for the policies' identification
 * section.
 *
 * TODO(Chris): genuinely unresolved. There is currently no public NF
 * business or mailing address, and Chris's home address must never be
 * published here. The venue address in docs/event-data.md is the EVENT
 * venue, not a business address, and must never be substituted for one.
 * A public business address is required before NF Club sends any
 * commercial marketing email (CASL requires a valid mailing address in
 * every commercial electronic message). See docs/site-compliance.md.
 */
export const BUSINESS_ADDRESS: string | null = null;

/**
 * Province whose law the Terms refer to, confirmed by Chris: Nostalgia Fest
 * Inc. is based and incorporated in Ontario, Canada.
 */
export const GOVERNING_PROVINCE = "Ontario";

/**
 * True once a ticketing provider is actually wired into src/lib/tickets.ts.
 * Derived rather than hand-maintained so the policies can never describe a
 * ticket provider relationship that does not exist yet.
 */
export { hasAnyTicketProvider } from "./tickets";
