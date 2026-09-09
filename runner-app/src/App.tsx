import { useState, useEffect, useRef } from 'react';
import { useTeamsForYear } from '@dhl-relay/ui/src/hooks/useTeamsForYear';
import { useTeamRunners } from '@dhl-relay/ui/src/hooks/useTeamRunners';
import { sanityClient } from '@/sanityClient';
import { socket } from '@/socketClient';
import type { RunnerPosition } from '@dhl-relay/shared';

const POSITION_INTERVAL_MS = 8000;

export default function App() {
  const { teams, loading: teamsLoading } = useTeamsForYear(sanityClient);

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const { runners, loading: runnersLoading } = useTeamRunners(
    sanityClient,
    selectedTeam,
  );

  const [selectedRunner, setSelectedRunner] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [takenRunnerIds, setTakenRunnerIds] = useState<Set<string>>(new Set());
  const [hasGpsError, setHasGpsError] = useState(false);

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

    return () => {
      socket.off('connect', requestActiveRunners);
      socket.off('active-runners');
      socket.off('update-runners');
      socket.off('runner-stopped', release);
      socket.off('runner-timed-out', release);
    };
  }, []);

  useEffect(() => {
    socket.on('start-error', ({ message }: { message: string }) => {
      alert(message);
    });

    return () => {
      socket.off('start-error');
    };
  }, []);

  // Choosing a new team invalidates any previously chosen runner - they
  // belonged to the old team's list, which no longer applies.
  const handleSelectTeam = (value: string) => {
    setSelectedTeam(value);
    setSelectedRunner(null);
  };

  const handleStart = () => {
    if (!selectedTeam) {
      alert('Vælg et hold først');
      return;
    }
    if (!selectedRunner) {
      alert('Vælg dig selv fra holdet');
      return;
    }

    socket.emit('start', { runnerId: selectedRunner, teamId: selectedTeam });
    setHasGpsError(false);
    lastGpsErrorState.current = false;

    const id = navigator.geolocation.watchPosition(
      (position) => {
        if (lastGpsErrorState.current) {
          lastGpsErrorState.current = false;
          setHasGpsError(false);
          socket.emit('gps-error', {
            runnerId: selectedRunner,
            hasError: false,
          });
        }

        const now = Date.now();
        if (now - lastSentAt.current < POSITION_INTERVAL_MS) return;
        lastSentAt.current = now;

        const { latitude, longitude } = position.coords;
        socket.emit('position', {
          runnerId: selectedRunner,
          lat: latitude,
          lng: longitude,
        });
      },
      () => {
        if (!lastGpsErrorState.current) {
          lastGpsErrorState.current = true;
          setHasGpsError(true);
          socket.emit('gps-error', {
            runnerId: selectedRunner,
            hasError: true,
          });
        }
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );

    setWatchId(id);
  };

  const handleStop = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    if (selectedRunner) {
      socket.emit('stop', { runnerId: selectedRunner });
    }

    setHasGpsError(false);
    lastGpsErrorState.current = false;
  };

  if (teamsLoading) return <p>Indlæser hold...</p>;

  const isRunning = watchId !== null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Vælg hold</h1>

      <select
        value={selectedTeam || ''}
        onChange={(e) => handleSelectTeam(e.target.value)}
        disabled={isRunning}
      >
        <option value="">-- vælg hold --</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.teamName}
          </option>
        ))}
      </select>

      {selectedTeam && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Vælg dig selv</h2>
          {runnersLoading ? (
            <p>Indlæser løbere...</p>
          ) : (
            <select
              value={selectedRunner || ''}
              onChange={(e) => setSelectedRunner(e.target.value)}
              disabled={isRunning}
            >
              {Array.from(new Map(runners.map((r) => [r._id, r])).values()).map(
                (runner) => {
                  const totalOccurrences = runners.filter(
                    (r) => r._id === runner._id,
                  ).length;

                  const baseName =
                    runner.firstName && runner.lastName
                      ? `${runner.firstName} ${runner.lastName}`
                      : runner.alias;

                  const label =
                    totalOccurrences > 1
                      ? `${baseName} (${totalOccurrences} runder)`
                      : baseName;

                  return (
                    <option
                      key={runner._id}
                      value={runner._id}
                      disabled={takenRunnerIds.has(runner._id)}
                    >
                      {label +
                        (takenRunnerIds.has(runner._id) ? ' (optaget)' : '')}
                    </option>
                  );
                },
              )}
            </select>
          )}
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        {!isRunning ? (
          <button onClick={handleStart}>Start løb</button>
        ) : (
          <button onClick={handleStop}>Stop løb</button>
        )}
      </div>

      {hasGpsError && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
          }}
        >
          GPS-signal mistet – din tid kører stadig
        </div>
      )}
    </div>
  );
}
