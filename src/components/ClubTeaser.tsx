import Link from "next/link";
import { clubHref, type ClubSignupSource } from "@/lib/club/options";

/**
 * Compact NF Club entry point for pages other than /club. Presentational
 * only: it links to /club carrying the page's source slug, and the signup
 * itself always happens there (src/components/ClubSignupForm.tsx).
 *
 * Deliberately secondary. It sits after a page's final ticket CTA, uses an
 * ink action rather than the brand or gold fills the ticket buttons use, and
 * stays one short band so it never reads as a second conversion goal.
 */
export default function ClubTeaser({
  source,
  heading,
  body,
}: {
  source: ClubSignupSource;
  heading: string;
  body: string;
}) {
  return (
    <section aria-labelledby={`club-teaser-${source}`} className="bg-paper py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* A ticket stub: body on the left, a perforated tear line, then the
            stub carrying the action. */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[5px_5px_0_var(--color-brand-deep)] md:flex-row md:items-stretch">
          <div className="nf-halftone relative flex-1 bg-brand px-5 py-6 text-text-inverse md:px-8 md:py-7">
            <div className="relative">
              <p className="nf-eyebrow flex items-center gap-2 text-[11px] text-pink-bright">
                <span className="rounded-sm bg-gold-bright px-1.5 py-0.5 text-ink">NF Club</span>
                Free to join
              </p>
              <h2
                id={`club-teaser-${source}`}
                className="nf-display mt-3 text-3xl md:text-4xl"
              >
                {heading}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-inverse-secondary md:text-base">
                {body}
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden w-0.5 shrink-0 self-stretch text-ink/40 md:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, currentColor 0 6px, transparent 6px 12px)",
            }}
          />

          <div className="flex items-center border-t-2 border-dashed border-ink/40 bg-paper px-5 py-5 md:w-64 md:justify-center md:border-t-0 md:px-6">
            <Link
              href={clubHref(source)}
              className="nf-action min-h-12 w-full bg-ink px-5 text-base text-text-inverse shadow-[3px_3px_0_var(--color-brand)] hover:bg-ink-soft active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:active:translate-x-0 motion-reduce:active:translate-y-0"
            >
              Join NF Club
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
