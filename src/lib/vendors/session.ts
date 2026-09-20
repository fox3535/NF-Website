/**
 * Vendor Network identity: resolving a Supabase auth user to exactly one
 * APPROVED vendor profile.
 *
 * The rule this module exists to enforce: a Supabase auth account on its own
 * grants nothing. Access requires a `vendor_profiles` row that is bound to
 * this auth user id AND verified by NF staff. Both halves are checked by
 * Postgres, in `public.current_vendor_profile_id()` (migration 0006), which
 * every vendor-facing RLS policy is written against.
 *
 * Nothing here trusts the browser. No vendor id arrives in a query string, a
 * hidden field, a cookie or a client claim. The only input to authorisation is
 * `auth.uid()`, taken from a session cookie that Supabase signed and that
 * `getUser()` re-validates against the auth server on every call.
 *
 * Reads deliberately go through the user-scoped client (src/lib/supabase/
 * server.ts), not the admin client, so the database is what enforces the
 * boundary. If a policy were wrong, a vendor would see nothing rather than
 * see someone else's record. The admin client is used for exactly one
 * operation: the first-login binding write, which is privileged by nature.
 *
 * Server only. Every caller is a server component, route handler or action.
 */

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface VendorSession {
  /** Supabase auth user id. The whole basis of authorisation. */
  authUserId: string;
  /** The signed-in address, from the auth server, never from a form. */
  email: string;
  vendorProfileId: string;
  businessName: string;
  /** Lifetime active Passport stamps. Read under RLS, never computed here. */
  stampCount: number;
}

/**
 * Three outcomes, and the UI must handle all three differently:
 *
 *   signed-out  no valid session. Send them to the login page.
 *   no-access   a valid session with no approved vendor relationship. Show a
 *               neutral state. NEVER say why: whether a profile exists, is
 *               pending, was rejected, or what the internal standing is are
 *               all private (docs/platform-v1-plan.md section H).
 *   active      an approved vendor.
 */
export type VendorAccess =
  | { status: "signed-out" }
  | { status: "no-access" }
  | { status: "active"; session: VendorSession };

export async function getVendorAccess(): Promise<VendorAccess> {
  const supabase = await createSupabaseServerClient();

  // getUser() revalidates the token with the auth server. getSession() reads
  // the cookie without verifying it, which is not good enough to authorise on.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "signed-out" };

  // Under RLS this returns the caller's approved profile or nothing at all.
  // `select *` would fail: 0002 narrows the vendor's column grant, so
  // standing, verification and signin_email are unreachable even on their own
  // row. Naming columns keeps that guarantee visible at the call site.
  let profile = await readOwnProfile();

  // No bound profile yet. First sign-in after NF added the address to the
  // allow list, so try the one privileged write in the Vendor Network.
  if (!profile && user.email) {
    const bound = await bindAuthUserToProfile(user.id, user.email);
    // Re-read through RLS rather than trusting what the write returned: if
    // the binding did not actually make the row reachable by policy, the
    // vendor gets the neutral state, not a dashboard.
    //
    // The id filter is required, not cosmetic. Next.js memoizes identical GET
    // requests within a single render, so an unfiltered repeat would be
    // served the empty result from the read above and a vendor would be told
    // they have no access on the very request that granted it. Filtering also
    // states the question more precisely: can policy see THIS row now.
    if (bound) profile = await readOwnProfile(bound);
  }

  if (!profile) return { status: "no-access" };

  // Also read under RLS. vendor_passport_summary is security_invoker, so it
  // inherits the same policies: this is the query that proves authorisation
  // end to end rather than asserting it.
  const { data: summary } = await supabase
    .from("vendor_passport_summary")
    .select("stamp_count")
    .eq("vendor_profile_id", profile.id)
    .maybeSingle();

  return {
    status: "active",
    session: {
      authUserId: user.id,
      email: user.email ?? "",
      vendorProfileId: profile.id,
      businessName: profile.business_name,
      stampCount: summary?.stamp_count ?? 0,
    },
  };

  async function readOwnProfile(id?: string) {
    const query = supabase.from("vendor_profiles").select("id, business_name");
    const { data } = await (id ? query.eq("id", id) : query).maybeSingle();
    return data;
  }
}

/**
 * First-login binding. Claims an approved, unclaimed vendor profile for this
 * auth user, once, and never again.
 *
 * The email is used ONLY here, and it is the address the auth server issued
 * the session for, not anything a browser submitted. Every later
 * authorisation decision reads `auth_user_id`, so the durable model does not
 * depend on an address that could later be changed.
 *
 * Four conditions, all in the WHERE clause so the database decides:
 *
 *   - the profile's signin_email matches (citext, so casing cannot fork it)
 *   - the profile is verified by NF staff
 *   - the profile is unclaimed, so a second person cannot take over an
 *     account that is already in use
 *   - this auth user holds no profile at all, checked first, so one person
 *     can never accumulate two vendor identities
 *
 * Returns the profile id on a successful claim, otherwise null.
 */
async function bindAuthUserToProfile(
  authUserId: string,
  email: string
): Promise<string | null> {
  const admin = createSupabaseAdminClient();

  // Already bound to something the RLS read could not see: a profile that is
  // pending verification or rejected. Do not bind a second one, and do not
  // say which it is.
  const { data: existing } = await admin
    .from("vendor_profiles")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (existing) return null;

  const { data: claimed, error } = await admin
    .from("vendor_profiles")
    .update({ auth_user_id: authUserId })
    .eq("signin_email", email.trim().toLowerCase())
    .eq("verification", "verified")
    .is("auth_user_id", null)
    .select("id")
    .maybeSingle();

  if (error || !claimed) return null;

  // Binding an identity is a privileged change, so it is auditable like every
  // other one. No email address in the row: personal data is never logged
  // (docs/platform-v1-plan.md section M).
  await admin.from("audit_log").insert({
    actor_auth_user_id: authUserId,
    action: "vendor.profile_bound",
    target_table: "vendor_profiles",
    target_id: claimed.id,
  });

  return claimed.id;
}
