import RevealOnScroll from "./RevealOnScroll";
import {
  HALLOWEEN_ANNOUNCEMENTS,
  type Announcement,
} from "@/lib/halloween-content";

/**
 * "What's happening" beyond the cosplay competition, which has its own
 * section above.
 *
 * SIGNATURE MOMENT 3 — the announcement wall. One announcement is the real
 * state today, and a lone small card floating in a wide cream band read as
 * a section waiting for content. So the single announcement is composed as
 * the whole point of the section instead: a cream flyer taped to a purple
 * NF wall, tilted, lifting on hover.
 *
 * It scales without a redesign. The first entry always takes the flyer;
 * any further entries stack beside it as pinned notices, so confirming a
 * giveaway, a sponsor activation or entertainment is a data change in
 * HALLOWEEN_ANNOUNCEMENTS, not a layout change.
 */
function Flyer({ item }: { item: Announcement }) {
  return (
    <article className="group relative rotate-[-1.4deg] transition-[rotate,translate] duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:rotate-0 hover:-translate-y-1">
      {/* Masking tape, one strip per top corner, angled apart. */}
      <span
        aria-hidden="true"
        className="nf-tape top-[-14px] left-6 h-7 w-24 rotate-[-7deg]"
      />
      <span
        aria-hidden="true"
        className="nf-tape top-[-12px] right-8 h-7 w-20 rotate-[6deg]"
      />

      <div className="flex min-h-[300px] flex-col justify-between rounded-sm border-2 border-ink bg-paper p-7 shadow-[10px_10px_0_var(--color-halloween-deep)] transition-[box-shadow] duration-300 group-hover:shadow-[14px_14px_0_var(--color-halloween-deep)] md:min-h-[360px] md:p-9">
        <div className="flex items-start justify-between gap-4">
          <p className="nf-eyebrow text-[10px] text-text-secondary">
            {item.kind}
          </p>
          {item.pending && (
            <span className="nf-stamp shrink-0 text-halloween-deep">
              Coming soon
            </span>
          )}
        </div>

        <p className="nf-display mt-8 text-[clamp(2rem,6vw,3.5rem)] text-text">
          {item.title}
        </p>

        <div className="mt-8">
          <div aria-hidden="true" className="nf-perforation text-ink" />
          <p className="mt-4 max-w-sm text-text-secondary">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function HalloweenAnnouncements() {
  if (HALLOWEEN_ANNOUNCEMENTS.length === 0) return null;

  const [lead, ...rest] = HALLOWEEN_ANNOUNCEMENTS;

  return (
    <section
      id="announcements"
      aria-labelledby="announcements-heading"
      className="nf-grid relative overflow-hidden bg-brand-deep py-16 md:py-24"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5">
            <p className="nf-eyebrow text-xs text-pink-bright">On the floor</p>
            <h2
              id="announcements-heading"
              className="nf-display mt-3 text-4xl text-text-inverse md:text-5xl"
            >
              What&apos;s happening
            </h2>
            <p className="mt-4 max-w-prose text-text-inverse-secondary">
              The cosplay competition is confirmed. Everything else on the
              Halloween bill gets posted here as it locks in, so this wall
              fills up between now and October.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:col-span-7">
            <Flyer item={lead} />

            {rest.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {rest.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-sm border border-border-inverse bg-ink/40 p-5"
                  >
                    <p className="nf-eyebrow text-[10px] text-halloween">
                      {item.kind}
                    </p>
                    <p className="nf-display mt-2 text-xl text-text-inverse">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-text-inverse-secondary">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
