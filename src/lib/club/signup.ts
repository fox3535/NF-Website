"use server";

/**
 * NF Club signup: the Server Action entry point for every future signup
 * surface (homepage block, /club, event pages, QR flows). No Supabase client
 * of any kind runs in the browser for NF Club, per docs/platform-v1-plan.md
 * section A.4: club_subscribers, consent_events and the other NF Club tables
 * have RLS enabled with zero policies, so there is no anon/publishable-key
 * path to them at all. That is the actual security guarantee, enforced in
 * ./signup-core.ts, which does the real work through the admin client.
 *
 * A Server Action rather than a Route Handler because the plan already
 * decided this in A.4 (progressive enhancement: a real <form> works before
 * hydration).
 *
 * This file stays a thin adapter over next/headers so the database logic in
 * ./signup-core.ts can be exercised directly in a test without a live HTTP
 * request. Every export from a "use server" module must stay async.
 */

import { headers } from "next/headers";
import { handleClubSignup, type ClubSignupInput, type ClubSignupResult } from "./signup-core";

export type { ClubSignupInput, ClubSignupResult };

export async function submitClubSignup(
  input: ClubSignupInput
): Promise<ClubSignupResult> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return handleClubSignup(input, {
    ipAddress: forwardedFor ? forwardedFor.split(",")[0].trim() : null,
    userAgent: headerList.get("user-agent"),
  });
}

/**
 * FormData entry point for a real <form action={submitClubSignupForm}>,
 * once a signup surface is built. Field names match what that form will
 * render: interests[] as repeated "interests" fields, consent as a
 * checkbox ("on" when checked), source as a hidden input the surface
 * controls (never user-editable text).
 */
export async function submitClubSignupForm(
  formData: FormData
): Promise<ClubSignupResult> {
  const renderedAtRaw = formData.get("renderedAt");
  return submitClubSignup({
    firstName: String(formData.get("firstName") ?? ""),
    email: String(formData.get("email") ?? ""),
    interests: formData.getAll("interests").map(String),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    source: String(formData.get("source") ?? ""),
    honeypot: String(formData.get("company") ?? ""),
    renderedAt: renderedAtRaw ? Number(renderedAtRaw) : undefined,
  });
}
