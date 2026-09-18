import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig, getSupabaseSecretKey } from "./env";
import type { Database } from "./types";

/**
 * PRIVILEGED server-only Supabase client. Bypasses Row Level Security entirely.
 *
 * Three layers keep the secret key out of the browser:
 *
 *   1. The variable is named SUPABASE_SECRET_KEY with no NEXT_PUBLIC_
 *      prefix, so Next.js cannot inline it into a client bundle. In the
 *      browser it is always undefined. This is the structural guarantee.
 *   2. The runtime guard below throws loudly if this module is ever evaluated
 *      in a browser, so a mistaken import fails immediately and visibly rather
 *      than silently producing a client that cannot authenticate.
 *   3. Every call site lives in a server action or route handler.
 *
 * WHEN TO USE THIS: only where the operation is genuinely privileged and the
 * caller's authorisation has already been checked in server code.
 *
 *   - NF Club writes. Those tables have no RLS policies by design, so this is
 *     the only way to reach them, and the signup path never runs in a browser.
 *   - Awarding or voiding a Passport stamp.
 *   - Changing vendor standing.
 *   - Creating or closing an NF Opportunity.
 *
 * RLS is not a substitute for checking. Because this client bypasses policies,
 * the admin check must happen in code before any privileged write.
 */
export function createSupabaseAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createSupabaseAdminClient was called in the browser. The secret key " +
        "bypasses Row Level Security and must never leave the server. " +
        "Use createSupabaseBrowserClient or createSupabaseServerClient instead."
    );
  }

  const { url } = getSupabasePublicConfig();

  return createClient<Database>(url, getSupabaseSecretKey(), {
    auth: {
      // No session to persist or refresh: this client is not a signed-in user.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
