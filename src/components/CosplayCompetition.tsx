import { HALLOWEEN_COSPLAY } from "@/lib/halloween-content";
import { halloween2026 } from "@/lib/events";
import RevealOnScroll from "./RevealOnScroll";

/**
 * The page's signature section, and the biggest experiential moment after
 * the hero.
 *
 * SIGNATURE MOMENT 2 — the stage. Two spotlight cones breathe out of phase
 * above a competition poster built as a physical pass: slab label across
 * the top, the title, a stamped CONFIRMED mark that lands on scroll, then a
 * perforated stub carrying the competition board.
 *
 * The competition itself is confirmed (docs/event-data.md); categories,
 * prizes, judging and schedule are not, so each renders from
 * HALLOWEEN_COSPLAY and falls back to an honest "announced soon" state
 * rather than inventing specifics. Those four used to be four identical
 * placeholder cards, which read as an unfinished layout; as ruled rows on
 * one board with a running pending count, the same absence reads as a
 * schedule being kept. Adding any of them later is a data change in
 * src/lib/halloween-content.ts, not a layout change.
 */
const DETAIL_SLOTS: { key: keyof typeof HALLOWEEN_COSPLAY; label: string }[] =
  [
    { key: "categories", label: "Categories" },
    { key: "prizes", label: "Prizes" },
    { key: "judging", label: "Judging" },
    { key: "schedule", label: "Schedule" },
  ];

function resolve(key: keyof typeof HALLOWEEN_COSPLAY): string | null {
  const value = HALLOWEEN_COSPLAY[key];
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : null;
}

export default function CosplayCompetition() {
  const rows = DETAIL_SLOTS.map((slot) => ({
    ...slot,
    value: resolve(slot.key),
  }));
  const pending = rows.filter((row) => row.value === null).length;

  return (
    <section
      id="cosplay"
      aria-labelledby="cosplay-heading"
      className="nf-halftone relative overflow-hidden bg-ink py-20 md:py-28"
    >
      {/* Two stage cones, hung from the top edge and breathing on
          different cycles so the light never pulses in unison. */}
      <div
        aria-hidden="true"
        className="nf-spot top-[-30%] left-[8%] h-[85%] w-[70%] md:left-[14%] md:w-[46%]"
      />
      <div
        aria-hidden="true"
        className="nf-spot nf-spot-alt top-[-26%] right-[4%] h-[80%] w-[66%] md:right-[12%] md:w-[42%]"
      />
      <div aria-hidden="true" className="nf-grain" />

      <RevealOnScroll className="relative mx-auto max-w-3xl px-4 md:px-6">
        <article className="nf-case nf-case-ink">
          <div className="nf-case-label text-text-inverse-secondary">
            <span>Nostalgia Fest Halloween</span>
            <span className="tabular-nums text-halloween">
              Oct 31 &amp; Nov 1
            </span>
          </div>

          <div className="rounded-lg bg-ink px-5 py-10 text-center md:px-10 md:py-14">
            <p className="nf-eyebrow text-[11px] text-halloween">
              Main stage
            </p>
            <h2
              id="cosplay-heading"
              className="nf-display mt-4 text-[clamp(2.75rem,12vw,5.5rem)] text-text-inverse"
            >
              Cosplay{" "}
              <br />
              Competition
            </h2>

            <span className="nf-on-reveal-stamp nf-stamp mt-6 inline-flex border-halloween text-halloween">
              Confirmed
            </span>

            <p
              className="mx-auto mt-6 max-w-md text-text-inverse-secondary md:text-lg"
            >
              A major cosplay competition is part of Nostalgia Fest Halloween.
              Full details are being finalized and will be announced closer to
              the show.
            </p>
          </div>

          {/* Stub. The tear line is what turns the poster into a pass, and
              the board below it is the part you would actually carry. */}
          <div
            aria-hidden="true"
            className="nf-perforation my-4 text-text-inverse"
          />

          <div className="rounded-lg bg-ink-soft px-5 py-6 md:px-8 md:py-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="nf-eyebrow text-[10px] text-text-inverse-secondary">
                Competition board
              </p>
              <p className="tabular-nums nf-eyebrow text-[10px] text-text-inverse-secondary">
                {pending} of {rows.length} still to be announced
              </p>
            </div>

            <dl className="mt-4 divide-y divide-border-inverse border-t border-b border-border-inverse">
              {rows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-baseline gap-4 py-3.5"
                >
                  <dt className="nf-display shrink-0 text-xl text-text-inverse md:text-2xl">
                    {row.label}
                  </dt>
                  <dd className="flex flex-1 items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="nf-perforation flex-1 text-text-inverse"
                    />
                    {row.value ? (
                      <span className="shrink-0 text-right text-sm text-text-inverse">
                        {row.value}
                      </span>
                    ) : (
                      <span className="nf-eyebrow shrink-0 text-[10px] whitespace-nowrap text-halloween">
                        Announced soon
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </article>

        <p className="mt-6 text-center text-sm text-text-inverse-secondary">
          {halloween2026.venue}. Free General Admission.
        </p>
      </RevealOnScroll>
    </section>
  );
}
