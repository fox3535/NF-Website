import CampaignWall from "@/components/CampaignWall";
import ClubTeaser from "@/components/ClubTeaser";
import FinalCta from "@/components/FinalCta";
import InsideNF from "@/components/InsideNF";
import ReelsCarousel from "@/components/ReelsCarousel";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StickyCta from "@/components/StickyCta";
import UpcomingEvents from "@/components/UpcomingEvents";
import WhatIsNF from "@/components/WhatIsNF";

/**
 * Homepage: discovery → excitement → choosing an event.
 *
 * Detailed planning (full hours, directions, programming, ticketing) now
 * lives on the event landing pages. The marketplace, featured-event and
 * plan-your-visit sections were absorbed into the campaign wall and the
 * events carousel.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pb-24 md:pb-0">
        <h1 className="sr-only">
          Nostalgia Fest: trading cards, collectibles and pop culture events
        </h1>
        <CampaignWall />
        <ReelsCarousel />
        <WhatIsNF />
        <InsideNF />
        <UpcomingEvents />
        <FinalCta />
        {/* After the attendance close, never before it: NF Club is the
            secondary action for people not ready to pick a show yet. */}
        <ClubTeaser
          source="homepage"
          heading="Hear what's coming next"
          body="Join NF Club to hear about upcoming shows, guests, giveaways and activations, straight from Nostalgia Fest."
        />
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
