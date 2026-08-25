import { io } from 'socket.io-client';
import { DHL_ROUTE_2026 } from '@dhl-relay/ui';

// In terminal: run "npx tsx server/scripts/simulate-runner.ts <RUNNER_ID>" to simulate a runner moving along the DHL route
// The runner will move at a constant speed of 30 km/h and send its position to the server every 5 seconds
// The simulation will stop when the runner reaches the end of the route

const ROUTE = DHL_ROUTE_2026;

const SPEED_KMH = 30; // sped up on purpose for fast testing
const SEND_INTERVAL_MS = 5000; // matches runner-app's throttle interval

function haversine(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const segmentLengths = ROUTE.slice(1).map((point, i) =>
  haversine(ROUTE[i]!, point),
);
const totalDistance = segmentLengths.reduce((a, b) => a + b, 0);

function positionAtDistance(distance: number): [number, number] {
  let remaining = distance;
  for (let i = 0; i < segmentLengths.length; i++) {
    if (remaining <= segmentLengths[i]!) {
      const t = remaining / segmentLengths[i]!;
      const [lat1, lng1] = ROUTE[i]!;
      const [lat2, lng2] = ROUTE[i + 1]!;
      return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t];
    }
    remaining -= segmentLengths[i]!;
  }
  return ROUTE[ROUTE.length - 1]!;
}

const runnerId = process.argv[2];
if (!runnerId) {
  console.error('Usage: npx tsx server/scripts/simulate-runner.ts <runnerId>');
  process.exit(1);
}

const serverUrl = process.argv[3] ?? 'http://localhost:3000';
const socket = io(serverUrl);

console.log(`Route length: ${(totalDistance / 1000).toFixed(2)} km`);

let distanceCovered = 0;
const speedMps = (SPEED_KMH * 1000) / 3600;

socket.on('connect', () => {
  console.log(`Simulated runner connected (${runnerId})`);
  socket.emit('start', { runnerId });

  const interval = setInterval(() => {
    distanceCovered += speedMps * (SEND_INTERVAL_MS / 1000);

    if (distanceCovered >= totalDistance) {
      const [lat, lng] = ROUTE[ROUTE.length - 1]!;
      socket.emit('position', { runnerId, lat, lng });
      console.log('Reached finish - stopping');
      socket.emit('stop', { runnerId });
      clearInterval(interval);
      setTimeout(() => socket.disconnect(), 500);
      return;
    }

    const [lat, lng] = positionAtDistance(distanceCovered);
    socket.emit('position', { runnerId, lat, lng });
  }, SEND_INTERVAL_MS);
});

socket.on('disconnect', () => {
  console.log('Simulated runner disconnected');
});
