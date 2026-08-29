"use client";

import Link from "next/link";
import { setCommitment } from "@/lib/commitment";
import { getTicketHref, expo2026 } from "@/lib/events";

/** A plain, always-visible ticket action — no commitment-state swap. */
export default function TicketLink({ className }: { className: string }) {
  return (
    <Link href={getTicketHref(expo2026)} onClick={setCommitment} className={className}>
      {expo2026.ctaLabel}
    </Link>
  );
}
