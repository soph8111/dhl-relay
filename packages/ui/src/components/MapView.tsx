import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useEffect, useState, useMemo } from 'react';
import type { Socket } from 'socket.io-client';
import type { SanityClient } from '@sanity/client';
import { type RunnerPosition } from '@dhl-relay/shared';
import { useRunners } from '../hooks/useRunners';
import { RunnerIcon } from './RunnerIcon';

interface MapViewProps {
  client: SanityClient;
  socket: Socket;
}

export function MapView({ client, socket }: MapViewProps) {
  const [positions, setPositions] = useState<Record<string, [number, number]>>(
    {},
  );
  const { runners, loading, error } = useRunners(client);

  const runnerMap = useMemo(() => {
    return Object.fromEntries(runners.map((runner) => [runner._id, runner]));
  }, [runners]);

  useEffect(() => {
    socket.on('update-runners', (data: RunnerPosition) => {
      setPositions((prev) => ({
        ...prev,
        [data.runnerId]: [data.lat, data.lng],
      }));
    });

    return () => {
      socket.off('update-runners');
    };
  }, [socket]);

  const defaultCenter: [number, number] = [55.6761, 12.5683];

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Object.entries(positions).map(([runnerId, position]) => {
          const runner = runnerMap[runnerId];
          if (!runner) return null;

          return (
            <Marker
              key={runnerId}
              position={position}
              icon={RunnerIcon(runner.imageUrl || '')}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
