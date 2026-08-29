import EventCard from "./EventCard";
import RevealOnScroll from "./RevealOnScroll";
import { upcomingEvents } from "@/lib/events";

export default function UpcomingEvents() {
  return (
    <section
      id="upcoming-events"
      aria-labelledby="upcoming-events-heading"
      className="bg-paper-strong py-12 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">The calendar</p>
        <h2
          id="upcoming-events-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          More Nostalgia Fest events
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
