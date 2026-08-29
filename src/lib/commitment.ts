import { useSyncExternalStore } from "react";

// Soft "post-ticket" commitment state, per docs/homepage-concept.md section 11.
//
// We cannot verify that anyone actually completed registration on an
// external ticketing platform, so this never asserts "you're registered."
// It only remembers that this browser clicked a ticket CTA, so the page can
// offer commitment actions (calendar, directions, share) instead of asking
// again. Stored client-side only; read after hydration to avoid an SSR
// mismatch, and every access is wrapped so storage being unavailable never
// breaks the page.

const STORAGE_KEY = "nf-going-expo-2026";

/** After this date the commitment flag is treated as stale and ignored. */
const EXPIRES_AFTER = new Date("2026-10-12T00:00:00-04:00");

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Subscribe for use with useSyncExternalStore — see useCommitment(). */
export function subscribeToCommitment(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCommitment(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new Date() > EXPIRES_AFTER) {
      window.localStorage.removeItem(STORAGE_KEY);
      return false;
    }
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setCommitment(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // Storage unavailable (private browsing, disabled cookies, etc). No-op —
    // the click still navigates to the ticket destination normally.
  }
  notify();
}

export function clearCommitment(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op.
  }
  notify();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * React hook wrapper around the commitment flag, via useSyncExternalStore —
 * this is what keeps server and pre-hydration client render identical
 * (always `false`) without a synchronous setState-in-effect.
 */
export function useCommitment(): boolean {
  return useSyncExternalStore(
    subscribeToCommitment,
    getCommitment,
    getServerSnapshot
  );
}
