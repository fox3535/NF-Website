"use server";

/**
 * Vendor Network sign-in and sign-out.
 *
 * Magic link only. No passwords exist anywhere in this flow, so there is no
 * password to reset, leak or support. Vendors sign in a handful of times a
 * year (docs/platform-v1-plan.md section B.1).
 *
 * THE PRIVACY RULE, which shapes everything below: the response to a sign-in
 * request is identical for every well-formed address. It never reveals
 * whether the address belongs to a vendor, whether an account exists, whether
 * a profile is pending or rejected, or whether the person is staff. Only the
 * shape of the address can change the answer, and that is a property of the
 * text typed, not of anything NF holds.
 *
 * THE REGISTRATION RULE: there is no public vendor registration. A link is
 * only ever sent to an address NF staff already put on the allow list
 * (`vendor_profiles.signin_email`) on a verified profile, so a stranger
 * cannot even cause a Supabase auth user to be created.
 */

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VendorLoginResult =
  | { status: "sent" }
  /** The address is not a valid address. Says nothing about NF's records. */
  | { status: "invalid-email" }
  /** Something broke before we could decide anything. Also non-revealing. */
  | { status: "error" };

// Deliberately loose. A stricter pattern rejects valid addresses, and the
// only job here is to catch a typo before the person waits for an email that
// was never going to arrive.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 254;

export async function requestVendorSignInLink(
  _previous: VendorLoginResult | null,
  formData: FormData
): Promise<VendorLoginResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { status: "invalid-email" };
  }

  try {
    // The allow-list check runs through the admin client because signin_email
    // has no grant to any signed-in role: nothing short of the secret key can
    // read it, so this question cannot be asked from a browser.
    const admin = createSupabaseAdminClient();
    const { data: eligible } = await admin
      .from("vendor_profiles")
      .select("id")
      .eq("signin_email", email)
      .eq("verification", "verified")
      .maybeSingle();

    if (eligible) {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // A vendor's first sign-in creates their auth user, but only
          // because staff already approved this address above. This is not a
          // public registration path.
          shouldCreateUser: true,
          emailRedirectTo: `${getSiteUrl()}/vendors/auth/callback`,
        },
      });

      // A delivery failure (Supabase rate limit, SMTP problem) must not change
      // what the visitor sees, or the difference becomes the enumeration
      // oracle this whole function is written to avoid. Log the failure kind
      // only: never the address, never a token.
      if (error) {
        console.error("vendor sign-in link: delivery failed", error.name);
      }
    }
  } catch (error) {
    // Missing configuration or an unreachable Supabase. Distinguishable from
    // "sent", but only because nothing was decided about the address at all.
    console.error(
      "vendor sign-in link: unexpected failure",
      error instanceof Error ? error.name : "unknown"
    );
    return { status: "error" };
  }

  return { status: "sent" };
}

export async function signOutVendor(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/vendors/login?state=signed-out");
}

/**
 * The origin magic links come back to.
 *
 * Never derived from the request's Host header, which an attacker controls:
 * that is how a sign-in link gets redirected to somebody else's domain.
 * Supabase's own redirect allow list is the second line of defence, and both
 * are needed (docs/platform-architecture.md section 15).
 */
function getSiteUrl(): string {
  const configured = process.env.NF_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  // Vercel preview deployments, where the URL is generated per deployment.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
