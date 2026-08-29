import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

interface ProofImage {
  src: string;
  alt: string;
  caption: string;
  aspect: string;
}

const IMAGES: ProofImage[] = [
  {
    src: "/images/photos/scale-crowd.jpg",
    alt: "A wide view of a packed ballroom aisle lined with vendor tables and chandeliers.",
    caption: "The show floor — April 2026",
    aspect: "aspect-3/2",
  },
  {
    src: "/images/photos/marketplace-deal.jpg",
    alt: "Two attendees shaking hands over a binder of graded trading cards on a vendor table.",
    caption: "A deal in progress — April 2026",
    aspect: "aspect-4/5",
  },
  {
    src: "/images/photos/family-artist-alley.jpg",
    alt: "A family browsing a table of plush toys and collectibles beneath a grand staircase.",
    caption: "Artist alley — April 2026",
    aspect: "aspect-3/2",
  },
];

export default function SocialProof() {
  return (
    <section
      aria-labelledby="social-proof-heading"
      className="bg-paper py-12 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Social proof</p>
        <h2
          id="social-proof-heading"
          className="nf-display mt-3 max-w-3xl text-4xl text-text md:text-5xl"
        >
          Scenes from previous Nostalgia Fest events
        </h2>
        <p className="mt-4 max-w-prose text-text-secondary">
          A look at what our community has already built — not footage from
          the upcoming Expo.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {IMAGES.map((image) => (
            <figure key={image.src} className="flex flex-col gap-3">
              <div
                className={`relative ${image.aspect} overflow-hidden rounded-lg outline outline-black/10`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 90vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <span aria-hidden="true" className="text-gold">
                  ✦
                </span>
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
