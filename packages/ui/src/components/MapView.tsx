import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
} from 'react-leaflet';
import { useEffect, useState, useMemo, useRef } from 'react';
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
  const [notifications, setNotifications] = useState<
    { id: string; text: string }[]
  >([]);

  const { runners, loading, error } = useRunners(client);

  const runnerMap = useMemo(() => {
    return Object.fromEntries(runners.map((runner) => [runner._id, runner]));
  }, [runners]);

  // Always holds the latest runnerMap, so the socket listener (set up once) never reads a stale/empty version of it
  const runnerMapRef = useRef(runnerMap);
  useEffect(() => {
    runnerMapRef.current = runnerMap;
  }, [runnerMap]);

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

    socket.on('runner-timed-out', ({ runnerId }: { runnerId: string }) => {
      remove({ runnerId });

      const runner = runnerMapRef.current[runnerId];
      const name = runner
        ? runner.firstName && runner.lastName
          ? `${runner.firstName} ${runner.lastName}`
          : runner.alias
        : 'En løber';

      const notificationId = `${runnerId}-${Date.now()}`;
      setNotifications((prev) => [
        ...prev,
        { id: notificationId, text: `${name} lost connection` },
      ]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }, 6000);
    });

    return () => {
      socket.off('connect', requestActiveRunners);
      socket.off('active-runners');
      socket.off('update-runners');
      socket.off('gps-error');
      socket.off('runner-stopped', remove);
      socket.off('runner-timed-out');
    };
  }, [socket]);

  const defaultCenter: [number, number] = [
    55.70107442646823, 12.568908098436069,
  ];

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-full">
      <div className="relative w-full h-96 md:h-full rounded-xl overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-1100 flex flex-col gap-2 w-11/12 max-w-sm">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white text-gray-900 rounded-lg shadow-lg px-4 py-2 text-sm flex items-center gap-2 border-l-4 border-red"
            >
              <span className="text-red font-bold">!</span>
              <span>{n.text}</span>
            </div>
          ))}
        </div>

        <MapContainer
          center={defaultCenter}
          className="w-full h-full"
          zoom={15}
        >
          <TileLayer
            url={tileUrl}
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* DHL Route drawn on map */}
          <Polyline
            positions={DHL_ROUTE_2026}
            pathOptions={{
              color: 'var(--color-purple)',
              weight: 1.8,
              opacity: 0.8,
            }}
          />
          <CircleMarker
            center={DHL_ROUTE_2026[0]}
            radius={4}
            pathOptions={{
              weight: 1,
              fillColor: '#16a34a',
              color: '#16a34a',
              fillOpacity: 1,
            }}
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
    </div>
  );
}
