import { MapView } from '@dhl-relay/ui/src/components/MapView';
import { sanityClient } from '@/sanityClient';
import { socket } from '@/socketClient';

export default function ResultPage() {
  return <MapView client={sanityClient} socket={socket} />;
}
