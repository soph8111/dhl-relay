import { useEffect, useRef, useState, type ReactNode } from 'react';
import { socket } from '@/socketClient';
import { sanityClient, sanityClientFresh } from '@/sanityClient';
import { useTeamsForYear, useTeamRunners } from '@dhl-relay/ui';
import type { RunnerPosition } from '@dhl-relay/shared';
import { RunSessionContext } from './RunSessionContext';

const POSITION_INTERVAL_MS = 3000;

// React context provider for managing the state of a running session, including selected team and runner, GPS tracking, and run results
export function RunSessionProvider({ children }: { children: ReactNode }) {
  // Fetch teams for the current year using the custom useTeamsForYear hook
  const { teams, loading: teamsLoading } = useTeamsForYear(sanityClient);

  // State variables for managing selected team and runner
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const { runners, loading: runnersLoading } = useTeamRunners(
    sanityClientFresh,
    selectedTeamId,
  );
  const [selectedRunnerId, setSelectedRunnerId] = useState<string | null>(null);
  // State variable to keep track of runner IDs that are currently taken (active)
  const [takenRunnerIds, setTakenRunnerIds] = useState<Set<string>>(new Set());

  // State variables for managing GPS tracking and run results
  const [watchId, setWatchId] = useState<number | null>(null);
  const [hasGpsError, setHasGpsError] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finalResultSeconds, setFinalResultSeconds] = useState<number | null>(
    null,
  );

  // Refs to keep track of the last time a position was sent and the last GPS error state
  const lastSentAt = useRef(0);
  const lastGpsErrorState = useRef(false);

  useEffect(() => {
    // Request the list of active runners from the server (before the socket connects)
    const requestActiveRunners = () => socket.emit('request-active-runners');

    // Handle socket events for active runners, updates, and errors
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

    // Cleanup function to remove socket event listeners when the component unmounts
    return () => {
      socket.off('connect', requestActiveRunners);
      socket.off('active-runners');
      socket.off('update-runners');
      socket.off('runner-stopped', release);
      socket.off('runner-timed-out', release);
      socket.off('start-error');
    };
  }, []);

  // Set selected team and runner IDs
  const selectTeam = (id: string) => {
    setSelectedTeamId(id);
    setSelectedRunnerId(null);
  };

  const selectRunner = (id: string) => {
    setSelectedRunnerId(id);
  };

  // Start a running session by initiating GPS tracking and sending position updates to the server
  const start = () => {
    if (!selectedTeamId || !selectedRunnerId) return;

    console.log('[Runner] Run started');

    // Send a start event to the server with the selected runner and team IDs
    socket.emit('start', {
      runnerId: selectedRunnerId,
      teamId: selectedTeamId,
    });
    setHasGpsError(false);
    lastGpsErrorState.current = false;
    setStartedAt(Date.now());

    // Start the GPS tracking and send position updates to the server at regular intervals
    const id = navigator.geolocation.watchPosition(
      (position) => {
        if (lastGpsErrorState.current) {
          console.log('GPS connection restored');

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

        // Get the latitude and longitude from the GPS position
        const { latitude, longitude } = position.coords;

        console.log('GPS position received');

        // Send the position to the server
        socket.emit('position', {
          runnerId: selectedRunnerId,
          lat: latitude,
          lng: longitude,
        });
      },
      () => {
        console.log('GPS error');

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

  // Stop the running session by clearing GPS tracking and sending a stop event to the server
  const stop = () => {
    // Clear the GPS tracking
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    // Send a stop event to the server with the selected runner ID
    if (selectedRunnerId) {
      console.log('Run finished');

      socket.emit('stop', { runnerId: selectedRunnerId });
    }

    // Calculate the final result seconds based on the start time and current time
    if (startedAt) {
      setFinalResultSeconds(Math.round((Date.now() - startedAt) / 1000));
    }

    setHasGpsError(false);
    lastGpsErrorState.current = false;
  };

  // Cancel the running session by clearing GPS tracking and sending a cancel event to the server
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

  // Reset the running session state, including selected team and runner IDs, start time, and final result seconds
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
