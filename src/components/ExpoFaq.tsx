import RevealOnScroll from "./RevealOnScroll";
import { EXPO_FAQ } from "@/lib/expo-content";

/**
 * FAQ — native <details>/<summary> for accordion behaviour with zero JS and
 * full keyboard/screen-reader support by default. Only answers questions
 * the confirmed data actually supports; adding one later is a data change
 * (EXPO_FAQ in src/lib/expo-content.ts). Re-entry, parking, children, pets,
 * accessibility and ticket-transfer policies are deliberately absent —
 * none of that is documented.
 */
export default function ExpoFaq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-paper py-12 md:py-16">
      <RevealOnScroll className="mx-auto max-w-3xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Good to know</p>
        <h2
          id="faq-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Expo FAQ
        </h2>

        <div className="mt-8 divide-y divide-border border-t border-b border-border">
          {EXPO_FAQ.map((item) => (
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
