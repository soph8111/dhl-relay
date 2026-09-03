import {
  MapView,
  Leaderboard,
  StatsGrid,
  TeamStandingsCard,
  ThemeToggle,
} from '@dhl-relay/ui';
import { sanityClient, sanityClientFresh } from '@/sanityClient';
import { socket } from '@/socketClient';

export default function ResultPage() {
  return (
    <>
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <MapView client={sanityClient} socket={socket} />
      <Leaderboard client={sanityClientFresh} />
      <StatsGrid client={sanityClientFresh} />
      <TeamStandingsCard client={sanityClientFresh} />
    </>
  );
}
