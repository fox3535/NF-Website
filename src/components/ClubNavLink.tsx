"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Client only for the active state; the header stays a server component.
export default function ClubNavLink() {
  const active = usePathname() === "/club";
  return (
    <Link
      href="/club"
      aria-current={active ? "page" : undefined}
      className={`nf-eyebrow inline-flex min-h-[44px] items-center border-b-2 text-xs hover:text-brand ${
        active ? "border-brand text-brand" : "border-transparent text-text"
      }`}
    >
      NF Club
    </Link>
  );
}
