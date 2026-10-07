import { HALLOWEEN_COSPLAY } from "@/lib/halloween-content";
import { halloween2026 } from "@/lib/events";
import RevealOnScroll from "./RevealOnScroll";

/**
 * The page's signature section, and the biggest experiential moment after
 * the hero.
 *
 * SIGNATURE MOMENT 2: the stage. Two spotlight cones breathe out of phase
 * above a competition poster built as a physical pass: slab label across
 * the top, the title, a stamped CONFIRMED mark that lands on scroll, then a
 * perforated stub carrying the entry rules.
 *
 * Only rules confirmed in docs/event-data.md render, from HALLOWEEN_COSPLAY
 * in src/lib/halloween-content.ts. Adding a rule, or the registration link
 * once it exists, is a data change there, not a layout change.
 */
export default function CosplayCompetition() {
  const { summary, rules, registrationUrl } = HALLOWEEN_COSPLAY;

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
              {summary}
            </p>
          </div>

          {/* Stub. The tear line is what turns the poster into a pass, and
              the board below it is the part you would actually carry. */}
          <div
            aria-hidden="true"
            className="nf-perforation my-4 text-text-inverse"
          />

          <div className="rounded-lg bg-ink-soft px-5 py-6 md:px-8 md:py-7">
            <p className="nf-eyebrow text-[10px] text-text-inverse-secondary">
              How to compete
            </p>

            <dl className="mt-4 divide-y divide-border-inverse border-t border-b border-border-inverse">
              {rules.map((rule) => (
                <div
                  key={rule.label}
                  className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <dt className="nf-display shrink-0 text-xl text-text-inverse md:text-2xl">
                    {rule.label}
                  </dt>
                  <dd className="text-sm text-text-inverse sm:flex-1 sm:text-right">
                    {rule.value}
                  </dd>
                </div>
              ))}
            </dl>
            {registrationUrl ? (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nf-action nf-action-halloween mt-6 w-full px-6 py-3 text-sm"
              >
                Register for the Cosplay Competition
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        </article>

        <p className="mt-6 text-center text-sm text-text-inverse-secondary">
          {halloween2026.venue}. Free General Admission.
        </p>
      </RevealOnScroll>
    </section>
  );
}
