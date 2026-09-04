import Link from "next/link";
import type { ReactNode } from "react";
import { EXPO_TICKET_URL } from "@/lib/tickets";

/**
 * The Expo page's one ticket-destination component. Reads the centralized
 * EXPO_TICKET_URL (src/lib/tickets.ts) so every "Get your tickets" action
 * updates from one place once a real provider URL exists. Until then it
 * falls back to an honest in-page destination instead of a fake link.
 */
export default function TicketButton({
  className,
  children,
  fallback = "#tickets",
}: {
  className: string;
  children: ReactNode;
  fallback?: string;
}) {
  if (EXPO_TICKET_URL) {
    return (
      <a
        href={EXPO_TICKET_URL}
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
