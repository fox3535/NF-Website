const LINKS = [
  { href: "#tickets", label: "Tickets" },
  { href: "#announcements", label: "What's Happening" },
  { href: "#vip", label: "VIP" },
  { href: "#plan-your-visit", label: "Plan Your Visit" },
];

/**
 * Lightweight in-page jump nav for a long single-event page. Desktop only
 * and sticky just below the (also-sticky) header — the header owns global
 * nav, this owns getting around one page. No scroll-spy: four static
 * anchors are enough value without the extra JS. Mobile skips it entirely
 * rather than competing with the header for a second sticky bar.
 */
export default function ExpoSubNav() {
  return (
    <nav
      aria-label="Expo page sections"
      className="sticky top-16 z-30 hidden border-b border-border bg-paper/95 backdrop-blur-sm md:top-20 md:block"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 md:px-6">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nf-eyebrow inline-flex min-h-[44px] items-center text-[11px] text-text-secondary hover:text-brand"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
