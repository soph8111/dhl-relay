import { LiveDashboard } from '@dhl-relay/ui';
import { Header } from '@dhl-relay/ui';
import { ThemeProvider } from '@dhl-relay/ui';
import { sanityClient, sanityClientFresh } from './sanityClient';
import { socket } from './socketClient';

function App() {
  return (
    <ThemeProvider>
      <div className="m-4 md:m-5">
        <Header />
        <main>
          <LiveDashboard
            sanityClient={sanityClient}
            sanityClientFresh={sanityClientFresh}
            socket={socket}
            cartoApiKey={import.meta.env.VITE_CARTO_API_KEY}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
