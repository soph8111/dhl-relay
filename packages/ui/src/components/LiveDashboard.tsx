import { useState } from 'react';
import type { SanityClient } from '@sanity/client';
import type { Socket } from 'socket.io-client';
import type { LeaderboardEntry } from '@dhl-relay/shared';
import { MapView } from './MapView';
import { Leaderboard } from './Leaderboard';
import { StatsGrid } from './StatsGrid';
import { TeamStandingsCard } from './TeamStandingsCard';
import { LiveIndicator } from './LiveIndicator';
import { StatsCarousel } from './StatsCarousel';
import { RunEventNotifications } from './RunEventNotifications';
import { RunnerDetailModal } from './RunnerDetailModal';

interface LiveDashboardProps {
  sanityClient: SanityClient;
  sanityClientFresh: SanityClient;
  socket: Socket;
  cartoApiKey: string;
  hasBottomNav?: boolean;
  isApp?: boolean;
}

export function LiveDashboard({
  sanityClient,
  sanityClientFresh,
  socket,
  cartoApiKey,
  hasBottomNav,
  isApp,
}: LiveDashboardProps) {
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(
    null,
  );

  return (
    <>
      <RunEventNotifications
        client={sanityClientFresh}
        socket={socket}
        isApp={isApp}
      />

      <LiveIndicator />
      <div
        className="flex flex-col gap-8
        md:h-[75vh] md:min-h-0
        md:grid md:gap-3
        md:[grid-template-areas:'board_map_side'] md:grid-cols-[2fr_1fr_auto]
        2xl:[grid-template-areas:'board_map'_'board_bottom'] 2xl:grid-cols-[2fr_3fr] 2xl:grid-rows-[1fr_296px]"
      >
        <div className="md:[grid-area:map]">
          <MapView
            client={sanityClient}
            socket={socket}
            cartoApiKey={cartoApiKey}
          />
        </div>
        <div className="md:[grid-area:board] md:min-h-0 md:max-h-full md:h-full">
          <Leaderboard
            client={sanityClientFresh}
            onSelectEntry={setSelectedEntry}
          />
        </div>

        <div className="flex flex-col gap-3 2xl:hidden md:[grid-area:side] md:h-full md:min-h-0">
          <StatsCarousel client={sanityClientFresh} />
          <TeamStandingsCard client={sanityClientFresh} />
        </div>

        <div className="hidden 2xl:flex 2xl:[grid-area:bottom] gap-5">
          <div className="flex-3">
            <StatsGrid client={sanityClientFresh} />
          </div>
          <div className="flex-1">
            <TeamStandingsCard client={sanityClientFresh} />
          </div>
        </div>
      </div>
      <RunnerDetailModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        hasBottomNav={hasBottomNav}
      />
    </>
  );
}
