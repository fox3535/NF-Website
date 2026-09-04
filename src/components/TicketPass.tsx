import type { ReactNode } from "react";

/**
 * A physical admission-pass treatment: identity stub, a perforated tear
 * line with punched edge notches, then a price/action stub — the shape of
 * an actual event ticket rather than a SaaS pricing card. Shared by the
 * early ticket-choice comparison and the deeper VIP section so both read as
 * the same object at different sizes.
 */
export default function TicketPass({
  eyebrow,
  kindLabel,
  price,
  priceTone,
  description,
  action,
  tone,
  foil = false,
  /** Background class matching the section this pass sits on — the notch
   *  "cutouts" are punched to this colour, not the pass's own surface. */
  sectionBg = "bg-paper",
  className = "",
}: {
  eyebrow: string;
  kindLabel: string;
  price: string;
  /** Text colour class for the price numeral. */
  priceTone: string;
  description: string;
  action: ReactNode;
  tone: "paper" | "ink";
  foil?: boolean;
  sectionBg?: string;
  className?: string;
}) {
  const surface = tone === "paper" ? "bg-brand-soft" : "bg-brand-deep";
  const textPrimary = tone === "paper" ? "text-text" : "text-text-inverse";
  const textSecondary =
    tone === "paper" ? "text-text-secondary" : "text-text-inverse-secondary";
  const border = tone === "paper" ? "border-ink" : "border-gold-bright/60";

  return (
    <article
      className={
        `relative flex flex-col overflow-hidden rounded-2xl border-2 ${border} ${surface} ${foil ? "nf-foil" : ""} ` +
        className
      }
    >
      <div className="flex items-center justify-between gap-3 px-6 pt-6 md:px-8 md:pt-8">
        <p className={`nf-eyebrow text-xs ${textSecondary}`}>{eyebrow}</p>
        <span
          className={
            "nf-stamp text-[10px] " +
            (tone === "paper" ? "text-brand" : "text-gold-bright")
          }
        >
          {kindLabel}
        </span>
      </div>

      {/* Perforated tear line with punched edge notches — the negative
          margin bleeds this row to the card's own outer edge so the notch
          circles can sit exactly on the rounded corner. */}
      <div className="relative my-5 flex items-center md:my-6">
        <span
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 -translate-x-1/2 rounded-full ${sectionBg}`}
        />
        <div
          className={`nf-perforation flex-1 ${tone === "paper" ? "text-ink" : "text-paper"}`}
        />
        <span
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 translate-x-1/2 rounded-full ${sectionBg}`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pb-6 md:px-8 md:pb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className={`nf-display text-5xl md:text-6xl ${priceTone}`}>
            {price}
          </p>
          <p className={`nf-eyebrow text-[10px] ${textSecondary}`}>
            Expo 2026 · Oct 9–11
          </p>
        </div>
        <p className={`text-base ${textPrimary}`}>{description}</p>
        <div className="pt-1">{action}</div>
      </div>
    </article>
  );
}
