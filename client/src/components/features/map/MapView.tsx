import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { socket } from '../../../services/socket';

type RunnerPosition = {
  runnerId: string;
  lat: number;
  lng: number;
};

export default function MapView() {
  const [runners, setRunners] = useState<Record<string, [number, number]>>({});

  useEffect(() => {
    socket.on('update-runners', (data: RunnerPosition) => {
      console.log('Modtager:', data);

      setRunners((prev) => ({
        ...prev,
        [data.runnerId]: [data.lat, data.lng],
      }));
    });

    return () => {
      socket.off('update-runners');
    };
  }, []);

  const defaultCenter: [number, number] = [55.6761, 12.5683];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {Object.entries(runners).map(([runnerId, position]) => (
        <Marker key={runnerId} position={position} />
      ))}
    </MapContainer>
  );
}
