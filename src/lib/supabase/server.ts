import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./env";
import type { Database } from "./types";

/**
 * Server Supabase client for server components, route handlers and server
 * actions that should act AS THE SIGNED-IN USER.
 *
 * Uses the publishable key, so every query runs under Row Level Security with
 * the caller's own permissions. This is the right client for almost all
 * vendor reads: if a policy is wrong, the query returns nothing rather than
 * returning someone else's data.
 *
 * For privileged operations (awarding a stamp, changing standing, writing an
 * NF Club subscriber) use `createSupabaseAdminClient` from ./admin instead,
 * and check authorisation explicitly first.
 *
 * Async because Next.js `cookies()` is async.
 */
export async function createSupabaseServerClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Cookies cannot be written from a Server Component render. This is
          // expected and safe to ignore when session refresh is handled in a
          // route handler, a server action, or middleware.
        }
      },
    },
  });
}
