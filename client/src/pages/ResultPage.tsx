import {
  MapView,
  Leaderboard,
  StatsGrid,
  TeamStandingsCard,
  LiveIndicator,
} from '@dhl-relay/ui';
import { sanityClient, sanityClientFresh } from '@/sanityClient';
import { socket } from '@/socketClient';

export default function ResultPage() {
  return (
    <>
      <LiveIndicator />
      <div className="flex flex-col gap-5 md:grid md:grid-cols-3">
        <MapView
          client={sanityClient}
          socket={socket}
          cartoApiKey={import.meta.env.VITE_CARTO_API_KEY}
        />
        <Leaderboard client={sanityClientFresh} />
        <StatsGrid client={sanityClientFresh} />
        <TeamStandingsCard client={sanityClientFresh} />
      </div>
    </>
  );
}
