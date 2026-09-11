import { useEffect, useRef, useState, type ReactNode } from 'react';
import { socket } from '@/socketClient';
import { sanityClient, sanityClientFresh } from '@/sanityClient';
import { useTeamsForYear } from '@dhl-relay/ui/src/hooks/useTeamsForYear';
import { useTeamRunners } from '@dhl-relay/ui/src/hooks/useTeamRunners';
import type { RunnerPosition } from '@dhl-relay/shared';
import { RunSessionContext } from './RunSessionContext';

const POSITION_INTERVAL_MS = 8000;

export function RunSessionProvider({ children }: { children: ReactNode }) {
  const { teams, loading: teamsLoading } = useTeamsForYear(sanityClient);

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { runners, loading: runnersLoading } = useTeamRunners(
    sanityClientFresh,
    selectedTeamId,
  );

  const [selectedRunnerId, setSelectedRunnerId] = useState<string | null>(null);
  const [takenRunnerIds, setTakenRunnerIds] = useState<Set<string>>(new Set());

  const [watchId, setWatchId] = useState<number | null>(null);
  const [hasGpsError, setHasGpsError] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finalResultSeconds, setFinalResultSeconds] = useState<number | null>(
    null,
  );

  const lastSentAt = useRef(0);
  const lastGpsErrorState = useRef(false);

  useEffect(() => {
    const requestActiveRunners = () => socket.emit('request-active-runners');

    socket.on('connect', requestActiveRunners);
    if (socket.connected) requestActiveRunners();

    socket.on('active-runners', (activeRunners: { runnerId: string }[]) => {
      setTakenRunnerIds(new Set(activeRunners.map((r) => r.runnerId)));
    });

    socket.on('update-runners', (data: RunnerPosition) => {
      setTakenRunnerIds((prev) => new Set(prev).add(data.runnerId));
    });

    const release = ({ runnerId }: { runnerId: string }) => {
      setTakenRunnerIds((prev) => {
        const next = new Set(prev);
        next.delete(runnerId);
        return next;
      });
    };

    socket.on('runner-stopped', release);
    socket.on('runner-timed-out', release);

    socket.on('start-error', ({ message }: { message: string }) => {
      alert(message);
    });

    return () => {
      socket.off('connect', requestActiveRunners);
      socket.off('active-runners');
      socket.off('update-runners');
      socket.off('runner-stopped', release);
      socket.off('runner-timed-out', release);
      socket.off('start-error');
    };
  }, []);

  const selectTeam = (id: string) => {
    setSelectedTeamId(id);
    setSelectedRunnerId(null);
  };

  const selectRunner = (id: string) => {
    setSelectedRunnerId(id);
  };

  const start = () => {
    if (!selectedTeamId || !selectedRunnerId) return;

    socket.emit('start', {
      runnerId: selectedRunnerId,
      teamId: selectedTeamId,
    });
    setHasGpsError(false);
    lastGpsErrorState.current = false;
    setStartedAt(Date.now());

    const id = navigator.geolocation.watchPosition(
      (position) => {
        if (lastGpsErrorState.current) {
          lastGpsErrorState.current = false;
          setHasGpsError(false);
          socket.emit('gps-error', {
            runnerId: selectedRunnerId,
            hasError: false,
          });
        }

        const now = Date.now();
        if (now - lastSentAt.current < POSITION_INTERVAL_MS) return;
        lastSentAt.current = now;

        const { latitude, longitude } = position.coords;
        socket.emit('position', {
          runnerId: selectedRunnerId,
          lat: latitude,
          lng: longitude,
        });
      },
      () => {
        if (!lastGpsErrorState.current) {
          lastGpsErrorState.current = true;
          setHasGpsError(true);
          socket.emit('gps-error', {
            runnerId: selectedRunnerId,
            hasError: true,
          });
        }
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );

    setWatchId(id);
  };

  const stop = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (selectedRunnerId) {
      socket.emit('stop', { runnerId: selectedRunnerId });
    }

    if (startedAt) {
      setFinalResultSeconds(Math.round((Date.now() - startedAt) / 1000));
    }

    setHasGpsError(false);
    lastGpsErrorState.current = false;
  };

  const cancel = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (selectedRunnerId) {
      socket.emit('cancel', { runnerId: selectedRunnerId });
    }

    setHasGpsError(false);
    lastGpsErrorState.current = false;
    setStartedAt(null);
  };

  const reset = () => {
    setSelectedTeamId(null);
    setSelectedRunnerId(null);
    setStartedAt(null);
    setFinalResultSeconds(null);
  };

  return (
    <RunSessionContext.Provider
      value={{
        teams,
        teamsLoading,
        selectedTeamId,
        selectTeam,
        runners,
        runnersLoading,
        selectedRunnerId,
        selectRunner,
        takenRunnerIds,
        isRunning: watchId !== null,
        hasGpsError,
        startedAt,
        finalResultSeconds,
        start,
        stop,
        cancel,
        reset,
      }}
    >
      {children}
    </RunSessionContext.Provider>
  );
}
