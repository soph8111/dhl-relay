import { useRunners } from '@dhl-relay/ui/src/hooks/useRunners';
import { useState } from 'react';
import { sanityClient } from '../sanityClient';
import { socket } from '../socketClient';

export default function RunnerPage() {
  const { runners, loading, error } = useRunners(sanityClient);

  const [selectedRunner, setSelectedRunner] = useState<string | null>(
    localStorage.getItem('runnerId'),
  );

  const handleSelect = (value: string) => {
    setSelectedRunner(value);
    localStorage.setItem('runnerId', value);
  };

  const handleStart = () => {
    if (!selectedRunner) {
      alert('Please select a runner');
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const data = {
          runnerId: selectedRunner,
          lat: latitude,
          lng: longitude,
        };

        console.log('Sender:', data);

        socket.emit('position', data);
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div>
        <h1>Vælg løber</h1>

        <select
          value={selectedRunner || ''}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">-- vælg --</option>
          {runners.map((runner) => (
            <option key={runner._id} value={runner._id}>
              {runner.firstName && runner.lastName
                ? `${runner.firstName} ${runner.lastName}`
                : runner.alias}{' '}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleStart}>Start løb</button>
    </>
  );
}
