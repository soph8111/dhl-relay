import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
} from 'react-leaflet';
import { useEffect, useState, useMemo } from 'react';
import type { Socket } from 'socket.io-client';
import type { SanityClient } from '@sanity/client';
import { type RunnerPosition } from '@dhl-relay/shared';
import { useRunners } from '../hooks/useRunners';
import { RunnerIcon } from './RunnerIcon';
import { DHL_ROUTE_2026 } from '@dhl-relay/ui';
import { useTheme } from '../context/ThemeContext';

interface MapViewProps {
  client: SanityClient;
  socket: Socket;
  cartoApiKey: string;
}

export function MapView({ client, socket, cartoApiKey }: MapViewProps) {
  const { theme } = useTheme();

  const tileUrl =
    theme === 'dark'
      ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`
      : `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`;

  const [positions, setPositions] = useState<Record<string, [number, number]>>(
    {},
  );
  const [gpsErrors, setGpsErrors] = useState<Record<string, boolean>>({});

  const { runners, loading, error } = useRunners(client);

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

  const defaultCenter: [number, number] = [
    55.70107442646823, 12.568908098436069,
  ];

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-full">
      <div className="relative w-full h-96 md:h-full rounded-xl overflow-hidden border border-surface dark:border-none">
        <MapContainer
          center={defaultCenter}
          className="w-full h-full"
          zoom={15}
        >
          <TileLayer
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline
            positions={DHL_ROUTE_2026}
            pathOptions={{
              color: 'var(--color-purple)',
              weight: 1.8,
              opacity: 0.8,
            }}
            className="pointer-events-none!"
          />
          <CircleMarker
            center={DHL_ROUTE_2026[0]}
            radius={4}
            pathOptions={{
              weight: 1,
              fillColor: 'var(--color-green)',
              color: 'var(--color-green)',
              fillOpacity: 1,
            }}
            className="pointer-events-none!"
          />
          <CircleMarker
            center={DHL_ROUTE_2026[DHL_ROUTE_2026.length - 1]}
            radius={4}
            pathOptions={{
              color: 'var(--color-red)',
              weight: 1,
              fillColor: 'var(--color-red)',
              fillOpacity: 1,
            }}
            className="pointer-events-none!"
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
                  runner.firstName ? `${runner.firstName}` : runner.alias || '',
                )}
              />
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
