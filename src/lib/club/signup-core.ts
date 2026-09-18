/**
 * NF Club signup: the actual database logic, decoupled from Next.js request
 * context (no next/headers here) so it can be exercised directly in a test
 * without a live HTTP request. src/lib/club/signup.ts is the thin Server
 * Action wrapper that reads headers() and calls handleClubSignup.
 *
 * See src/lib/club/signup.ts for the security and architecture rationale:
 * this module is only ever imported by server code, uses the admin client
 * exclusively, and its every success path returns the identical
 * `{ status: "success" }` regardless of whether the email already existed.
 */

import { createSupabaseAdminClient } from "../supabase/admin";
import { CLUB_CONSENT_TEXT, CLUB_CONSENT_VERSION } from "./consent";

const FIRST_NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Anti-bot floor: a real person cannot fill and submit this form faster than
// this. No infra required, unlike per-IP rate limiting, which is deferred
// (see docs/platform-architecture.md) rather than built speculatively here.
const MIN_SUBMIT_MS = 1500;

export interface ClubSignupInput {
  firstName: string;
  email: string;
  /** Interest slugs the person selected. May be empty: interests are optional. */
  interests: string[];
  /** Explicit marketing-consent checkbox state. Must be true to proceed. */
  consent: boolean;
  /**
   * A controlled slug supplied by the calling surface (e.g. "homepage",
   * "expo-entry-qr"), never raw free-form user text. Validated against
   * public.signup_sources.
   */
  source: string;
  /** Hidden form field. Any non-empty value marks the submission as a bot. */
  honeypot?: string;
  /** Client timestamp (ms) captured when the form was rendered. */
  renderedAt?: number;
}

export interface ClubSignupRequestMeta {
  ipAddress: string | null;
  userAgent: string | null;
}

export type ClubSignupResult =
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof ClubSignupInput, string>>;
    };

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * IMPORTANT: whatever branch runs below (new subscriber, existing
 * subscriber, bot trap), the ONLY thing distinguishing a real signup from an
 * address that already exists is never surfaced to the caller. Every success
 * path returns the identical `{ status: "success" }`, exactly as
 * docs/platform-v1-plan.md section A.6 requires.
 */
export async function handleClubSignup(
  input: ClubSignupInput,
  meta: ClubSignupRequestMeta
): Promise<ClubSignupResult> {
  // Bot trap: pretend success without writing anything, so a detected bot
  // learns nothing from the response.
  if (input.honeypot) {
    return { status: "success" };
  }
  if (typeof input.renderedAt === "number") {
    const elapsed = Date.now() - input.renderedAt;
    if (elapsed >= 0 && elapsed < MIN_SUBMIT_MS) {
      return { status: "success" };
    }
  }

  const firstName = input.firstName?.trim() ?? "";
  if (!firstName || firstName.length > FIRST_NAME_MAX_LENGTH) {
    return {
      status: "error",
      message: "Enter your first name.",
      fieldErrors: { firstName: "Required, under 80 characters." },
    };
  }

  const email = normalizeEmail(input.email ?? "");
  if (!email || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
      fieldErrors: { email: "Enter a valid email address." },
    };
  }

  if (!input.consent) {
    return {
      status: "error",
      message: "Marketing consent is required to sign up.",
      fieldErrors: { consent: "Required." },
    };
  }

  if (!input.source || typeof input.source !== "string") {
    return {
      status: "error",
      message: "Signup could not be completed.",
      fieldErrors: { source: "Missing signup source." },
    };
  }

  const admin = createSupabaseAdminClient();

  const { data: sourceRow, error: sourceError } = await admin
    .from("signup_sources")
    .select("slug")
    .eq("slug", input.source)
    .eq("active", true)
    .maybeSingle();
  if (sourceError) {
    console.error("club signup: signup_sources lookup failed", sourceError.code);
    return { status: "error", message: "Signup could not be completed." };
  }
  if (!sourceRow) {
    return {
      status: "error",
      message: "Signup could not be completed.",
      fieldErrors: { source: "Unknown signup source." },
    };
  }

  const requestedInterestSlugs = Array.from(
    new Set((input.interests ?? []).map((slug) => slug.trim()).filter(Boolean))
  );

  let interestIds: string[] = [];
  if (requestedInterestSlugs.length > 0) {
    const { data: activeInterests, error: interestError } = await admin
      .from("interests")
      .select("id, slug")
      .eq("active", true)
      .in("slug", requestedInterestSlugs);
    if (interestError) {
      console.error("club signup: interests lookup failed", interestError.code);
      return { status: "error", message: "Signup could not be completed." };
    }

    const foundSlugs = new Set((activeInterests ?? []).map((row) => row.slug));
    const invalidSlugs = requestedInterestSlugs.filter((slug) => !foundSlugs.has(slug));
    if (invalidSlugs.length > 0) {
      return {
        status: "error",
        message: "One or more selected interests are not recognized.",
        fieldErrors: { interests: invalidSlugs.join(", ") },
      };
    }

    interestIds = (activeInterests ?? []).map((row) => row.id);
  }

  const { data: existing, error: findError } = await admin
    .from("club_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();
  if (findError) {
    console.error("club signup: subscriber lookup failed", findError.code);
    return { status: "error", message: "Signup could not be completed." };
  }

  let subscriberId: string;

  if (existing) {
    subscriberId = existing.id;

    // First name is set once at first signup and never overwritten by a
    // repeat submission, matching created_at: a stranger re-entering the
    // same email with a different name must never silently rename someone.
    //
    // `complained` is terminal (docs/platform-v1-plan.md section A.9): never
    // flip a spam complaint back to subscribed, even on fresh consent. Every
    // other status re-subscribes on fresh consent, which this submission is,
    // because consent is required above.
    if (existing.status !== "complained") {
      const { error: statusError } = await admin
        .from("club_subscribers")
        .update({ status: "subscribed" })
        .eq("id", subscriberId);
      if (statusError) {
        console.error("club signup: status update failed", statusError.code);
        return { status: "error", message: "Signup could not be completed." };
      }
    }
  } else {
    const { data: created, error: insertError } = await admin
      .from("club_subscribers")
      .insert({ first_name: firstName, email, status: "subscribed" })
      .select("id")
      .single();
    if (insertError || !created) {
      console.error("club signup: subscriber insert failed", insertError?.code);
      return { status: "error", message: "Signup could not be completed." };
    }
    subscriberId = created.id;
  }

  // Merge, never replace: an idempotent upsert on the composite primary key
  // so a repeat signup only ever adds interests.
  if (interestIds.length > 0) {
    const { error: mergeError } = await admin.from("subscriber_interests").upsert(
      interestIds.map((interest_id) => ({ subscriber_id: subscriberId, interest_id })),
      { onConflict: "subscriber_id,interest_id", ignoreDuplicates: true }
    );
    if (mergeError) {
      console.error("club signup: interest merge failed", mergeError.code);
      return { status: "error", message: "Signup could not be completed." };
    }
  }

  // Append-only evidence of what was agreed to, when, and from where.
  const { error: consentError } = await admin.from("consent_events").insert({
    subscriber_id: subscriberId,
    action: "granted",
    consent_type: "email_marketing",
    consent_text: CLUB_CONSENT_TEXT,
    consent_version: CLUB_CONSENT_VERSION,
    source_slug: input.source,
    ip_address: meta.ipAddress,
    user_agent: meta.userAgent,
  });
  if (consentError) {
    console.error("club signup: consent event insert failed", consentError.code);
    return { status: "error", message: "Signup could not be completed." };
  }

  // Append-only attribution: a second signup at a different QR code must
  // still be visible as its own touch, never overwrite the first.
  const { error: touchError } = await admin.from("subscriber_source_touches").insert({
    subscriber_id: subscriberId,
    source_slug: input.source,
  });
  if (touchError) {
    console.error("club signup: source touch insert failed", touchError.code);
    return { status: "error", message: "Signup could not be completed." };
  }

  return { status: "success" };
}
