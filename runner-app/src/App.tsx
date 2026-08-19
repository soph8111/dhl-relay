import { useState } from 'react';
import { useRunners } from '@dhl-relay/ui/src/hooks/useRunners';
import { sanityClient } from '@/sanityClient';
import { socket } from '@/socketClient';

export default function App() {
  const { runners, loading, error } = useRunners(sanityClient);

  const [selectedRunner, setSelectedRunner] = useState<string | null>(
    localStorage.getItem('runnerId'),
  );
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleSelect = (value: string) => {
    setSelectedRunner(value);
    localStorage.setItem('runnerId', value);
  };

  const handleStart = () => {
    if (!selectedRunner) {
      alert('Vælg en løber først');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        socket.emit('position', {
          runnerId: selectedRunner,
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
      },
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
          <option key={runner._id} value={runner._id}>
            {runner.firstName && runner.lastName
              ? `${runner.firstName} ${runner.lastName}`
              : runner.alias}
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
    </div>
  );
}
