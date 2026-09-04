"use client";

import Link from "next/link";
import { useState } from "react";
import { setCommitment, useCommitment } from "@/lib/commitment";
import { buildIcs, downloadIcs, EXPO_2026_ICS } from "@/lib/ics";
import { getTicketHref, expo2026 } from "@/lib/events";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(expo2026.address ?? expo2026.venue);

type Surface = "paper" | "ink";

// On ink the filled action switches to gold: a purple fill on a purple-ink
// surface loses its edge, and gold already means "free / go" on this page.
const filled: Record<Surface, string> = {
  paper: "nf-action nf-action-filled px-6 py-3 text-base",
  ink: "nf-action nf-action-gold px-6 py-3 text-base",
};

const outlineClasses: Record<Surface, string> = {
  paper: "nf-action nf-action-outline px-5 py-3 text-sm text-text-secondary",
  ink: "nf-action nf-action-outline px-5 py-3 text-sm text-text-inverse-secondary",
};

const labelClasses: Record<Surface, string> = {
  paper: "w-full text-sm font-medium text-text-secondary",
  ink: "w-full text-sm font-medium text-text-inverse-secondary",
};

const backLinkClasses: Record<Surface, string> = {
  paper: "text-sm font-medium text-brand underline underline-offset-2",
  ink: "text-sm font-medium text-gold-bright underline underline-offset-2",
};

/**
 * Renders the primary ticket action, or — once this browser has clicked a
 * ticket CTA before — a small set of commitment actions instead
 * (docs/homepage-concept.md section 11). We never claim registration is
 * confirmed; a visible path back to tickets always remains.
 */
export default function TicketCtaCluster({
  fullWidth = false,
  showDirections = true,
  surface = "paper",
}: {
  fullWidth?: boolean;
  showDirections?: boolean;
  surface?: Surface;
}) {
  const going = useCommitment();
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  function handleTicketClick() {
    setCommitment();
  }

  function handleCalendar() {
    downloadIcs("nostalgia-fest-expo-2026.ics", buildIcs(EXPO_2026_ICS));
  }

  async function handleShare() {
    const shareData = {
      title: "Nostalgia Fest Expo",
      text: "I'm going to Nostalgia Fest Expo: free admission, Oct 9 to 11, 2026 at Square One Event Hall.",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // User cancelled or share failed — fall through to clipboard.
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch {
      // Clipboard unavailable — no-op, nothing to recover to.
    }
  }

  if (!going) {
    return (
      <Link
        href={getTicketHref(expo2026)}
        onClick={handleTicketClick}
        className={
          fullWidth ? filled[surface] + " w-full" : filled[surface]
        }
      >
        {expo2026.ctaLabel}
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className={labelClasses[surface]}>Going to the Expo?</p>
      <button
        type="button"
        onClick={handleCalendar}
        className={filled[surface]}
      >
        Add to calendar
      </button>
      {showDirections && (
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={outlineClasses[surface]}
        >
          Get directions
        </a>
      )}
      <button
        type="button"
        onClick={handleShare}
        className={outlineClasses[surface]}
      >
        {shareStatus === "copied" ? "Link copied" : "Share with a friend"}
      </button>
      <Link href={getTicketHref(expo2026)} className={backLinkClasses[surface]}>
        Back to tickets
      </Link>
    </div>
  );
}
