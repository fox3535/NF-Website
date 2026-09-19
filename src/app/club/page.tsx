import type { Metadata } from "next";
import Image from "next/image";
import ClubSignupForm from "@/components/ClubSignupForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "NF Club: Join the Nostalgia Fest Community",
  description:
    "NF Club is the free Nostalgia Fest email list. Hear about upcoming events, guest announcements, giveaways and activations, and pick the collecting interests you care about.",
  alternates: { canonical: "/club" },
  openGraph: {
    title: "Join NF Club",
    description:
      "The free Nostalgia Fest email list for upcoming events, announcements and the things you collect.",
  },
};

// What NF Club members hear about. Kept to what NF already announces
// publicly: no discounts, early access or guaranteed perks, because none
// are approved (docs/platform-v1-plan.md, section 2).
const WHAT_YOU_HEAR = [
  {
    title: "New shows",
    body: "Dates, venues and details when a new Nostalgia Fest event is announced.",
  },
  {
    title: "Guests and announcements",
    body: "Who is coming and what is new on the floor, as it gets confirmed.",
  },
  {
    title: "Giveaways and activations",
    body: "Contests, special activations and things happening at the show.",
  },
  {
    title: "Your corner of collecting",
    body: "Pokemon, One Piece, sports cards, toys, comics, art and cosplay. Tell us what you are into.",
  },
];

/**
 * /club: the canonical NF Club signup page. Static: the only server work is
 * the Server Action on submit, so the page renders with Supabase unset or
 * down (docs/platform-architecture.md section 1.1).
 *
 * The form sits in the hero and comes straight after the headline on mobile,
 * before the value list, because joining is the one job this page has.
 */
export default function ClubPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section
          aria-labelledby="club-heading"
          className="nf-halftone relative overflow-hidden bg-brand pt-10 pb-16 text-text-inverse md:pt-16 md:pb-24"
        >
          {/* Print registration marks and a colour-bar strip, the trim-edge
              details of a printed card sheet. Decorative, low contrast, kept
              to the corners so they never sit behind copy. */}
          <RegistrationMark className="absolute top-4 right-4 md:top-6 md:right-6" />
          <RegistrationMark className="absolute bottom-6 left-4 hidden md:block md:left-6" />
          <div
            aria-hidden="true"
            className="absolute right-4 bottom-6 flex gap-1 opacity-50 md:right-6"
          >
            {["bg-pink", "bg-gold-bright", "bg-cyan-bright", "bg-ink"].map((tone) => (
              <span key={tone} className={`block size-2.5 ${tone}`} />
            ))}
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-8 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-x-14 lg:gap-y-10">
            <div className="lg:col-start-1 lg:row-start-1 lg:pt-6">
              <p className="nf-eyebrow text-xs text-pink-bright md:text-sm">
                Free to join · No account needed
              </p>
              <h1
                id="club-heading"
                className="nf-display mt-4 text-[clamp(3.5rem,15vw,8.5rem)]"
              >
                Join the <span className="text-gold-bright">NF&nbsp;Club</span>
              </h1>
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-text-inverse md:mt-5 md:text-xl">
                Your direct line to Nostalgia Fest. Hear when a new show is
                announced, who is coming, and which giveaways and activations
                are happening on the floor.
              </p>
            </div>

            <div
              id="join"
              className="nf-case relative scroll-mt-24 text-text lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              <span
                aria-hidden="true"
                className="nf-stamp absolute -top-3 right-5 z-10 rotate-[4deg] bg-gold-bright text-ink"
              >
                Free
              </span>
              <div className="nf-case-label text-text-secondary">
                <span>
                  NF Club <span aria-hidden="true" className="text-brand">✦</span> Member signup
                </span>
              </div>
              <div className="rounded-xl border-2 border-ink bg-paper p-4 sm:p-6">
                <ClubSignupForm source="club-page" sourceFromUrl />
              </div>
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              <h2 className="nf-eyebrow text-xs text-pink-bright md:text-sm">
                What you&apos;ll hear about
              </h2>
              <ol className="mt-5 grid gap-5 sm:grid-cols-2">
                {WHAT_YOU_HEAR.map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="nf-numeral text-5xl text-pink"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-text-inverse-secondary">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div
          aria-hidden="true"
          className="nf-notch -mt-[18px] rotate-180"
          style={{ ["--nf-notch-color" as string]: "var(--color-paper)" }}
        />

        <section
          aria-labelledby="club-about-heading"
          className="relative overflow-hidden bg-paper py-16 md:py-24"
        >
          <div aria-hidden="true" className="nf-warmlight" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-14">
            <figure className="nf-case relative w-full md:mx-auto md:max-w-xl lg:max-w-none lg:rotate-[-1.5deg]">
              <figcaption className="nf-case-label text-text-secondary">
                <span>Previous Nostalgia Fest</span>
                <span className="text-brand">Archive photo</span>
              </figcaption>
              <div className="overflow-hidden rounded-lg border-2 border-ink">
                <Image
                  src="/images/photos/hero-crowd.jpg"
                  alt="Attendees browsing glass display cases of trading cards at a previous Nostalgia Fest, with a packed ballroom behind them."
                  width={1536}
                  height={2048}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="aspect-[4/3] w-full object-cover object-[50%_40%] contrast-[1.1] saturate-[1.15] lg:aspect-[5/4]"
                />
              </div>
            </figure>

            <div>
              <p className="nf-eyebrow text-xs text-brand md:text-sm">What is NF Club?</p>
              <h2
                id="club-about-heading"
                className="nf-display mt-3 text-5xl text-text md:text-6xl"
              >
                For the people who come to the shows
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-text-secondary">
                NF Club is how Nostalgia Fest keeps its community in the loop.
                Collectors, families, artists and fans get the news straight
                from us by email, instead of hoping the algorithm shows it to
                them.
              </p>
              <ul className="mt-6 grid gap-3 text-base font-semibold text-text">
                {[
                  "Free to join",
                  "No account or password",
                  "Pick the interests you care about",
                  "Unsubscribe any time",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-md bg-brand text-sm text-text-inverse"
                    >
                      ✓
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <a
                href="#join"
                className="nf-action nf-action-filled mt-8 min-h-13 px-6 text-base"
              >
                Join NF Club
                <span aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function RegistrationMark({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-6 text-pink opacity-60 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="6" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
}
