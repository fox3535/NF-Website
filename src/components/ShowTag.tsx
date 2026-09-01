/**
 * Show-context tag. Every campaign card carries one so a guest announcement
 * or sponsor activation immediately names the show it belongs to. Built from
 * the same ticket/slab vocabulary as the rest of the page: a punched chip
 * with a perforated leading edge.
 *
 * Non-interactive by design — it is context, not a control, so no hit-area
 * or focus obligation attaches to it.
 */
export default function ShowTag({
  label,
  tone = "light",
  className = "",
}: {
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const palette =
    tone === "dark"
      ? "border-ink/25 bg-ink text-paper"
      : "border-white/30 bg-white/12 text-paper";

  return (
    <span
      className={`nf-eyebrow inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] ${palette} ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-[3px] rounded-full bg-gold-bright"
      />
      {label}
    </span>
  );
}
