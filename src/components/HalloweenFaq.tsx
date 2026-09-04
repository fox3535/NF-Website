import RevealOnScroll from "./RevealOnScroll";
import { HALLOWEEN_FAQ } from "@/lib/halloween-content";

/**
 * FAQ, same native <details>/<summary> pattern as ExpoFaq: zero JS, full
 * keyboard and screen-reader support by default. Only answers questions the
 * confirmed data supports.
 */
export default function HalloweenFaq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-paper py-14 md:py-20">
      <RevealOnScroll className="mx-auto max-w-3xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Good to know</p>
        <h2
          id="faq-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Halloween FAQ
        </h2>

        <div className="mt-8 divide-y divide-border border-t border-b border-border">
          {HALLOWEEN_FAQ.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-text marker:content-none">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-text-secondary">{item.answer}</p>
            </details>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
