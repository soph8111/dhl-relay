import { useState, useEffect, useRef } from 'react';
import { useRunners } from '@dhl-relay/ui/src/hooks/useRunners';
import { sanityClient } from '@/sanityClient';
import { socket } from '@/socketClient';
import type { RunnerPosition } from '@dhl-relay/shared';

// Interval for sending position updates to the server (in milliseconds)
const POSITION_INTERVAL_MS = 5000;

export default function App() {
  const { runners, loading, error } = useRunners(sanityClient);

  const [selectedRunner, setSelectedRunner] = useState<string | null>(
    localStorage.getItem('runnerId'),
  );
  const [watchId, setWatchId] = useState<number | null>(null);
  const [takenRunnerIds, setTakenRunnerIds] = useState<Set<string>>(new Set());
  const [hasGpsError, setHasGpsError] = useState(false);

  const lastSentAt = useRef(0);
  const lastGpsErrorState = useRef(false);

  useEffect(() => {
    const requestActiveRunners = () => {
      socket.emit('request-active-runners');
    };

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

  const handleSelect = (value: string) => {
    setSelectedRunner(value);
    localStorage.setItem('runnerId', value);
  };

  const handleStart = () => {
    if (!selectedRunner) {
      alert('Vælg en løber først');
      return;
    }

    // Locks the runner in immediately, independent of whether GPS ever succeeds.
    socket.emit('start', { runnerId: selectedRunner });
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
        // Clock keeps running server-side regardless - this is just a heads-up.
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

  if (loading) return <p>Indlæser løbere...</p>;
  if (error) return <p>{error}</p>;

  const isRunning = watchId !== null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Vælg løber</h1>

      <select
        value={selectedRunner || ''}
        onChange={(e) => handleSelect(e.target.value)}
        disabled={isRunning}
      >
        <option value="">-- vælg --</option>
        {runners.map((runner) => (
          <option
            key={runner._id}
            value={runner._id}
            disabled={takenRunnerIds.has(runner._id)}
          >
            {(runner.firstName && runner.lastName
              ? `${runner.firstName} ${runner.lastName}`
              : runner.alias) +
              (takenRunnerIds.has(runner._id) ? ' (optaget)' : '')}
          </option>
        ))}
      </select>

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
