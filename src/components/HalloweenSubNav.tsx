const LINKS = [
  { href: "#tickets", label: "Tickets" },
  { href: "#cosplay", label: "Cosplay" },
  { href: "#announcements", label: "What's Happening" },
  { href: "#plan-your-visit", label: "Plan Your Visit" },
];

/**
 * Lightweight in-page jump nav, same pattern as ExpoSubNav: desktop only,
 * sticky just below the header, no scroll-spy.
 */
export default function HalloweenSubNav() {
  return (
    <nav
      aria-label="Halloween page sections"
      className="sticky top-16 z-30 hidden border-b border-border bg-paper/95 backdrop-blur-sm md:top-20 md:block"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 md:px-6">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nf-eyebrow inline-flex min-h-[44px] items-center text-[11px] text-text-secondary hover:text-halloween"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
