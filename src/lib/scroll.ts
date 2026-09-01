/**
 * Scroll a horizontal carousel track to an offset.
 *
 * Always scrolls the track itself rather than calling scrollIntoView on a
 * child: a slide can be taller than the viewport, and scrollIntoView would
 * drag the whole page vertically just to advance a carousel.
 *
 * Smooth scrolling is requested but not trusted. Some environments accept
 * `behavior: "smooth"` and then do nothing, which would leave the carousel
 * looking broken, so the position is checked on the next frames and an
 * instant jump is applied if nothing moved.
 */
export function scrollTrackTo(track: HTMLElement, left: number): void {
  const target = Math.max(0, Math.min(left, track.scrollWidth - track.clientWidth));
  const start = track.scrollLeft;

  if (Math.abs(target - start) < 1) return;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    track.scrollLeft = target;
    return;
  }

  track.scrollTo({ left: target, behavior: "smooth" });

  // If the smooth scroll never started, fall back to an instant jump.
  window.setTimeout(() => {
    if (Math.abs(track.scrollLeft - start) < 1) {
      track.scrollLeft = target;
    }
  }, 250);
}

/** Offset that puts a card flush to the start of its track. */
export function startOffset(track: HTMLElement, card: HTMLElement): number {
  return card.offsetLeft - track.offsetLeft;
}

/** Offset that centres a card within its track. */
export function centreOffset(track: HTMLElement, card: HTMLElement): number {
  return (
    card.offsetLeft -
    track.offsetLeft -
    (track.clientWidth - card.clientWidth) / 2
  );
}
