/**
 * Persistent, visible provenance marker for any photograph of a previous
 * Nostalgia Fest event. Per docs/visual-directions.md this must survive
 * cropping and never be conveyed by alt text or a tooltip alone — Product
 * Rule 4 is non-negotiable. Use on every previous-event photograph on the
 * page, not only in the dedicated social-proof section.
 */
export default function PhotoBadge({
  label = "Previous Nostalgia Fest event",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={
        "pointer-events-none absolute bottom-2 left-2 z-10 rounded-md bg-ink/80 px-2 py-1 text-[11px] font-medium text-text-inverse " +
        className
      }
    >
      {label}
    </span>
  );
}
