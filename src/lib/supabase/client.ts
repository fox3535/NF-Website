"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";
import type { Database } from "./types";

/**
 * Browser Supabase client, for use inside client components.
 *
 * Uses the anon key and therefore operates entirely under Row Level Security:
 * it can only ever see what the signed-in user's policies allow. It can never
 * reach NF Club subscriber data, which has RLS enabled and no policies at all.
 *
 * Not used anywhere yet. The Vendor Network UI in Phase 3 is its first caller,
 * and the public marketing pages must never import it.
 */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  return createBrowserClient<Database>(url, anonKey);
}
