import Link from "next/link";
import type { ReactNode } from "react";
import { TICKET_URLS } from "@/lib/tickets";

/**
 * The one ticket-destination component every event page uses. Reads the
 * centralized TICKET_URLS map (src/lib/tickets.ts) by event slug, so every
 * "Get your tickets" action updates from one place once a real provider URL
 * exists for that event. Until then it falls back to an honest in-page
 * destination instead of a fake link.
 */
export default function TicketButton({
  eventSlug,
  className,
  children,
  fallback = "#tickets",
}: {
  eventSlug: string;
  className: string;
  children: ReactNode;
  fallback?: string;
}) {
  const url = TICKET_URLS[eventSlug] ?? null;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={fallback} className={className}>
      {children}
    </Link>
  );
}
