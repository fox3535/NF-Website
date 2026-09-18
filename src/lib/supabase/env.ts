/**
 * Supabase environment access.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE: importing anything in this directory
 * must never crash a build or a page render when Supabase is not configured.
 *
 * The public marketing site (home, both event pages, and the three legal
 * pages) is statically rendered and reads none of this. If a variable is
 * missing, nothing fails until something actually tries to talk to Supabase,
 * and at that point the error names the exact variable and where to find it.
 * That is why every accessor below is a function: a module-level throw would
 * turn a missing variable into a build failure for pages that do not use it.
 *
 * NEXT_PUBLIC_ variables are read as literal property accesses, not through a
 * dynamic `process.env[name]` lookup. Next.js only inlines the literal form
 * into the client bundle; the dynamic form silently becomes undefined in the
 * browser. This is a real and easily missed failure mode.
 */

// Literal reads so Next.js can inline them for the browser bundle.
const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PUBLIC_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const SETUP_HINT =
  "Copy .env.example to .env.local and fill it in from the Supabase dashboard " +
  "(Project Settings, then API). See docs/platform-architecture.md.";

function missing(name: string): never {
  throw new Error(`Missing environment variable ${name}. ${SETUP_HINT}`);
}

export interface SupabasePublicConfig {
  url: string;
  publishableKey: string;
}

/**
 * Browser-safe configuration. Both values are designed to be public: the
 * publishable key grants nothing on its own, because every table is
 * protected by Row Level Security and the NF Club tables have no policies at
 * all.
 *
 * Throws only when called.
 */
export function getSupabasePublicConfig(): SupabasePublicConfig {
  if (!PUBLIC_URL) missing("NEXT_PUBLIC_SUPABASE_URL");
  if (!PUBLIC_PUBLISHABLE_KEY) missing("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return { url: PUBLIC_URL, publishableKey: PUBLIC_PUBLISHABLE_KEY };
}

/**
 * The secret key. Bypasses Row Level Security entirely.
 *
 * Deliberately has no NEXT_PUBLIC_ prefix, which is the structural reason it
 * cannot reach a client bundle: Next.js only inlines NEXT_PUBLIC_ variables,
 * so in the browser this is always undefined. Never add that prefix.
 *
 * Throws only when called, and only ever on the server.
 */
export function getSupabaseSecretKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) missing("SUPABASE_SECRET_KEY");
  return key;
}

/**
 * Whether browser-safe Supabase config is present, without throwing.
 *
 * Use this to branch, never to decide whether something is allowed. It answers
 * "is the platform wired up yet", not "is this user permitted".
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(PUBLIC_URL && PUBLIC_PUBLISHABLE_KEY);
}
