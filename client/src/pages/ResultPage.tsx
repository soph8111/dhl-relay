import { MapView, Leaderboard, StatsGrid } from '@dhl-relay/ui';
import { sanityClient, sanityClientFresh } from '@/sanityClient';
import { socket } from '@/socketClient';

export default function ResultPage() {
  return (
    <>
      <MapView client={sanityClient} socket={socket} />
      <Leaderboard client={sanityClientFresh} />
      <StatsGrid client={sanityClientFresh} />
    </>
  );
}
