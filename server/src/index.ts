import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { sanityClient } from './sanityClient.js';
import type { RunnerPosition } from '@dhl-relay/shared';
import { getPendingResultQuery } from '@dhl-relay/shared';

// ActiveRunner extends Partial<RunnerPosition> (makes all properties optional)
interface ActiveRunner extends Partial<RunnerPosition> {
  runnerId: string;
  teamId: string;
  startedAt: number;
  lastSeenAt: number;
  hasGpsError?: boolean;
}

// Create a map to keep track of active runners
const activeRunners = new Map<string, ActiveRunner>();

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes without a position
const TIMEOUT_CHECK_INTERVAL_MS = 30 * 1000; // Check for timeouts every 30 seconds

// Create an HTTP server and connect the Socket.IO server to it
const server = http.createServer();
const io = new Server(server, {
  cors: { origin: '*' },
});

// Function to handle new socket connections (from clients)
// io is the socket.io server
// socket is the individual socket connection for each client
io.on('connection', (socket) => {
  console.log('Runner connected');

  // Send the list of active runners to the newly connected client
  const sendActiveRunners = () => {
    socket.emit('active-runners', Array.from(activeRunners.values()));
  };

  sendActiveRunners();
  socket.on('request-active-runners', sendActiveRunners);

  // Listen for events from the runner-app and update the activeRunners map accordingly
  socket.on(
    'start',
    async ({ runnerId, teamId }: { runnerId: string; teamId: string }) => {
      if (activeRunners.has(runnerId)) return; // already active - locked for others

      try {
        // How many of the team's 5 slots belong to this runner (they may occupy more than one), vs. how many results already exist for them on this team.
        const [slotsForRunner, existingResults] = await Promise.all([
          sanityClient.fetch<number>(
            `count(*[_type == "team" && _id == $teamId][0].runners[_ref == $runnerId])`,
            { teamId, runnerId },
          ),
          sanityClient.fetch<number>(
            `count(*[_type == "result" && runner._ref == $runnerId && team._ref == $teamId && defined(result)])`,
            { teamId, runnerId },
          ),
        ]);

        if (existingResults >= slotsForRunner) {
          socket.emit('start-error', {
            message:
              'This runner has already run the maximum number of times for this team.',
          });
          return;
        }
      } catch (err) {
        console.error('Could not verify team slots:', err);
        socket.emit('start-error', {
          message: 'Could not verify team status, please try again.',
        });
        return;
      }

      // If the runner is allowed to start, add them to the activeRunners map and notify all clients
      const now = Date.now();
      activeRunners.set(runnerId, {
        runnerId,
        teamId,
        startedAt: now,
        lastSeenAt: now,
      });

      console.log('Run started');
      // Send the updated list of active runners to all connected clients
      io.emit('active-runners', Array.from(activeRunners.values()));
    },
  );

  // Handle position updates from the runner-app
  socket.on('position', (data: RunnerPosition) => {
    const existing = activeRunners.get(data.runnerId);
    if (!existing) return;

    activeRunners.set(data.runnerId, {
      ...existing,
      ...data,
      lastSeenAt: Date.now(),
    });

    console.log('Position received and sent to clients');

    io.emit('update-runners', data);
  });

  // Handle GPS error events from the runner-app
  socket.on(
    'gps-error',
    ({ runnerId, hasError }: { runnerId: string; hasError: boolean }) => {
      const existing = activeRunners.get(runnerId);
      if (!existing) return;

      activeRunners.set(runnerId, { ...existing, hasGpsError: hasError });
      io.emit('gps-error', { runnerId, hasError });
    },
  );

  // Handle runner stopped events from the runner-app
  socket.on('stop', async ({ runnerId }: { runnerId: string }) => {
    const runner = activeRunners.get(runnerId);
    activeRunners.delete(runnerId);

    io.emit('runner-stopped', { runnerId });

    if (runner) {
      const resultSeconds = Math.round((Date.now() - runner.startedAt) / 1000);

      try {
        const pending = await sanityClient.fetch<{
          _id: string;
          cutoff: number | null;
        } | null>(getPendingResultQuery, { runnerId, teamId: runner.teamId });

        if (pending) {
          await sanityClient
            .patch(pending._id)
            .set({ result: resultSeconds })
            .commit();
        } else {
          await sanityClient.create({
            _type: 'result',
            runner: { _type: 'reference', _ref: runnerId },
            team: { _type: 'reference', _ref: runner.teamId },
            result: resultSeconds,
          });
        }

        console.log(
          `Saved result for ${runnerId} on team ${runner.teamId}: ${resultSeconds} seconds`,
        );

        io.emit('runner-finished', { runnerId, resultSeconds });
      } catch (err) {
        console.error('Could not save result in Sanity:', err);
      }
    }
  });

  // Handle runner cancelled events from the runner-app
  socket.on('cancel', ({ runnerId }: { runnerId: string }) => {
    activeRunners.delete(runnerId);
    io.emit('runner-stopped', { runnerId });

    console.log(`Run cancelled for ${runnerId} - nothing saved to Sanity`);
  });
});

// Removes runners who've gone silent (crashed app, dead battery, forgot to press stop) without writing a result - admin fills that in manually in Sanity Studio
setInterval(() => {
  const now = Date.now();

  for (const [runnerId, runner] of activeRunners) {
    if (now - runner.lastSeenAt > TIMEOUT_MS) {
      activeRunners.delete(runnerId);
      io.emit('runner-timed-out', { runnerId });
      console.warn(
        `Runner ${runnerId} timed out - needs manual result entry in Sanity`,
      );
    }
  }
}, TIMEOUT_CHECK_INTERVAL_MS);

// Start the server and listen on the specified port (default: 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
