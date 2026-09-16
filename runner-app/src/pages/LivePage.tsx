import { LiveDashboard } from '@dhl-relay/ui';
import { sanityClient, sanityClientFresh } from '../sanityClient';
import { socket } from '../socketClient';

export default function LivePage() {
  return (
    <LiveDashboard
      sanityClient={sanityClient}
      sanityClientFresh={sanityClientFresh}
      socket={socket}
      cartoApiKey={import.meta.env.VITE_CARTO_API_KEY}
      hasBottomNav={true}
    />
  );
}
