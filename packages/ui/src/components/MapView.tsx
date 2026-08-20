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

  const [gpsErrors, setGpsErrors] = useState<Record<string, boolean>>({});

  const runnerMap = useMemo(() => {
    return Object.fromEntries(runners.map((runner) => [runner._id, runner]));
  }, [runners]);

  useEffect(() => {
    const requestActiveRunners = () => {
      socket.emit('request-active-runners');
    };

    socket.on('connect', requestActiveRunners);
    if (socket.connected) {
      requestActiveRunners();
    }

    socket.on('active-runners', (activeRunners: RunnerPosition[]) => {
      setPositions((prev) => {
        const next = { ...prev };
        activeRunners.forEach((runner) => {
          if (runner.lat != null && runner.lng != null) {
            next[runner.runnerId] = [runner.lat, runner.lng];
          }
        });
        return next;
      });

      setGpsErrors((prev) => {
        const next = { ...prev };
        activeRunners.forEach((runner: any) => {
          next[runner.runnerId] = runner.hasGpsError ?? false;
        });
        return next;
      });
    });

    socket.on(
      'gps-error',
      ({ runnerId, hasError }: { runnerId: string; hasError: boolean }) => {
        setGpsErrors((prev) => ({ ...prev, [runnerId]: hasError }));
      },
    );

    socket.on('update-runners', (data: RunnerPosition) => {
      setPositions((prev) => ({
        ...prev,
        [data.runnerId]: [data.lat, data.lng],
      }));
    });

    const remove = ({ runnerId }: { runnerId: string }) => {
      setPositions((prev) => {
        const next = { ...prev };
        delete next[runnerId];
        return next;
      });
      setGpsErrors((prev) => {
        const next = { ...prev };
        delete next[runnerId];
        return next;
      });
    };

    socket.on('runner-stopped', remove);
    socket.on('runner-timed-out', remove);

    return () => {
      socket.off('connect', requestActiveRunners);
      socket.off('active-runners');
      socket.off('update-runners');
      socket.off('gps-error');
      socket.off('runner-stopped', remove);
      socket.off('runner-timed-out', remove);
    };
  }, [socket]);

  const defaultCenter: [number, number] = [55.6761, 12.5683];

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
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
              icon={RunnerIcon(
                runner.imageUrl || '',
                gpsErrors[runnerId] || false,
              )}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
