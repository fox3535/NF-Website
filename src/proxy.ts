/**
 * Vendor Network session refresh (Next 16 proxy convention, formerly
 * middleware).
 *
 * A Supabase access token lives about an hour and is renewed with a refresh
 * token. A Server Component cannot write cookies, so without this the renewed
 * pair would have nowhere to land and a vendor would be signed out mid-visit.
 * Calling getUser() here performs the refresh and writes the rotated cookies
 * onto the outgoing response.
 *
 * THE MATCHER IS THE POINT. It lists Vendor Network routes only. The
 * homepage, both event pages, /club and the three legal pages are statically
 * rendered and must stay that way (docs/platform-architecture.md section
 * 1.1): this file must never make a marketing page depend on a session
 * lookup, and /vendors itself is excluded because the public landing page has
 * nothing to refresh.
 *
 * This is refresh, not authorisation. Access is decided per route by
 * getVendorAccess() against the database. Middleware runs before RLS is ever
 * consulted and must not be the thing standing between a vendor and someone
 * else's data.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  // With Supabase unconfigured there is no session to refresh and nothing to
  // fail on. The route itself reports the missing configuration.
  if (!isSupabaseConfigured()) return NextResponse.next({ request });

  const { url, publishableKey } = getSupabasePublicConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/vendors/login", "/vendors/dashboard", "/vendors/auth/:path*"],
};
