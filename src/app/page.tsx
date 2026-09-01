import CampaignWall from "@/components/CampaignWall";
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
        <CampaignWall />
        <ReelsCarousel />
        <WhatIsNF />
        <InsideNF />
        <UpcomingEvents />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
