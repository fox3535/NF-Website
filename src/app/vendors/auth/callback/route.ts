/**
 * Magic-link callback. The only place a Vendor Network session is created.
 *
 * Supabase sends the vendor to its own /auth/v1/verify endpoint, which
 * validates the one-time token and bounces here. Two shapes can arrive, and
 * both are handled because which one it is depends on the email template
 * configured in the Supabase dashboard:
 *
 *   ?code=...                    PKCE. The default for @supabase/ssr. The
 *                                verifier lives in an httpOnly cookie set
 *                                when the link was requested, so the link
 *                                only works in the browser that asked for it.
 *   ?token_hash=...&type=...     The cross-device shape, available if the
 *                                template is switched to {{ .TokenHash }}.
 *
 * Nothing else in the query string is honoured. In particular there is no
 * `next` or `redirect` parameter: the destination is fixed, so a crafted link
 * cannot bounce a freshly authenticated vendor to an attacker's page.
 *
 * This handler proves possession of the emailed token. It does NOT decide
 * whether the person may use the Vendor Network. That question belongs to
 * getVendorAccess(), and an auth user with no approved vendor profile lands
 * on the dashboard's neutral state with a session and no data.
 */

import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// These arrive on a one-time link, so the response must never be cached.
export const dynamic = "force-dynamic";

const OTP_TYPES: readonly EmailOtpType[] = ["magiclink", "email", "signup"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabase = await createSupabaseServerClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return redirectTo("/vendors/dashboard", request);
    console.error("vendor auth callback: code exchange failed", error.name);
  } else if (tokenHash && isOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) return redirectTo("/vendors/dashboard", request);
    console.error("vendor auth callback: token verification failed", error.name);
  }

  // Expired, already used, or opened in a different browser to the one that
  // requested it. The login page explains all three without naming which,
  // because the fix is the same: ask for a new link.
  return redirectTo("/vendors/login?state=link-invalid", request);
}

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (OTP_TYPES as readonly string[]).includes(value);
}

// Resolved against the incoming request so the redirect stays on this origin.
function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.nextUrl.origin));
}
