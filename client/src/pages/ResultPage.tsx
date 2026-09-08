import {
  MapView,
  Leaderboard,
  StatsGrid,
  TeamStandingsCard,
  LiveIndicator,
  StatsCarousel,
} from '@dhl-relay/ui';
import { sanityClient, sanityClientFresh } from '@/sanityClient';
import { socket } from '@/socketClient';

export default function ResultPage() {
  return (
    <>
      <LiveIndicator />
      <div
        className="flex flex-col gap-5
        md:h-[75vh] md:min-h-0
        md:grid md:gap-3
        md:[grid-template-areas:'board_map_side'] md:grid-cols-[2fr_1fr_auto]
        2xl:[grid-template-areas:'board_map'_'board_bottom'] 2xl:grid-cols-[2fr_3fr] 2xl:grid-rows-[1fr_296px]"
      >
        <div className="md:[grid-area:map]">
          <MapView
            client={sanityClient}
            socket={socket}
            cartoApiKey={import.meta.env.VITE_CARTO_API_KEY}
          />
        </div>

        <div className="md:[grid-area:board] md:min-h-0 md:max-h-full md:h-full">
          <Leaderboard client={sanityClientFresh} />
        </div>

        {/* Mobile and tablet: carousel stats, side by side with teams */}
        <div className="flex flex-col gap-3 2xl:hidden md:[grid-area:side] md:h-full md:min-h-0">
          <StatsCarousel client={sanityClientFresh} />
          <TeamStandingsCard client={sanityClientFresh} />
        </div>

        {/* Large screen: full stats-grid, side by side with teams */}
        <div className="hidden 2xl:flex 2xl:[grid-area:bottom] gap-5">
          <div className="flex-3">
            <StatsGrid client={sanityClientFresh} />
          </div>
          <div className="flex-1">
            <TeamStandingsCard client={sanityClientFresh} />
          </div>
        </div>
      </div>
    </>
  );
}
