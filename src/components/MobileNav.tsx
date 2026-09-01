"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getTicketHref, expo2026 } from "@/lib/events";
import { NAV_LINKS, TICKET_CTA } from "@/lib/nav";

/**
 * Mobile menu trigger + full-screen panel. Sets `inert` on the rest of the
 * page while open, moves focus into the panel, restores focus to the
 * trigger on close, and closes on Escape — per
 * docs/homepage-concept.md section 12 and 18.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const desktopNav = document.querySelector<HTMLElement>(
      'nav[aria-label="Primary"]'
    );
    const targets = [main, footer, desktopNav].filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );

    if (open) {
      targets.forEach((el) => el.setAttribute("inert", ""));
      triggerRef.current?.setAttribute("inert", "");
      closeRef.current?.focus();
    } else {
      targets.forEach((el) => el.removeAttribute("inert"));
      triggerRef.current?.removeAttribute("inert");
    }

    return () => {
      targets.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-text"
      >
        <span className="sr-only">Open menu</span>
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-paper"
        >
          <div className="flex h-14 items-center justify-between px-4">
            <span className="font-semibold text-text">Menu</span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-text"
            >
              <span className="sr-only">Close menu</span>
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg py-4 text-2xl font-semibold text-text"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={getTicketHref(expo2026)}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-4 text-lg font-semibold text-text-inverse"
            >
              {TICKET_CTA}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
